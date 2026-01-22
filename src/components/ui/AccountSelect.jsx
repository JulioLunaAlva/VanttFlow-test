import React, { useState } from "react"
import { Check, ChevronsUpDown, Wallet, CreditCard, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const ACCOUNT_ICONS = {
    'wallet': Wallet,
    'bank': Landmark,
    'card': CreditCard,
    'default': Wallet
};

export function AccountSelect({ accounts, value, onChange, placeholder = "Seleccionar cuenta..." }) {
    const [open, setOpen] = useState(false)
    const selectedAccount = accounts.find((a) => a.id === value)

    const getIcon = (account) => {
        if (account.type === 'credit') return CreditCard;
        if (account.type === 'cash') return Wallet;
        if (account.type === 'investment') return Landmark;

        // Fallback for legacy data
        const lowerName = account.name.toLowerCase();
        if (lowerName.includes('banco') || lowerName.includes('bank') || lowerName.includes('cuenta')) return Landmark;
        if (lowerName.includes('tarjeta') || lowerName.includes('card')) return CreditCard;
        return Wallet;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedAccount ? (
                        <div className="flex items-center gap-2">
                            {React.createElement(getIcon(selectedAccount), { size: 16, className: `text-muted-foreground ${selectedAccount.type === 'credit' ? 'text-primary' : ''}` })}
                            <span>{selectedAccount.name}</span>
                            {selectedAccount.type === 'credit' && <span className="text-[10px] bg-primary/10 text-primary px-1 rounded ml-1">Crédito</span>}
                        </div>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 pointer-events-auto">
                <div
                    className="max-h-[40vh] md:max-h-[300px] overflow-y-auto p-1 touch-pan-y overscroll-contain pointer-events-auto"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className={cn(
                                "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm text-sm",
                                value === account.id && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => {
                                onChange(account.id)
                                setOpen(false)
                            }}
                        >
                            {React.createElement(getIcon(account), { size: 16, className: `text-muted-foreground ${account.type === 'credit' ? 'text-primary' : ''}` })}
                            <div className="flex flex-col">
                                <span className="font-medium">{account.name}</span>
                                {account.type === 'credit' && <span className="text-[10px] text-muted-foreground">Tarjeta de Crédito</span>}
                            </div>
                            {value === account.id && (
                                <Check className="ml-auto h-4 w-4 opacity-50" />
                            )}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
