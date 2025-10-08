import { Container, Countdown } from "@/shared/components"
import { Icon } from "@/shared/icons"
import { motion } from "framer-motion"
import { FC } from "react"
import { useCurrentRoundInfo } from "./use-current-round"

export const Hero: FC = () => {
  const { data: currentRoundInfo } = useCurrentRoundInfo()

  const sold = currentRoundInfo
    ? formatVolume(currentRoundInfo.info_quality.money_sold)
    : [0, 0, 0, 0]

  if (!currentRoundInfo) return

  return (
    <>
      <img
        src="/material/flare.png"
        alt=""
        className="pointer-events-none absolute -top-[116px] right-0"
        draggable={false}
      />
      <Container className="flex flex-col items-center gap-20 py-24 lg:flex-row lg:items-start">
        <div className="relative flex w-full max-w-[579px] flex-none flex-col items-center pb-[10%]">
          <div className="inline-flex items-start gap-2">
            <Icon.ProtocolHandler className="text-[32px] text-primary sm:text-[52px]" />
            <div className="flex flex-col">
              <div className="font-brand text-2xl font-bold uppercase leading-tight text-primary sm:text-[40px]">
                Investment Volume
              </div>
              {/* <div className="text-sm text-secondary sm:text-base">
                {formatNumber(currentRoundInfo.info_quality.percent, {
                  maximumFractionDigits: 0,
                })}
                % of total packages sold
              </div> */}
            </div>
          </div>
          <div className="mt-[52px] inline-flex w-full justify-center gap-8 sm:justify-start">
            <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-line bg-component text-2xl font-bold sm:text-[40px]">
              $
            </span>
            <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-line bg-component text-2xl font-bold sm:text-[40px]">
              <Countdown pad={false} maxValue={9} value={sold[0]} />
            </span>
            <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-line bg-component text-2xl font-bold sm:text-[40px]">
              <Countdown pad={false} maxValue={9} value={sold[1]} />
            </span>
            <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-line bg-component text-2xl font-bold sm:text-[40px]">
              <Countdown pad={false} maxValue={9} value={sold[2]} />
            </span>
            <span className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-line bg-component text-2xl font-bold sm:text-[40px]">
              <Countdown pad={false} maxValue={9} value={sold[3]} />
            </span>
          </div>
        </div>
        <div className="relative -mb-[20%] flex h-full grow flex-col items-center pb-[50%] lg:pb-[37%]">
          <img
            src="/material/coin-stand.png"
            alt=""
            className="absolute top-1/3 -z-10 w-[120%] -translate-y-1/2 translate-x-[1%] scale-150 select-none"
            draggable={false}
          />
          <motion.img
            variants={{
              appear: {
                opacity: [0, 1],
                scale: [1.8, 1.5],
                filter: ["blur(10px)", "none"],
                transition: { duration: 0.5 },
              },
              idle: {
                y: [0, 10, -10, 0],
                transition: {
                  delay: 1,
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                },
              },
            }}
            draggable={false}
            animate={["appear", "idle"]}
            src="/material/coins.png"
            alt=""
            className="w-full select-none"
          />
        </div>
      </Container>
    </>
  )
}

function formatVolume(
  num: number,
): [number | string, number | string, number | string, number | string] {
  let value: number
  let suffix: string = ""

  if (num < 10000) {
    const str = num.toString().padStart(4, " ")
    return str.split("").map(char => {
      if (char === " ") return 0
      return parseInt(char)
    }) as [number | string, number | string, number | string, number | string]
  } else if (num < 1_000_000) {
    value = Math.floor(num / 1_000)
    suffix = "K"
  } else if (num < 1_000_000_000) {
    value = Math.floor(num / 1_000_000)
    suffix = "M"
  } else {
    value = Math.floor(num / 1_000_000_000)
    suffix = "B"
  }

  const raw = `${value}${suffix}`.padStart(4, " ").slice(0, 4)
  return raw.split("").map(char => {
    if (char === " ") return 0
    return isNaN(parseInt(char)) ? char : parseInt(char)
  }) as [number | string, number | string, number | string, number | string]
}
