import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

async function fetchFriends(builderId: string) {
  const response = await fetch(`https://devq-be0x7.site/networks/${builderId}/onchainFiends`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function FriendsList() {
  const { address } = useAccount();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["friends", address],
    queryFn: () => fetchFriends(address!),
    enabled: !!address,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error fetching friends.</div>;

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Friends</h3>
      {data.length === 0 ? (
        <p>No friends yet.</p>
      ) : (
        <ul>
          {data.map((friend: any) => (
            <li key={friend.address}>{friend.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
