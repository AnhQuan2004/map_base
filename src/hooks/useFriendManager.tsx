import { useWriteContract, useAccount } from "wagmi";
import FriendManagerABI from "@/abi/FriendManager.json";
import { baseSepolia } from "wagmi/chains";

const contractAddress = "0xa08b52f2253bdFa71AEaDd9FBba87AeAC4020D43";

export function useFriendManager() {
  const { address: account } = useAccount();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

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

  return {
    requestFriend,
    isLoading: isPending,
    isSuccess,
    isError,
  };
}
