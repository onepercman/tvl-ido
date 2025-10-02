import { Avatar } from "@/shared/components"
import { IconSax } from "@/shared/icons"
import { timeAgo } from "@/shared/utils/date"
import { formatAddress } from "@/shared/utils/web3"
import { FC } from "react"
import { useRecentTransactions } from "./use-recent-transactions"

export const RecentTransactions: FC = () => {
  const { data } = useRecentTransactions()

  if (!data) return

  return (
    <div className="flex h-full max-h-full min-h-0 flex-col gap-5 overflow-auto">
      {data.map((tx, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-3 rounded bg-component p-4"
        >
          <Avatar className="flex-none" seed={tx.user_wallet} />
          <div className="flex grow flex-col">
            <div className="text-lg">{formatAddress(tx.user_wallet, 8)}</div>
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5">
                <IconSax.Box variant="Bold" size={20} />
                <span className="font-medium">${tx.total_money}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-secondary sm:hidden">
                <span>•</span>
                <span>{timeAgo(tx.created_at)}</span>
              </div>
            </div>
          </div>
          <div className="hidden flex-none text-sm text-muted sm:block">
            {timeAgo(tx.created_at)}
          </div>
        </div>
      ))}
    </div>
  )
}
