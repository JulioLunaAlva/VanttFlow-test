<<<<<<< HEAD
import * as React from "react"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef(
    ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
        <div
            ref={ref}
            role={decorative ? "none" : "separator"}
            aria-orientation={orientation}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    )
)
Separator.displayName = "Separator"

export { Separator }
=======
import * as React from "react"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef(
    ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
        <div
            ref={ref}
            role={decorative ? "none" : "separator"}
            aria-orientation={orientation}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    )
)
Separator.displayName = "Separator"

export { Separator }
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
