"use client"

import { Icon } from "@/shared/icons"
import { cn, forwardRef } from "react-tvcx"

export const Empty = forwardRef(function (
  { as: Component = "div", children, className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn("flex min-h-56 text-lg", className)}
      {...props}
    >
      <div className="m-auto flex flex-col items-center gap-4 p-4">
        <Icon.Empty fontSize={190} />
        <div>{children ?? "Not found"}</div>
      </div>
    </Component>
  )
})

Empty.displayName = "Empty"
