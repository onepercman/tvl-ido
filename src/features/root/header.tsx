import { Container } from "@/shared/components"
import { FC } from "react"
import { Link } from "react-router-dom"
import { ConnectWallet } from "./connect-wallet"

export const Header: FC = () => {
  return (
    <header className="inline-flex w-full">
      <Container className="inline-flex items-center justify-between gap-6 py-9">
        <Link to="/">
          <img src="/logo.svg" alt="" className="h-[30px] sm:h-[63px]" />
        </Link>
        <ConnectWallet />
      </Container>
    </header>
  )
}
