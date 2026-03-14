import React from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { cn } from '@/lib/utils';

export const PrivacyBlur = ({ children, className, intensity = 'md' }) => {
    const { privacyMode } = useIdentity();

    if (!privacyMode) return children;

    const blurClass = {
        sm: 'blur-[2px]',
        md: 'blur-[4px]',
        lg: 'blur-[6px]',
        xl: 'blur-[8px]'
    }[intensity];

    return (
        <span className={cn("select-none transition-all duration-300", blurClass, className)} aria-hidden="true">
            {children}
            <span className="sr-only">Oculto por privacidad</span>
        </span>
    );
};
