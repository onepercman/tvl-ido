import { eventService } from "@/services/event.service"
import { useQuery } from "@tanstack/react-query"
import { useEvent } from "./use-event"

const POLLING_INTERVAL = 10000

export function useCurrentRoundInfo() {
  const { data: event } = useEvent()

  const query = useQuery({
    queryKey: ["current round info", event?.event_id],
    staleTime: POLLING_INTERVAL,
    refetchInterval: POLLING_INTERVAL,
    async queryFn() {
      if (!event) return
      const { data } = await eventService.current(event.event_id)
      return data.data
    },
  })

  const currentRound =
    event &&
    event?.rounds?.find(
      el => el.round_number === query.data?.current_round_number,
    )

  const currentTier =
    currentRound &&
    currentRound.tiers.find(
      el => el.tier_number === query.data?.current_tier_number,
    )

  return { ...query, currentRound, currentTier }
}
