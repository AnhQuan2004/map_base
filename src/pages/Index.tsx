import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MapboxGlobe } from "@/components/MapboxGlobe";
import { ActiveUsersCard } from "@/components/ActiveUsersCard";
import { Builder } from "@/types";

const Index = () => {
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Navigation onSelect={setSelectedBuilder} />
      <MapboxGlobe selectedBuilder={selectedBuilder} />
      <ActiveUsersCard />
    </div>
  );
};

export default Index;
