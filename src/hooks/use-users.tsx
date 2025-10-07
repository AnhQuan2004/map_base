import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types";

const fetchUsers = async (): Promise<ApiResponse> => {
  const response = await fetch("https://devq-be0x7.site/networks/68e39a782eaedfa4d163feba");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useUsers = () => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
