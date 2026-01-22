import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Lista curada de iconos relevantes para finanzas
const FINANCE_ICONS = [
    'Wallet', 'CreditCard', 'Banknote', 'CircleDollarSign', 'PiggyBank',
    'ShoppingBag', 'ShoppingCart', 'Store', 'Gift',
    'Utensils', 'Coffee', 'Beer', 'Pizza',
    'Car', 'Bus', 'Train', 'Plane', 'Fuel', 'Bike',
    'Home', 'Building', 'Hammer', 'Wrench', 'Zap', 'Droplets', 'Wifi',
    'Smartphone', 'Laptop', 'Tv', 'Gamepad2', 'Headphones',
    'Stethoscope', 'Pill', 'Heart', 'Activity', 'Dumbbell',
    'GraduationCap', 'Book', 'Pencil',
    'Briefcase', 'MoreHorizontal', 'Smile', 'Dog', 'Baby', 'Music', 'Clapperboard'
];

export const IconPicker = ({ value, onChange }) => {
    const [search, setSearch] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const filteredIcons = FINANCE_ICONS.filter(iconName =>
        iconName.toLowerCase().includes(search.toLowerCase())
    );

    const SelectedIcon = LucideIcons[value] || LucideIcons.HelpCircle;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal px-3">
                    <SelectedIcon className="mr-2 h-4 w-4" />
                    {value || "Seleccionar icono"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2 pointer-events-auto" align="start">
                <Input
                    placeholder="Buscar icono..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 h-8"
                />
                <div
                    className="max-h-[200px] overflow-y-auto p-1 touch-pan-y overscroll-contain pointer-events-auto"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div className="grid grid-cols-6 gap-2">
                        {filteredIcons.map(iconName => {
                            const Icon = LucideIcons[iconName];
                            if (!Icon) return null;
                            return (
                                <Button
                                    key={iconName}
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${value === iconName ? 'bg-accent' : ''}`}
                                    onClick={() => {
                                        onChange(iconName);
                                        setOpen(false);
                                    }}
                                    title={iconName}
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
