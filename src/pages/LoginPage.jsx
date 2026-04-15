import React, { useState, useEffect } from 'react';
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
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
            {/* Ultra-Premium Background Design */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

            <div className="z-10 w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Brand & User Header */}
                <div className="text-center space-y-8">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative glass-premium p-6 rounded-[2.5rem] border-white/20 shadow-2xl transition-all duration-700 hover:scale-105 active:scale-95">
                            <img src="/logo.png" alt="VanttFlow" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tighter text-white">
                            {t('auth.welcome_user', { name: user.name })}
                        </h1>
                        <div className="flex justify-center">
                            <span className="glass-premium px-4 py-1.5 rounded-full border-white/5 text-muted-foreground/60 text-[10px] font-black tracking-[0.3em] uppercase">
                                {t('auth.enter_pin')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PIN Display */}
                <div className={`flex justify-center gap-6 py-6 ${errorShake ? 'animate-shake' : ''}`}>
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-6 h-6 rounded-full transition-all duration-500 border-2",
                                i < pin.length
                                    ? "bg-blue-500 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.8)] scale-125"
                                    : "bg-white/5 border-white/5 scale-100"
                            )}
                        />
                    ))}
                </div>

                {/* Tactile Keypad */}
                <div className="grid grid-cols-3 gap-y-8 gap-x-12 px-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="w-20 h-20 rounded-[2rem] glass-card flex items-center justify-center text-2xl font-black tracking-tighter transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-white/10 border-white/5 shadow-xl group"
                        >
                            <span className="group-hover:scale-125 transition-transform duration-300">{num}</span>
                        </button>
                    ))}
                    <div className="flex items-center justify-center">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center opacity-20">
                            <Fingerprint size={32} />
                         </div>
                    </div>
                    <button
                        onClick={() => handleNumberClick(0)}
                        className="w-20 h-20 rounded-[2rem] glass-card flex items-center justify-center text-2xl font-black tracking-tighter transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-white/10 border-white/5 shadow-xl group"
                    >
                        <span className="group-hover:scale-125 transition-transform duration-300">0</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 hover:bg-white/5 active:scale-90 text-white/30 hover:text-rose-500 group"
                    >
                        <Delete size={32} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="text-center pt-8">
                    <Button variant="link" size="sm" onClick={() => navigate('/setup')} className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white/50 transition-colors">
                        {t('auth.forgot_pin')}
                    </Button>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-12px); }
                    75% { transform: translateX(12px); }
                }
                .animate-shake {
                    animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};
