import React, { useState, useEffect } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
    const { login, user, isAuthenticated } = useIdentity();
    const navigate = useNavigate();
    const [pin, setPin] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const success = login(pin);
        if (!success) {
            toast.error('PIN Incorrecto');
            setPin('');
        }
    };

    if (!user) {
        // Should not be here if no user
        navigate('/setup');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050A1F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <img src="/logo.png" alt="VanttFlow" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold">Bienvenido de nuevo, {user.name}</h1>
                    <p className="text-muted-foreground">Ingresa tu PIN de acceso para continuar.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="****"
                            className="text-center text-4xl tracking-[1em] h-16 font-mono"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            autoFocus
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 text-lg">
                        Entrar <ArrowRight className="ml-2" />
                    </Button>
                </form>

                <div className="text-center">
                    <Button variant="link" size="sm" onClick={() => navigate('/setup')} className="text-muted-foreground text-xs">
                        ¿Olvidaste tu PIN? (Resetear todo)
                    </Button>
                </div>
            </div>
        </div>
    );
};
