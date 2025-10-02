import { colorize, resetCSS, schemes } from "tailwind-schemes"
import tailwindScrollbar from "tailwind-scrollbar"
import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"
import tailwindcssMotion from "tailwindcss-motion"
import colors from "tailwindcss/colors"
import defaultTheme from "tailwindcss/defaultTheme"

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", ...defaultTheme.fontFamily.sans],
        brand: ["a Autobus Omnibus"],
      },
      screens: {
        default: "1510px",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      keyframes: {
        collapse: { from: { height: "0px" }, to: { height: "var(--height)" } },
        aero: {
          "0%": { transform: "translateX(-100%)" },
          "80%": { transform: "translateX(200%)" },
          "100%": { transform: "translateX(200%)" },
        },
        miniping: {
          "75%, 100%": {
            transform: "scale(1.1,1.2)",
            opacity: "0",
          },
        },
      },
      animation: {
        collapse: "collapse",
        aero: "aero",
        miniping: "miniping",
      },
      backgroundImage: {
        countdown: "url(/material/coundown-bg.png)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssMotion,
    tailwindScrollbar({ nocompatible: true }),
    schemes({
      schemes: {
        root: {
          background: colors.black,
          foreground: colors.white,
          primary: {
            DEFAULT: "#7861FF",
            foreground: "#F2EFFF",
          },
          secondary: "rgba(255,255,255,0.7)",
          muted: "rgba(255,255,255,0.4)",
          accent: colorize(colors.cyan, "500", "50"),
          default: "rgba(255,255,255,0.05)",
          component: "rgba(255,255,255,0.05)",
          invert: "#0D0D0D",
          line: "rgba(255,255,255,0.4)",
          "line-2": "rgba(255,255,255,0.1)",
          "line-3": "rgba(255,255,255,0.2)",
          info: colorize(colors.sky, "500", "50"),
          success: colorize(colors.green, "500", "50"),
          warning: colorize(colors.yellow, "500", "50"),
          error: colorize(colors.red, "500", "50"),
        },
      },
    }),
    resetCSS({
      html: "bg-background text-foreground selection:text-primary selection:bg-black antialiased",
      "*": "scrollbar scrollbar-thumb-default scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-track-transparent",
    }),
  ],
}

export default config
