import React, { useState } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, Wallet, ArrowRight, CheckCircle2, Shield, BrainCircuit, Sword } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const OnboardingWizard = () => {
    const { t } = useTranslation();
    const { register } = useIdentity();
    const { addAccount, updateAccount } = useFinance();
    const { setSelectedPet } = useGamification();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        pin: '',
        confirmPin: '',
        initialBalance: '',
        pet: 'fox'
    });

    const PET_OPTIONS = [
        { id: 'fox', emoji: '🦊', name: t('dashboard.pets.fox.name'), desc: t('onboarding.pets.fox_desc') },
        { id: 'dog', emoji: '🐶', name: t('dashboard.pets.dog.name'), desc: t('onboarding.pets.dog_desc') },
        { id: 'shinobi', emoji: '🥷', name: t('dashboard.pets.shinobi.name'), desc: t('onboarding.pets.shinobi_desc') },
        { id: 'chief', emoji: '🛡️', name: t('dashboard.pets.chief.name'), desc: t('onboarding.pets.chief_desc') }
    ];

    const handleNext = () => {
        if (step === 1) {
            if (!formData.name) return toast.error(t('onboarding.error_name'));
            setStep(2);
        } else if (step === 2) {
            if (formData.pin.length < 4) return toast.error(t('onboarding.error_pin_length'));
            if (formData.pin !== formData.confirmPin) return toast.error(t('onboarding.error_pin_mismatch'));
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        } else if (step === 4) {
            setStep(5);
        } else if (step === 5) {
            finishSetup();
        }
    };

    const finishSetup = async () => {
        // 1. Create Identity
        await register(formData.name, formData.pin, 'MXN');

        // 2. Create Initial Account (Assuming FinanceContext is available and empty)
        // We might want to clear existing data if resetting? For now we append.
        const initialCash = Number(formData.initialBalance) || 0;
        if (initialCash >= 0) {
            // Update the default 'wallet' (Efectivo) account balance
            updateAccount('wallet', { initialBalance: initialCash });
        }

        // 3. Register Pet
        setSelectedPet(formData.pet);

        // 4. Navigate
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
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                    ))}
                </div>

                <Card className="border border-white/5 shadow-2xl bg-[#0F1631]/60 backdrop-blur-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-6 text-white">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">{t('onboarding.step1_title')}</h2>
                                    <p className="text-muted-foreground">{t('onboarding.step1_subtitle')}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('onboarding.name_label')}</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder={t('onboarding.name_placeholder')}
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
                                    <h2 className="text-2xl font-bold">{t('onboarding.step2_title')}</h2>
                                    <p className="text-muted-foreground">{t('onboarding.step2_subtitle')}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{t('onboarding.pin_label')}</Label>
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
                                        <Label>{t('onboarding.confirm_pin_label')}</Label>
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
                                    <h2 className="text-2xl font-bold">{t('onboarding.step3_title')}</h2>
                                    <p className="text-muted-foreground">{t('onboarding.step3_subtitle')}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {PET_OPTIONS.map(pet => (
                                        <div
                                            key={pet.id}
                                            onClick={() => setFormData({ ...formData, pet: pet.id })}
                                            className={cn(
                                                "cursor-pointer rounded-xl p-4 border-2 transition-all hover:scale-105",
                                                formData.pet === pet.id
                                                    ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                    : "border-white/10 bg-white/5 opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <div className="text-4xl text-center mb-2">{pet.emoji}</div>
                                            <div className="font-bold text-center">{pet.name}</div>
                                            <div className="text-xs text-center text-muted-foreground">{pet.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                    {t('onboarding.level_up_info')}
                                </p>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">{t('onboarding.step4_title')}</h2>
                                    <p className="text-muted-foreground">{t('onboarding.step4_subtitle')}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('onboarding.initial_balance_label')}</Label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-9 text-lg"
                                            placeholder={t('onboarding.initial_balance_placeholder')}
                                            value={formData.initialBalance}
                                            onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {t('onboarding.initial_balance_info')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in text-center">
                                <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                                    <BrainCircuit className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold">{t('onboarding.step5_title')}</h2>
                                <div className="space-y-4 text-left p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-sm">{t('onboarding.vanttscore_title')}</h4>
                                            <p className="text-xs text-muted-foreground">{t('onboarding.vanttscore_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <BrainCircuit className="w-5 h-5 text-purple-400 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-sm">{t('onboarding.oracle_title')}</h4>
                                            <p className="text-xs text-muted-foreground">{t('onboarding.oracle_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-yellow-500/80 font-medium">
                                    {t('onboarding.ready_to_dominate')}
                                </p>
                            </div>
                        )}

                        <Button onClick={handleNext} className="w-full h-12 text-lg rounded-xl">
                            {step === 5 ? t('onboarding.start_button') : t('onboarding.continue_button')} <ArrowRight className="ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
