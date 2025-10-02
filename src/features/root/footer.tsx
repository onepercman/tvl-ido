import { Container } from "@/shared/components"
import { FC } from "react"
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6"

export const Footer: FC = () => {
  return (
    <>
      <footer className="relative overflow-hidden border-b border-line-2">
        <img
          src="/material/footer-bg.png"
          alt=""
          className="absolute bottom-0 left-0 right-0 w-full brightness-50"
        />
        <div className="pointer-events-none absolute inset-0 bg-purple-500 opacity-50 mix-blend-color" />
        <Container className="relative flex !max-w-[881px] flex-wrap justify-between gap-20 pb-10 pt-40 sm:pt-[294px]">
          <div className="flex shrink-0 grow flex-col items-start gap-[28px]">
            <img src="/logo.svg" alt="logo" className="h-[63px]" />
            <div className="text-xl font-semibold text-secondary">
              The gold standard in <br /> Vape2Earn devices
            </div>
          </div>

          <div className="flex grow justify-between gap-6">
            <div className="flex-1 space-y-6 sm:flex-none">
              <div className="text-xl font-semibold">Resources</div>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://app.thevapelabs.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary transition-colors hover:text-foreground"
                  >
                    Minigame
                  </a>
                </li>
                <li>
                  <a
                    href="https://link3.to/thevapelabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary transition-colors hover:text-foreground"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://thevapelabs.gitbook.io/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary transition-colors hover:text-foreground"
                  >
                    Whitepaper
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1 space-y-6 sm:flex-none">
              <div className="text-xl font-semibold">Community</div>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://x.com/thevapelabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-secondary transition-colors hover:text-foreground"
                  >
                    <FaXTwitter size={24} className="text-foreground" />
                    <span>X</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/thevapelabs_channel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-secondary transition-colors hover:text-foreground"
                  >
                    <FaTelegram size={24} className="text-foreground" />
                    <span>Telegram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/JVRVCtTKQ5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-secondary transition-colors hover:text-foreground"
                  >
                    <FaDiscord size={24} className="text-foreground" />
                    <span>Discord</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </footer>
      <div className="w-full px-6 py-4 text-center text-sm text-foreground/40">
        © 2025 TheVapeLabs. All rights reserved.
      </div>
    </>
  )
}
