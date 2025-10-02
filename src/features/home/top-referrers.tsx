import { Avatar } from "@/shared/components"
import { IconSax } from "@/shared/icons"
import { formatAddress } from "@/shared/utils/web3"
import { FC } from "react"
import { useTopReferrers } from "./use-top-referrers"

export const TopReferrers: FC = () => {
  const { data } = useTopReferrers()

  if (!data) return

  return (
    <div className="flex h-full max-h-full min-h-0 flex-col gap-5 overflow-auto">
      {data.map((referrer, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-3 rounded bg-component p-4"
        >
          <Avatar className="flex-none" seed={referrer.wallet} />
          <div className="flex grow flex-col">
            <div className="text-lg">{formatAddress(referrer.wallet, 8)}</div>
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5">
                <IconSax.Profile2User variant="Bold" size={20} />
                <span className="font-medium">
                  {referrer.downline_count}{" "}
                  {referrer.downline_count > 1 ? "referrers" : "referrer"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
