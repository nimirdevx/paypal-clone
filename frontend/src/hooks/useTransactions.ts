"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { api } from "@/lib/api";

export function useTransactions() {
  const { user } = useAuth();

  const {
    data: transactions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: () => api.getTransactions(user!.id),
    enabled: !!user,
  });

  return {
    transactions,
    isLoading,
    refetch,
  };
}
