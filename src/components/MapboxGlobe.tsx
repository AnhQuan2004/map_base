import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types';
import { UserPopup } from './UserPopup';

export const MapboxGlobe = () => {
  const { data: apiResponse } = useUsers();
  const users = apiResponse?.connections || [];
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userInteracting = useRef(false);
  const spinEnabled = useRef(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current || !users.length) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiamFzb25nMDMiLCJhIjoiY21nZGR2dnp0MW9lMTJycHl0bDgwb2M0dyJ9.ktCzP9_99FM9DqR-tbNvYg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [100, 20],
      zoom: 3,
      projection: 'globe' as any,
    });

    map.current.on('style.load', () => {
      if (!map.current) return;

      map.current.setFog({
        range: [0.8, 8],
        color: '#aaccff',
        'high-color': '#ffffff',
        'space-color': '#0B1026',
        'horizon-blend': 0.2,
        'star-intensity': 0.8,
      } as any);

      map.current.addSource('users', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: users.map(user => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: user.location,
            },
            properties: {
              id: user._id,
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'users',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'users',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'users',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 0,
        },
      });

      users.forEach(user => {
        const el = document.createElement('div');
        el.className = 'avatar-marker';
        el.style.cssText = `
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-image: url(${user.image_url});
          background-size: cover;
          background-position: center;
          border: 2px solid #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;
        el.id = `avatar-${user._id}`;

        const marker = new mapboxgl.Marker(el)
          .setLngLat(user.location as [number, number])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedUser(user);
        });
      });

      map.current.on('click', 'clusters', (e) => {
        if (!map.current || !e.features) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties?.cluster_id;
        (map.current.getSource('users') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            map.current?.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom: zoom,
            });
          }
        );
      });

      map.current.on('mouseenter', 'clusters', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
      });

      // Rotation animation
      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;

      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled.current && !userInteracting.current && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng += distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      // Handle user interaction
      map.current.on('mousedown', () => {
        userInteracting.current = true;
      });
      
      map.current.on('dragstart', () => {
        userInteracting.current = true;
      });
      
      map.current.on('mouseup', () => {
        userInteracting.current = false;
        setTimeout(() => spinGlobe(), 2000);
      });
      
      map.current.on('touchend', () => {
        userInteracting.current = false;
        setTimeout(() => spinGlobe(), 2000);
      });

      map.current.on('moveend', () => {
        spinGlobe();
      });

      // Start spinning
      spinGlobe();
    });

    return () => {
      map.current?.remove();
    };
  }, [users]);

  return (
    <>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full [&_.mapboxgl-ctrl-attrib]:hidden" />
      {selectedUser && <UserPopup user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </>
  );
};
