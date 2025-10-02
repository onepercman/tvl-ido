import { tv } from "tailwind-variants"

export const table = tv({
  base: "overflow-auto text-xs",
  slots: {
    table: "w-full",
    head: "",
    body: "relative",
    column:
      "whitespace-nowrap border-y border-line-2 bg-component px-4 py-2 font-normal text-secondary",
    row: "group",
    cell: "whitespace-nowrap border-b border-line-2 bg-background px-4 py-2 font-medium",
  },
  variants: {
    size: {
      sm: {
        base: "text-xs",
        column: "px-2 py-1",
        cell: "px-2 py-1",
      },
      md: {
        base: "text-sm",
        column: "px-6 py-6 text-base",
        cell: "px-6 py-6 text-lg",
      },
      lg: {
        base: "text-base",
        column: "px-6 py-2",
        cell: "px-6 py-2",
      },
    },
    highlightRow: {
      true: {
        cell: "cursor-pointer transition-colors group-hover:bg-default",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
