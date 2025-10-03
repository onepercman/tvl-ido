import { Address } from "viem"
import { bsc, bscTestnet } from "viem/chains"
import { useChainId } from "wagmi"

export const addresses = {
  USDC: {
    [bscTestnet.id]: "0xdeb82ECC2474Cb37A1f740E2d9Ce28815B815A3f",
    [bsc.id]: "0x55d398326f99059fF775485246999027B3197955",
  },
  Sale: {
    [bscTestnet.id]: "0x389cc206939826610FCcf2E31843349F8C36D6f4",
    [bsc.id]: "0x5CD6E441d267b3a0D6BE0E7929416DeE02F6b235",
  },
}

export const saleAbi = <const>[
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export function useAddresses() {
  const chainId = useChainId()

  return Object.fromEntries(
    Object.entries(addresses).map(([symbol, chains]) => [
      symbol,
      chains[chainId as keyof typeof chains] ?? undefined,
    ]),
  ) as Record<keyof typeof addresses, Address>
}
