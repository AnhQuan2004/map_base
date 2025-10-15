import { useWriteContract, useAccount, useReadContract } from "wagmi";
import FriendManagerABI from "@/abi/FriendManager.json";
import { baseSepolia } from "wagmi/chains";

const contractAddress = "0xa08b52f2253bdFa71AEaDd9FBba87AeAC4020D43";

export function useFriendManager(friendAddress?: `0x${string}`) {
  const { address: account } = useAccount();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

  const { data: areFriendsStatus, refetch: refetchAreFriends } = useReadContract({
    address: contractAddress,
    abi: FriendManagerABI.abi,
    functionName: 'areFriends',
    args: [account, friendAddress],
    chainId: baseSepolia.id,
    query: {
      enabled: !!account && !!friendAddress,
    },
  });

  const { data: pendingRequestStatus, refetch: refetchPendingRequest } = useReadContract({
    address: contractAddress,
    abi: FriendManagerABI.abi,
    functionName: 'pendingRequest',
    args: [account, friendAddress],
    chainId: baseSepolia.id,
    query: {
      enabled: !!account && !!friendAddress,
    },
  });

  const requestFriend = (to: `0x${string}`) => {
    if (!account) {
      console.error("No account connected");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: FriendManagerABI.abi,
      functionName: "requestFriend",
      args: [to],
      account,
      chain: baseSepolia,
    });
  };

  const acceptRequest = (from: `0x${string}`) => {
    if (!account) {
      console.error("No account connected");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: FriendManagerABI.abi,
      functionName: "acceptRequest",
      args: [from],
      account,
      chain: baseSepolia,
    });
  };

  const rejectRequest = (from: `0x${string}`) => {
    if (!account) {
      console.error("No account connected");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: FriendManagerABI.abi,
      functionName: "rejectRequest",
      args: [from],
      account,
      chain: baseSepolia,
    });
  };

  return {
    requestFriend,
    acceptRequest,
    rejectRequest,
    isLoading: isPending,
    isSuccess,
    isError,
    areFriends: areFriendsStatus,
    isRequestPending: pendingRequestStatus,
    refetchStatus: () => {
      refetchAreFriends();
      refetchPendingRequest();
    },
  };
}
