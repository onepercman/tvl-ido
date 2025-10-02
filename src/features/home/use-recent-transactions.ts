import { eventService } from "@/services"
import { useQuery } from "@tanstack/react-query"

export function useRecentTransactions() {
  return useQuery({
    queryKey: ["recent transactions"],
    staleTime: 10000,
    refetchInterval: 10000,
    async queryFn() {
      const { data } = await eventService.recentTransactions()
      return data.data
    },
  })
}
