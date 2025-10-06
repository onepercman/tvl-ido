import { Address } from "viem"
import { bsc, monadTestnet } from "viem/chains"
import { useChainId } from "wagmi"

export const addresses = {
  USDC: {
    [monadTestnet.id]: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
    [bsc.id]: "_",
  },
  Sale: {
    [monadTestnet.id]: "0x54A3242e242aAF139562d739305e2e0Ea3F93689",
    [bsc.id]: "_",
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
