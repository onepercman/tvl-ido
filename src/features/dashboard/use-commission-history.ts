import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export interface CommissionHistory {
  buyer_wallet: string
  level: number
  amount_earned: number
  date: string
  tx_id: string
  chain_id: string
}

export function useCommissionHistory() {
  const { jwt } = useStore(UserStore)

  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ["commission history", jwt, page],
    async queryFn() {
      const { data } = await userService.commissionHistory({ page, limit: 10 })
      return data.data
    },
  })

  return {
    ...query,
    page,
    setPage,
  }
}
