import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export function useOrderHistory() {
  const { jwt } = useStore(UserStore)
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ["order history", jwt, page],
    async queryFn() {
      const { data } = await userService.orderHistory({ page, limit: 10 })
      return data.data
    },
  })

  return {
    ...query,
    page,
    setPage,
  }
}
