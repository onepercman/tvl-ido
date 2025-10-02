import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export interface WithdrawalHistory {
  amount: number
  completed_date?: string
  id: string
  ip_address: string
  request_date: string
  status: number
  status_string: string
  tx_id: string
  chain_id: string
}

export function useWithdrawalHistory() {
  const { jwt } = useStore(UserStore)
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ["withdrawal history", jwt, page],
    async queryFn() {
      const { data } = await userService.withdrawalHistory({ page, limit: 10 })
      return data.data
    },
  })

  return {
    ...query,
    page,
    setPage,
  }
}
