"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { api } from "@/lib/api"

export function useWallet() {
  const { user } = useAuth()

  const {
    data: wallet,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: () => api.getWallet(user!.id),
    enabled: !!user,
  })

  return {
    wallet,
    isLoading,
    refetch,
  }
}
