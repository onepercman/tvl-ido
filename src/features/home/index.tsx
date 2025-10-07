import { Empty, Loader } from "@/shared/components"
import { useCountdown } from "@/shared/hooks/use-countdown"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useCurrentRoundInfo } from "../home/use-current-round"
import { useEvent } from "../home/use-event"
import Onboarding from "../root/onboarding"
import UserStore from "../user/user.store"
import { Hero } from "./hero"
import { Sale } from "./sale"

export default function Home() {
  const { pathname } = useLocation()

  useEffect(() => {
    UserStore.update()
  }, [pathname])

  const {
    data: event,
    isLoading: isLoadingEvent,
    refetch: refetchEvent,
  } = useEvent()
  const { data: currentRoundInfo, isLoading: isLoadingCurrentRoundInfo } =
    useCurrentRoundInfo()

  const startTime = useCountdown((event?.start_time ?? 0) * 1000)

  const endTime = useCountdown((event?.end_time ?? 0) * 1000)

  useEffect(() => {
    if (event?.start_time && startTime.isFinished) {
      refetchEvent()
    }
  }, [event?.start_time, startTime.isFinished])

  if (isLoadingEvent || isLoadingCurrentRoundInfo) return <Loader />

  if (!event) return <Empty />

  if (
    !startTime.isFinished || // Not started
    endTime.isFinished || // Ended
    !currentRoundInfo || // data not ready
    currentRoundInfo.is_sold_out // Sold out
  )
    return <Onboarding />

  return (
    <div className="flex flex-col overflow-hidden">
      <Hero />
      <Sale />
    </div>
  )
}
