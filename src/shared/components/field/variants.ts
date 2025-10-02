import { tv } from "tailwind-variants"

export const field = tv({
  base: "flex flex-col gap-3",
  slots: {
    label: "font-medium text-secondary",
    errorText: "text-sm text-error",
    helperText: "text-sm text-secondary",
  },
  variants: {
    size: {
      xs: { label: "text-xs" },
      sm: { label: "text-sm" },
      md: { label: "text-base" },
      lg: { label: "text-lg" },
    },
    invalid: {
      true: {
        label: "text-error",
      },
    },
    required: {
      true: {
        label: "after:ml-1 after:inline after:text-error after:content-['*']",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
