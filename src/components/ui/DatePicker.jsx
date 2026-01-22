import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

export const DatePicker = ({ value, onChange, className, required = false, placeholder }) => {
    const inputRef = useRef(null);

    const handleContainerClick = () => {
        if (inputRef.current) {
            // Attempt to open the native picker
            if ('showPicker' in inputRef.current) {
                inputRef.current.showPicker();
            } else {
                inputRef.current.focus();
            }
        }
    };

    return (
        <div
            className={cn("relative flex items-center w-full cursor-pointer", className)}
            onClick={handleContainerClick}
        >
            <Input
                ref={inputRef}
                type="date"
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 cursor-pointer" // Padding left for icon
                placeholder={placeholder}
            />
            <CalendarIcon
                size={16}
                className="absolute left-3 text-muted-foreground pointer-events-none"
            />
        </div>
    );
};
