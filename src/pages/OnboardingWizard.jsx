import React, { useState } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { toast } from 'sonner';

export const OnboardingWizard = () => {
    const { register } = useIdentity();
    const { addAccount, updateAccount } = useFinance(); // We'll add the initial cash account
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        pin: '',
        confirmPin: '',
        initialBalance: ''
    });

    const handleNext = () => {
        if (step === 1) {
            if (!formData.name) return toast.error('El nombre es requerido');
            setStep(2);
        } else if (step === 2) {
            if (formData.pin.length < 4) return toast.error('El PIN debe tener 4 dígitos');
            if (formData.pin !== formData.confirmPin) return toast.error('Los PINs no coinciden');
            setStep(3);
        } else if (step === 3) {
            finishSetup();
        }
    };

    const finishSetup = () => {
        // 1. Create Identity
        register(formData.name, formData.pin, 'MXN');

        // 2. Create Initial Account (Assuming FinanceContext is available and empty)
        // We might want to clear existing data if resetting? For now we append.
        const initialCash = Number(formData.initialBalance) || 0;
        if (initialCash >= 0) {
            // Update the default 'wallet' (Efectivo) account balance
            updateAccount('wallet', { initialBalance: initialCash });
        }

        // 3. Navigate
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#050A1F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 w-full max-w-md">
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                    ))}
                </div>

                <Card className="border border-white/5 shadow-2xl bg-[#0F1631]/60 backdrop-blur-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-6 text-white">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">Vamos a conocerte</h2>
                                    <p className="text-muted-foreground">¿Cómo te gustaría que te llamemos?</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tu Nombre</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="Ej. Alex"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">Protege tu espacio</h2>
                                    <p className="text-muted-foreground">Crea un PIN de 4 dígitos para acceder.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>PIN de Acceso</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="pl-9 font-mono tracking-widest"
                                                placeholder="****"
                                                maxLength={4}
                                                value={formData.pin}
                                                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirmar PIN</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="pl-9 font-mono tracking-widest"
                                                placeholder="****"
                                                maxLength={4}
                                                value={formData.confirmPin}
                                                onChange={e => setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">Punto de Partida</h2>
                                    <p className="text-muted-foreground">¿Con cuánto dinero efectivo cuentas hoy?</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Efectivo Actual (Opcional)</Label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-9 text-lg"
                                            placeholder="0.00"
                                            value={formData.initialBalance}
                                            onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        No te preocupes, puedes agregar tus cuentas bancarias y tarjetas más tarde en el Dashboard.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button onClick={handleNext} className="w-full h-12 text-lg rounded-xl">
                            {step === 3 ? 'Comenzar VanttFlow' : 'Continuar'} <ArrowRight className="ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
