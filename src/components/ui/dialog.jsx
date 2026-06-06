import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// Overlay — blur más premium
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50",
            "bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// DialogContent — bottom sheet en mobile, centered en desktop
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                // Mobile: bottom sheet que sube desde abajo
                "fixed z-50 w-full",
                "bottom-0 left-0 right-0",
                "max-h-[90dvh] overflow-y-auto",
                // Desktop: modal centrado clásico
                "sm:bottom-auto sm:left-[50%] sm:top-[50%]",
                "sm:translate-x-[-50%] sm:translate-y-[-50%]",
                "sm:max-w-lg sm:max-h-[85dvh]",
                // Estilos base
                "bg-card border border-border/60",
                "shadow-[0_-8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_-8px_60px_rgba(0,0,0,0.6)]",
                // Bordes — rounded-t-3xl en mobile, rounded-3xl en desktop
                "rounded-t-[2rem] sm:rounded-[2rem]",
                // Animación — slide up en mobile, zoom in en desktop
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=open]:slide-in-from-bottom-4 sm:data-[state=open]:slide-in-from-bottom-0",
                "sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
                "duration-300",
                className
            )}
            {...props}
        >
            {/* Handle bar visual en mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden" aria-hidden>
                <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>

            {children}

            {/* Close button */}
            <DialogPrimitive.Close
                className={cn(
                    "absolute right-4 top-4 z-10",
                    "h-8 w-8 rounded-xl",
                    "flex items-center justify-center",
                    "bg-foreground/8 hover:bg-foreground/12 text-muted-foreground hover:text-foreground",
                    "transition-all duration-150 active:scale-90",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    "disabled:pointer-events-none"
                )}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col space-y-1 text-left px-5 pt-4 pb-2 sm:px-6 sm:pt-5", className)}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col gap-2 px-5 pb-6 pt-2 sm:flex-row sm:justify-end sm:px-6", className)}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-title font-black text-foreground", className)}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
