import { eventService } from "@/services/event.service"
import { useQuery } from "@tanstack/react-query"

export function useEvent() {
  const query = useQuery({
    queryKey: ["event info"],
    staleTime: 5 * 60 * 1000,
    async queryFn() {
      const { data } = await eventService.event()
      return data.data
    },
  })

  return {
    ...query,
  }
}
