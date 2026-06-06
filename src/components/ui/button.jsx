import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — accesible, táctil, consistente
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold tracking-tight transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-border bg-transparent hover:bg-foreground/5 hover:border-primary/40 text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-foreground/6 text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        // Premium variant — usado para CTAs importantes
        premium:
          "bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 hover:border-primary/40",
        // Success variant — acciones positivas
        success:
          "bg-emerald-500 text-white hover:bg-emerald-400 shadow-sm",
      },
      size: {
        default: "h-12 px-5 rounded-2xl text-sm",      // 48px — táctil seguro
        sm:      "h-9  px-3 rounded-xl  text-xs",       // 36px
        lg:      "h-14 px-7 rounded-2xl text-base",     // 56px — CTA principal
        xl:      "h-16 px-8 rounded-2xl text-base",     // 64px — hero CTA
        icon:    "h-11 w-11 rounded-xl",                 // 44px — mínimo Apple HIG
        "icon-sm": "h-9  w-9  rounded-lg",
        "icon-lg": "h-14 w-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
