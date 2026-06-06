import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                // Base — h-12 (48px) táctil seguro, rounded-xl consistente
                "flex h-12 w-full rounded-xl border border-border bg-foreground/5 px-4 py-2",
                // Tipografía — 16px siempre (previene zoom iOS, legible en desktop)
                "text-base font-medium text-foreground placeholder:text-muted-foreground/50",
                // Transiciones y focus — ring 2px estilo Revolut
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/60 focus-visible:bg-primary/5",
                // Hover sutil
                "hover:border-border/80 hover:bg-foreground/[0.07]",
                // Estados especiales
                "disabled:cursor-not-allowed disabled:opacity-40",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                // Shadow sutil — profundidad
                "shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
