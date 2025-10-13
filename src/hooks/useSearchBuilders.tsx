import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const API_URL = "https://devq-be0x7.site/builders?search=";

async function fetchBuilders(searchTerm: string) {
  if (!searchTerm) return [];
  const response = await fetch(`${API_URL}${searchTerm}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.builders;
}

export function useSearchBuilders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["builders", debouncedTerm],
    queryFn: () => fetchBuilders(debouncedTerm),
    enabled: !!debouncedTerm,
  });

  return {
    searchTerm,
    setSearchTerm,
    results: data,
    isLoading,
    isError,
  };
}
