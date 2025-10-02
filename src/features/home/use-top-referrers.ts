import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"

export function useTopReferrers() {
  return useQuery({
    queryKey: ["top referrers"],
    staleTime: 10000,
    refetchInterval: 10000,
    async queryFn() {
      const { data } = await userService.topReferrers()
      return data.data
    },
  })
}
