import React, { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import * as Icons from 'lucide-react';

export function CategorySelect({ categories, value, onChange, placeholder = "Seleccionar categoría..." }) {
    const [open, setOpen] = useState(false)
    const selectedCategory = categories.find((c) => c.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedCategory ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                style={{ backgroundColor: selectedCategory.color }}
                            >
                                {Icons[selectedCategory.icon] ?
                                    React.createElement(Icons[selectedCategory.icon], { size: 14 }) :
                                    selectedCategory.name.charAt(0)
                                }
                            </div>
                            {selectedCategory.name}
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
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={cn(
                                "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm text-sm",
                                value === category.id && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => {
                                onChange(category.id)
                                setOpen(false)
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                                style={{ backgroundColor: category.color }}
                            >
                                {Icons[category.icon] ?
                                    React.createElement(Icons[category.icon], { size: 16 }) :
                                    category.name.charAt(0)
                                }
                            </div>
                            <span>{category.name}</span>
                            {value === category.id && (
                                <Check className="ml-auto h-4 w-4 opacity-50" />
                            )}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
