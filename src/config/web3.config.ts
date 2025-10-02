import { CreateAppKit } from "@reown/appkit"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { AppKitNetwork } from "@reown/appkit/networks"
import { createAppKit, Metadata } from "@reown/appkit/react"
import { bsc, bscTestnet } from "viem/chains"
import { ENV } from "./env.config"
import { Mode } from "./mode.config"

const defaultChains = {
  [Mode.Dev]: bscTestnet,
  [Mode.Stg]: bsc,
  [Mode.Prd]: bsc,
}

const defaultChain = defaultChains[ENV.MODE]

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [defaultChain]

const projectId = "d6f18e980b17dbc0cbf4395373231804"

// 1. Create the Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
})

// 3. Set up the metadata - Optional
const metadata: Metadata = {
  name: "TVL",
  description: "TVL",
  url: window.origin,
  icons: [new URL("/logo.svg", window.location.origin).toString()],
}

const appKitOptions: CreateAppKit = {
  metadata,
  projectId,
  adapters: [wagmiAdapter],
  networks,
  features: {
    analytics: true,
    email: false,
    socials: false,
    walletFeaturesOrder: [],
  },
}

export const appKitModal = createAppKit(appKitOptions)
