import { appKitModal } from "@/config/web3.config"
import { Avatar, Button, Menu } from "@/shared/components"
import { IconSax } from "@/shared/icons"
import { formatAddress } from "@/shared/utils/web3"
import { Portal } from "@ark-ui/react"
import { useAppKitAccount } from "@reown/appkit/react"
import { FC } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useStore } from "use-valtio-store"
import { useDisconnect } from "wagmi"
import { useAuth } from "../user/auth-provider"
import UserStore from "../user/user.store"

export const ConnectWallet: FC = () => {
  const { status } = useAppKitAccount()
  const { isPending: isAuthPending } = useAuth()
  const { disconnect } = useDisconnect()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useStore(UserStore)

  if (user)
    return (
      <Menu positioning={{ sameWidth: true }}>
        <Menu.Trigger asChild>
          <Button
            leftIcon={<Avatar size="xs" seed={user.wallet} />}
            rightIcon={<IconSax.ArrowDown2 variant="Bold" />}
            className="min-w-36 uppercase"
          >
            {formatAddress(user.wallet)}
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Content>
            <Menu.Item
              value="0"
              className="justify-start"
              onClick={() => appKitModal.open()}
            >
              <IconSax.Wallet2 size={20} variant="Bold" /> Wallet
            </Menu.Item>
            <Menu.Item asChild value="1" className="justify-start">
              <Link to="/order-history">
                <IconSax.ClipboardText size={20} variant="Bold" />
                Order history
              </Link>
            </Menu.Item>
            <Menu.Item asChild value="2" className="justify-start">
              <Link to="/dashboard">
                <IconSax.Element4 size={20} variant="Bold" />
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item
              value="3"
              className="justify-start"
              onClick={function () {
                disconnect()
                if (pathname !== "/") {
                  navigate("/", { replace: true })
                }
              }}
            >
              <IconSax.Logout size={20} variant="Bold" />
              Logout
            </Menu.Item>
          </Menu.Content>
        </Portal>
      </Menu>
    )

  return (
    <Button
      color="primary"
      leftIcon={<IconSax.Wallet2 variant="Bold" />}
      onClick={() => appKitModal.open()}
      loading={
        ["connecting", "reconnecting"].includes(status as string) ||
        isAuthPending
      }
    >
      Connect Wallet
    </Button>
  )
}
