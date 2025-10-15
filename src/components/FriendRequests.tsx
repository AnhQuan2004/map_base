import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { useFriendManager } from "@/hooks/useFriendManager";

async function fetchPendingRequests(builderId: string) {
  const response = await fetch(`https://devq-be0x7.site/networks/pending/received/${builderId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function FriendRequests() {
  const { address } = useAccount();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingRequests", address],
    queryFn: () => fetchPendingRequests(address!),
    enabled: !!address,
  });
  const { acceptRequest, rejectRequest } = useFriendManager();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error fetching requests.</div>;

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Friend Requests</h3>
      {data.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {data.map((request: any) => (
            <li key={request.address} className="flex items-center justify-between">
              <span>{request.name}</span>
              <div>
                <Button onClick={() => acceptRequest(request.address)}>Accept</Button>
                <Button variant="destructive" onClick={() => rejectRequest(request.address)}>Reject</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
