import { useAppKitAccount } from "@reown/appkit/react"
import { useQuery } from "@tanstack/react-query"
import { erc20Abi, formatEther } from "viem"
import { usePublicClient } from "wagmi"
import { useAddresses } from "../home/constants"

export function useUSDTBalance() {
  const addresses = useAddresses()
  const { address } = useAppKitAccount()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ["usdt balance", address, addresses.USDT, publicClient],
    async queryFn() {
      if (!publicClient || !address) return
      const balance = await publicClient.readContract({
        abi: erc20Abi,
        address: addresses.USDT,
        functionName: "balanceOf",
        args: [address as any],
      })
      return +formatEther(balance)
    },
  })
}
