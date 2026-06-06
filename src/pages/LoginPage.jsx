import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useIdentity } from '@/context/IdentityContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LockKeyhole, Delete, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
    const { login, user, isAuthenticated } = useIdentity();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [errorShake, setErrorShake] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                // Auto-submit on 4th digit
                setTimeout(() => handleLogin(newPin), 300);
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleLogin = async (code) => {
        const success = await login(code);
        if (!success) {
            setErrorShake(true);
            setTimeout(() => {
                setErrorShake(false);
                setPin('');
            }, 500);
            toast.error(t('auth.incorrect_pin'));
        } else {
            // Success sound or haptic could go here
        }
    };

    if (!user) {
        navigate('/setup');
        return null;
    }

    return (
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
            {/* Orbs de luz de fondo premium */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

            <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 h-[100dvh] py-12 justify-between">
                
                {/* Header (Avatar & Greeting) */}
                <div className="flex flex-col items-center mt-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary/40 to-blue-600/40 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-20 h-20 rounded-full glass-premium border-border/50 flex items-center justify-center relative z-10 overflow-hidden shadow-2xl">
                            <div className="w-full h-full bg-background/80 flex items-center justify-center text-3xl font-bold text-foreground">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground mt-6 mb-1">
                        Hola, {user.name}
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        {t('auth.enter_pin')}
                    </p>
                </div>

                {/* PIN Display Slots */}
                <div className={`flex justify-center gap-6 my-12 ${errorShake ? 'animate-shake text-rose-500' : ''}`}>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center justify-end h-6 w-6">
                            <div className={cn(
                                "transition-all duration-300 ease-out rounded-full",
                                i < pin.length 
                                    ? "w-4 h-4 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                                    : "w-2.5 h-2.5 bg-foreground/20"
                            )} />
                        </div>
                    ))}
                </div>

                {/* Ultra-Clean Keypad */}
                <div className="w-full max-w-[280px] mx-auto grid grid-cols-3 gap-x-6 gap-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="w-[72px] h-[72px] mx-auto rounded-full flex items-center justify-center text-4xl font-light text-foreground transition-all duration-200 active:bg-foreground/10 hover:bg-foreground/5 relative group"
                        >
                            <span className="group-active:scale-90 transition-transform duration-200">{num}</span>
                        </button>
                    ))}
                    
                    {/* Bottom Row */}
                    <div className="flex items-center justify-center">
                        <button className="w-[72px] h-[72px] mx-auto rounded-full flex items-center justify-center transition-all duration-200 active:bg-foreground/10 text-primary/80 group">
                            <Fingerprint size={32} strokeWidth={1.5} className="group-active:scale-90 transition-transform duration-200" />
                        </button>
                    </div>
                    
                    <button
                        onClick={() => handleNumberClick(0)}
                        className="w-[72px] h-[72px] mx-auto rounded-full flex items-center justify-center text-4xl font-light text-foreground transition-all duration-200 active:bg-foreground/10 hover:bg-foreground/5 relative group"
                    >
                        <span className="group-active:scale-90 transition-transform duration-200">0</span>
                    </button>
                    
                    <div className="flex items-center justify-center">
                        <button
                            onClick={handleDelete}
                            className="w-[72px] h-[72px] mx-auto rounded-full flex items-center justify-center transition-all duration-200 active:bg-foreground/10 text-foreground/50 hover:text-foreground group"
                        >
                            <Delete size={28} strokeWidth={1.5} className="group-active:-translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>
                </div>

                <div className="mt-8 mb-4">
                    <Button variant="link" size="sm" onClick={() => navigate('/setup')} className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.3em] hover:text-foreground/70 transition-colors">
                        {t('auth.forgot_pin')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
