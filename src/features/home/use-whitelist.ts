import { userService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export function useWhitelist() {
  const { jwt } = useStore(UserStore)
  return useQuery({
    queryKey: ["check whitelist", jwt],
    async queryFn() {
      if (!jwt) return
      const { data } = await userService.whitelist()
      return data.data
    },
  })
}
