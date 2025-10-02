import { toaster } from "@/libs/toaster"
import { Empty, Loader, Toaster } from "@/shared/components"
import { useCountdown } from "@/shared/hooks/use-countdown"
import { FC, Fragment, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useCurrentRoundInfo } from "../home/use-current-round"
import { useEvent } from "../home/use-event"
import UserStore from "../user/user.store"
import { Footer } from "./footer"
import { Header } from "./header"
import Onboarding from "./onboarding"

export const Layout: FC = () => {
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
    <Fragment>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="relative grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster toaster={toaster} />
    </Fragment>
  )
}
