import { tv } from "tailwind-variants"

export const dialog = tv({
  slots: {
    backdrop: [
      "fixed inset-0 bg-background/80 backdrop-blur",
      "data-[state=open]:animate-in",
      "data-[state=open]:fade-in",
      "data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out",
    ],
    positioner: "fixed inset-0 flex overflow-auto p-6",
    content: [
      "relative h-fit w-fit rounded border border-line-3 bg-component p-6 shadow backdrop-blur",
      "data-[state=open]:animate-in",
      "data-[state=open]:fade-in",
      "data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out",
    ],
    title: "pb-6 text-lg font-medium",
    closeTrigger: "absolute right-6 top-7",
    description: "",
  },
  variants: {
    size: {
      sm: { content: "min-w-[340px]" },
      md: { content: "min-w-[640px]" },
      lg: { content: "min-w-[768px]" },
    },
    placement: {
      center: { content: "m-auto" },
      topCenter: { content: "mx-auto mt-24" },
      left: { content: "mr-auto h-full" },
      right: { content: "ml-auto h-full" },
    },
    scrollBehavior: {
      inside: "",
      outside: "",
    },
  },
  defaultVariants: {
    size: "sm",
    placement: "topCenter",
  },
})
