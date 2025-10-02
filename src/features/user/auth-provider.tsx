import { toaster } from "@/libs/toaster"
import { userService } from "@/services"
import { createContext, ReactNode, useContext, useEffect } from "react"
import { Address, isAddressEqual } from "viem"
import {
  useAccount,
  useAccountEffect,
  useDisconnect,
  useSignMessage,
} from "wagmi"
import UserStore from "./user.store"

interface AuthContext {
  isPending: boolean
}

const AuthContext = createContext<AuthContext>({ isPending: false })

let toastId: string | undefined

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address, connector } = useAccount()
  const { disconnect } = useDisconnect()

  useAccountEffect({
    onDisconnect() {
      UserStore.logout()
    },
  })

  const { isPending, signMessage } = useSignMessage({
    mutation: {
      onMutate() {
        toastId = toaster.loading({
          title: "Sign message",
          description: "Please sign message to login",
        }) as any as string
      },
      async onSuccess(signature) {
        if (!address) return
        const succeed = await UserStore.login(address, signature)
        if (!succeed) disconnect()
      },
      onError(error) {
        toaster.error({
          title: "Sign message failed",
          description: (error as any).details,
        })
        disconnect()
      },
      onSettled() {
        toaster.dismiss(toastId)
      },
    },
  })

  async function login() {
    if (!address) return
    const { isAuthorized, user } = UserStore
    if (isAuthorized && user && isAddressEqual(user.wallet as Address, address))
      return
    if (typeof connector?.getChainId !== "function") return

    const { data: nonce } = await userService.getNonce(address)

    signMessage({
      message: `Login nonce: ${nonce.data}`,
    })
  }

  useEffect(() => {
    login()
  }, [address, connector])

  return (
    <AuthContext.Provider value={{ isPending }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
