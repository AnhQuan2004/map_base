import { useAccount } from "wagmi";
import { useEffect } from "react";

const API_URL = "https://devq-be0x7.site/auth";

export function useAuth() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const authenticate = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
          });

          if (!response.ok) {
            throw new Error("Authentication failed");
          }

          console.log("Authentication successful");
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }
    };

    authenticate();
  }, [address, isConnected]);
}
