import { tv } from "tailwind-variants"

export const tabs = tv({
  base: "",
  slots: {
    list: "relative inline-flex items-center gap-2",
    trigger:
      "relative inline-flex select-none items-center justify-center gap-2 font-semibold text-secondary transition-colors data-[selected]:text-foreground",
    indicator: "",
    content: "",
  },
  variants: {
    size: {
      sm: {
        trigger: "px-2 py-1 text-sm",
      },
      md: {
        trigger: "px-5 py-3 text-base",
      },
      lg: {
        trigger: "px-3 py-2 text-base",
      },
    },
    variant: {
      solid: {
        list: "",
        trigger: "hover:text-primary data-[selected]:hover:text-invert",
        indicator:
          "absolute bottom-0 left-[var(--left)] h-[var(--height)] w-[var(--width)] rounded bg-primary",
      },
      underlined: {
        list: "",
        indicator:
          "absolute bottom-0 left-[var(--left)] h-1 w-[var(--width)] rounded bg-foreground",
      },
      bordered: {
        list: "rounded border border-line p-1",
        indicator:
          "absolute bottom-1 left-[var(--left)] h-[var(--height)] w-[var(--width)] rounded bg-default",
      },
      light: {
        list: "",
        indicator:
          "absolute bottom-0 left-[var(--left)] h-[var(--height)] w-[var(--width)] rounded bg-default",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
})
