import * as React from "react"
import { cn } from "@/lib/utils"

// Card — base surface, sin hover scale universal
const Card = React.forwardRef(({ className, interactive = false, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            // Surface base
            "bg-card rounded-3xl border border-border/60",
            // Elevación sutil en dark mode
            "shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.25)]",
            // Solo aplicar hover si se pide explícitamente
            interactive && [
                "transition-all duration-200 cursor-pointer",
                "hover:border-primary/30 hover:shadow-[0_6px_32px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_32px_rgba(0,0,0,0.4)]",
                "active:scale-[0.98]"
            ],
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

// CardHeader — padding responsive, sin fixed p-6
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1 p-5 md:p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

// CardTitle — font-weight real (black), tracking tighter
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-black leading-tight tracking-tight text-lg", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-caption text-muted-foreground mt-1", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 pb-5 md:px-6 md:pb-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center px-5 pb-5 md:px-6 md:pb-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
