import { userService } from "@/services"
import { useDebounce } from "@reactuses/core"
import { useQuery } from "@tanstack/react-query"
import { useStore } from "use-valtio-store"
import UserStore from "../user/user.store"

export function useValidRefCode(value: string | undefined) {
  const debounced = useDebounce(value, 500)
  const { jwt } = useStore(UserStore)

  return useQuery({
    queryKey: ["check ref code", debounced, jwt],
    async queryFn() {
      try {
        if (!debounced) return
        await userService.checkReferral(debounced)
        return true
      } catch (_) {
        return false
      }
    },
  })
}
