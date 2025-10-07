import { Container, Countdown } from "@/shared/components"
import { useCountdown } from "@/shared/hooks/use-countdown"
import { motion } from "framer-motion"
import { useCurrentRoundInfo } from "../home/use-current-round"
import { useEvent } from "../home/use-event"

export default function Onboarding() {
  const { data: event } = useEvent()
  const { data: currentRoundInfo } = useCurrentRoundInfo()

  const countdown = useCountdown((event?.start_time ?? 0) * 1000)
  const endTime = useCountdown((event?.end_time ?? 0) * 1000)

  return (
    <div className="flex min-h-screen flex-col bg-[url(/onboarding-bg.png)] bg-cover bg-center">
      <img
        src="/onboarding/light-left.png"
        alt=""
        className="pointer-events-none fixed left-0 top-0 w-1/2 object-contain"
      />
      <img
        src="/onboarding/light-right.png"
        alt=""
        className="pointer-events-none fixed right-0 top-0 w-1/2 object-contain"
      />

      {/* <header className="inline-flex w-full border-b border-line-2 bg-component backdrop-blur">
        <Container className="inline-flex items-center justify-between gap-4 py-8">
          <img src="/logo.svg" alt="logo" className="h-5 sm:h-[63px]" />
          <div className="inline-flex items-center gap-8">
            <a
              href="https://x.com/thevapelabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary transition-colors hover:text-foreground"
            >
              <FaXTwitter className="text-2xl text-foreground sm:text-[32px]" />
            </a>

            <a
              href="https://t.me/thevapelabs_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary transition-colors hover:text-foreground"
            >
              <FaTelegram className="text-2xl text-foreground sm:text-[32px]" />
            </a>

            <a
              href="https://discord.gg/JVRVCtTKQ5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary transition-colors hover:text-foreground"
            >
              <FaDiscord className="text-2xl text-foreground sm:text-[32px]" />
            </a>
          </div>
        </Container>
      </header> */}

      <Container className="flex h-full grow flex-col-reverse items-center gap-10 pt-10 sm:flex-col sm:gap-20">
        {(event?.end_time && endTime.isFinished) ||
        currentRoundInfo?.is_sold_out ? (
          <div className="mx-auto flex min-h-80 w-full max-w-[753px] grow flex-col items-center gap-[52px] bg-[url(/onboarding/grid-bg.png)] bg-contain bg-center pb-8 sm:grow-0">
            <div className="inline-flex bg-gradient-to-r from-white to-[#999] bg-clip-text text-[32px] font-extrabold text-transparent sm:text-[70px]">
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
              <span className="grow px-12">ENDING</span>
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[753px] grow flex-col items-center gap-[52px] bg-[url(/onboarding/grid-bg.png)] bg-contain bg-center pb-8 sm:grow-0">
            <div className="bg-gradient-to-r from-[#3926AD] to-[#C367D6] bg-clip-text font-brand text-[32px] font-extrabold text-transparent sm:text-[70px]">
              COMING SOON
            </div>
            <div className="inline-flex w-full items-stretch justify-between">
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
              <div className="flex flex-col items-center gap-5 p-6">
                <Countdown
                  value={countdown.days}
                  className="text-[28px] font-extrabold sm:text-[52px]"
                />
                <div className="text-xl">Days</div>
              </div>
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
              <div className="flex flex-col items-center gap-5 p-6">
                <Countdown
                  value={countdown.hours}
                  className="text-[28px] font-extrabold sm:text-[52px]"
                />
                <div className="text-xl">Hours</div>
              </div>
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
              <div className="flex flex-col items-center gap-5 p-6">
                <Countdown
                  value={countdown.minutes}
                  className="text-[28px] font-extrabold sm:text-[52px]"
                />
                <div className="text-xl">Mins</div>
              </div>
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
              <div className="flex flex-col items-center gap-5 p-6">
                <Countdown
                  value={countdown.seconds}
                  className="text-[28px] font-extrabold sm:text-[52px]"
                />
                <div className="text-xl">Secs</div>
              </div>
              <div className="w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
            </div>
          </div>
        )}

        <div className="relative flex w-full grow items-end justify-center pb-[25%] sm:pb-[15%]">
          <img
            src="/material/coin-stand.png"
            alt=""
            className="absolute bottom-0 left-0 -z-10 w-full select-none object-contain"
            draggable={false}
          />
          <motion.img
            variants={{
              appear: {
                opacity: [0, 1],
                scale: [1.2, 1],
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
            className="w-[50%] select-none"
          />
        </div>
      </Container>
    </div>
  )
}
