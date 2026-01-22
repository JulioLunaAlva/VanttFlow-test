import React, { useState, useEffect } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LockKeyhole, Delete, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
    const { login, user, isAuthenticated } = useIdentity();
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

    const handleLogin = (code) => {
        const success = login(code);
        if (!success) {
            setErrorShake(true);
            setTimeout(() => {
                setErrorShake(false);
                setPin('');
            }, 500);
            toast.error("PIN Incorrecto");
        } else {
            // Success sound or haptic could go here
        }
    };

    if (!user) {
        navigate('/setup');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050A1F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
            {/* Immersive Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[5000ms]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[7000ms]" />

            <div className="z-10 w-full max-w-xs space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl">
                        <img src="/logo.png" alt="VanttFlow" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Hola, {user.name}</h1>
                        <p className="text-blue-200/60 text-sm">Ingresa tu código de acceso</p>
                    </div>
                </div>

                {/* PIN Dots */}
                <div className={`flex justify-center gap-4 py-4 ${errorShake ? 'animate-shake' : ''}`}>
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length
                                    ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] scale-110'
                                    : 'bg-white/10 scale-100'
                                }`}
                        />
                    ))}
                </div>

                {/* Custom Keypad */}
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all text-2xl font-light backdrop-blur-sm border border-white/5 flex items-center justify-center mx-auto"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="flex items-center justify-center">
                        <Fingerprint className="text-white/20" size={32} />
                    </div>
                    <button
                        onClick={() => handleNumberClick(0)}
                        className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all text-2xl font-light backdrop-blur-sm border border-white/5 flex items-center justify-center mx-auto"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-20 h-20 rounded-full hover:bg-white/5 active:bg-white/10 active:scale-95 transition-all flex items-center justify-center mx-auto text-white/50 hover:text-white"
                    >
                        <Delete size={28} />
                    </button>
                </div>

                <div className="text-center pt-8">
                    <Button variant="link" size="sm" onClick={() => navigate('/setup')} className="text-white/30 text-xs hover:text-white/50">
                        ¿Olvidaste tu PIN?
                    </Button>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .animate-shake {
                    animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};
