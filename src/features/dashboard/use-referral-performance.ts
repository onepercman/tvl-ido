import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export interface ReferralPerformance {
  wallet: string
  total_referral: number
  total_reward: number
  downline_volume: number
  leader_commission: number
  leader_reward: number
  withdrawal_amount: number
}

export function useReferralPerformance() {
  const { jwt } = useStore(UserStore)

  return useQuery({
    queryKey: ["referral performance", jwt],
    async queryFn() {
      const { data } = await userService.referralPerformance()
      return data.data
    },
  })
}
