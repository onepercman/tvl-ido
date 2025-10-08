import { tv } from "tailwind-variants"

export const badge = tv({
  base: [
    "inline-flex select-none items-center gap-1 rounded-md text-center font-medium",
    "min-h-[var(--badge-size)] min-w-[var(--badge-size)]",
  ],
  variants: {
    size: {
      xs: "px-2 py-1 text-xs [--badge-size:1.5rem]",
      sm: "px-3 py-2 text-sm [--badge-size:2rem]",
      md: "px-4 py-2 text-base [--badge-size:25px]",
      lg: "px-4 py-2 text-lg [--badge-size:37px]",
    },
    color: {
      foreground: "border border-line-3 bg-foreground text-invert",
      default: "border border-line-3 bg-default text-foreground",
      primary: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground",
      error: "bg-error text-error-foreground",
      warning: "bg-warning text-warning-foreground",
    },
  },
  defaultVariants: {
    size: "sm",
    color: "default",
  },
})
