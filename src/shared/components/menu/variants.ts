import { tv } from "tailwind-variants"

export const menu = tv({
  slots: {
    content: [
      "w-full overflow-hidden rounded border border-line-3 bg-component p-2 shadow-lg outline-none backdrop-blur",
      "data-[state=open]:animate-in",
      "data-[state=open]:fade-in",
      "data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out",
    ],
    itemGroup: "flex flex-col",
    itemGroupLabel: "w-full px-2 py-1 text-xs text-secondary",
    item: "relative inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded px-3 py-2 font-medium hover:bg-foreground/5",
    itemIndicator: [
      "absolute right-2 top-0 h-full items-center",
      "data-[state=checked]:flex",
    ],
    separator: "my-1 h-px w-full border-line",
  },
  variants: {
    size: {
      xs: { item: "py-1 text-xs" },
      sm: { item: "py-1 text-sm" },
      md: { item: "text-sm" },
      lg: { item: "text-lg" },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
