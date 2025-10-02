import { tv } from "tailwind-variants"

export const avatar = tv({
  base: "relative flex aspect-square flex-none overflow-hidden rounded-full",
  slots: {
    fallback: "m-auto",
    image: "inset-0 object-cover",
  },
  variants: {
    size: {
      xs: { base: "h-6 w-6" },
      sm: { base: "h-10 w-10" },
      md: { base: "h-[52px] w-[52px]" },
      lg: { base: "h-20 w-20" },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
