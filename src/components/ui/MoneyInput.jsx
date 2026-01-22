<<<<<<< HEAD
import React from 'react';
import { Input } from "@/components/ui/input";

export const MoneyInput = ({ value, onChange, placeholder = "0.00", className, required }) => {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`pl-7 ${className}`}
                required={required}
            />
        </div>
    );
};
=======
import React from 'react';
import { Input } from "@/components/ui/input";

export const MoneyInput = ({ value, onChange, placeholder = "0.00", className, required }) => {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`pl-7 ${className}`}
                required={required}
            />
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
