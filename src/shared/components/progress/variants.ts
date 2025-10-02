import { tv } from "tailwind-variants"

export const progress = tv({
  base: "rounded-full bg-white",
  slots: {
    track: "relative h-2",
    range: "absolute h-full rounded-full bg-black transition-transform",
  },
})
