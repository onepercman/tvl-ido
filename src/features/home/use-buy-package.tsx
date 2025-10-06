import { toaster } from "@/libs/toaster"
import { eventService } from "@/services"
import { IconSax } from "@/shared/icons"
import { sleep } from "@/shared/utils/promise"
import { getBlockUrl } from "@/shared/utils/web3"
import {
  erc20Abi,
  parseTransaction,
  ParseTransactionReturnType,
  parseUnits,
} from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import { useChainId, useReadContract, useWalletClient } from "wagmi"
import UserStore from "../user/user.store"
import { saleAbi, useAddresses } from "./constants"
import { useCurrentRoundInfo } from "./use-current-round"

export function useBuyPackage() {
  const addresses = useAddresses()
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  const { refetch: refetchCurrentRound } = useCurrentRoundInfo()

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    query: { enabled: !!walletClient?.account.address },
    abi: erc20Abi,
    address: addresses.USDC,
    functionName: "allowance",
    args: [walletClient?.account.address as any, addresses.Sale],
  })

  async function approve(amount: bigint) {
    const toast = toaster.loading({
      title: "USDC spending cap approval",
      description: "Please confirm the transaction in your wallet",
    }) as any as string

    try {
      if (!walletClient) return
      const tx = await walletClient.writeContract({
        abi: erc20Abi,
        address: addresses.USDC,
        functionName: "approve",
        args: [addresses.Sale, amount],
      })
      toaster.update(toast, {
        title: "Sent tx successfully",
        description: "Please wait",
      })
      const { status } = await waitForTransactionReceipt(walletClient, {
        hash: tx,
      })

      if (status === "success") {
        refetchAllowance()
        toaster.update(toast, {
          duration: 10000,
          type: "success",
          title: "Success",
          description: "Approved USDC spending cap successfully",
        })
        return true
      }
      toaster.update(toast, {
        duration: 10000,
        type: "error",
        title: "Approve failed",
        description: "Please try again",
      })
      return false
    } catch (err) {
      console.log("[Approve failed error] ", err)
      toaster.update(toast, {
        duration: 10000,
        type: "error",
        title: "Approve failed",
        description: "Please try again",
      })
      return false
    }
  }

  return async function buy(
    eventId: number,
    value: string,
    pack: string,
    roundNumber: number,
    tierNumber: number,
    refCode?: string,
  ) {
    if (!walletClient || allowance === undefined) {
      return toaster.error({
        title: "Wallet error",
        description: "Check your dapp connection or reload",
      })
    }

    const parsedValue = parseUnits(String(+value * +pack), 6)

    if (allowance < parsedValue) {
      const isApproved = await approve(parsedValue)
      if (!isApproved) return
    }

    const toast = toaster.loading({
      title: "Creating order",
      description: "Please wait",
    }) as any as string

    try {
      const { data } = await eventService.order({
        chain_id: chainId.toString(),
        event_id: eventId,
        package_amount: +pack,
        quantity: +value,
        round_number: roundNumber,
        tier_number: tierNumber,
        ref_code: refCode,
      })

      const tx = parseTransaction(
        `0x${data.data.tx_id}` as any,
      ) as Required<ParseTransactionReturnType>

      toaster.update(toast, {
        title: "Created order",
        description: "Please sign the wallet transaction",
      })

      const signedTx = await walletClient.writeContract({
        abi: saleAbi,
        address: addresses.Sale,
        functionName: "buy",
        args: [tx.value],
      })

      await eventService.transaction({
        order_id: data.data.order_id,
        tx_id: signedTx,
      })

      toaster.update(toast, {
        title: "Sent transaction",
        description: (
          <a
            href={getBlockUrl(signedTx, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            Open in explorer
            <IconSax.ExportSquare size={12} />
          </a>
        ),
      })

      refetchCurrentRound()

      const { status } = await waitForTransactionReceipt(walletClient, {
        hash: signedTx,
      })

      await sleep(1)

      if (status === "success") {
        UserStore.update()
        refetchAllowance()
        toaster.update(toast, {
          duration: 30000,
          type: "success",
          title: "Bought package successfully",
          description: (
            <a
              href={getBlockUrl(signedTx, chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Open in explorer
              <IconSax.ExportSquare size={12} />
            </a>
          ),
        })
      } else {
        toaster.update(toast, {
          duration: 30000,
          type: "error",
          title: "Buy failed",
          description: (
            <a
              href={getBlockUrl(signedTx, chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Open in explorer
              <IconSax.ExportSquare size={12} />
            </a>
          ),
        })
      }
    } catch (err: any) {
      await sleep(1)

      const errorMsg = err.details ?? String(err)

      toaster.update(toast, {
        duration: 30000,
        type: "error",
        title: "Transaction failed",
        description: errorMsg,
      })
    }
  }
}
