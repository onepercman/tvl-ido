import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export interface DirectDownline {
  wallet: string
  create_at: string
  quantity: number
  total_spend: number
}

export function useDirectDownline() {
  const { jwt } = useStore(UserStore)
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ["direct downline", jwt, page],
    async queryFn() {
      const { data } = await userService.directDownline({ page, limit: 10 })
      return data.data
    },
  })

  return {
    ...query,
    page,
    setPage,
  }
}
