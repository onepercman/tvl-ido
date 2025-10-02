import { networks } from "@/config/web3.config"

/**
 * Formats a Web3 address with customizable prefix and suffix lengths.
 * @param address - The address to format.
 * @param prefixLength - Number of characters to show at the start of the address (default: 2).
 * @param suffixLength - Number of characters to show at the end of the address (default: 2).
 * @returns The formatted address string.
 */
export function formatAddress(
  address: string,
  prefixLength = 2,
  suffixLength = 4,
): string {
  if (!address || typeof address !== "string") {
    throw new Error("Invalid address. It must be a non-empty string.")
  }
  if (address.length <= prefixLength + suffixLength) {
    return address
  }
  const prefix = address.slice(0, prefixLength)
  const suffix = address.slice(-suffixLength)
  return `${prefix}...${suffix}`
}

export function getBlockUrl(
  hash: string,
  chainId: number | string,
  type: "tx" | "address" = "tx",
) {
  const chain = networks.find(c => c.id === +chainId)
  if (!chain) return ""
  return chain.blockExplorers?.default.url + `/${type}/` + hash
}
