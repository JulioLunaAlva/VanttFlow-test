import React, { useState } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { useSync } from '@/context/SyncContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, Wallet, ArrowRight, CheckCircle2, Shield, BrainCircuit, Sword, Cloud } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const OnboardingWizard = () => {
    const { t } = useTranslation();
    const { register } = useIdentity();
    const { updateAccount } = useFinance();
    const { setSelectedPet } = useGamification();
    const { loginWithGoogle, firebaseUser, backupToCloud, isSyncing } = useSync();
    const navigate = useNavigate();

    const [step, setStep] = useState(0); // 0 is the new Welcome Screen
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

    const handleGoogleAuth = async () => {
        const result = await loginWithGoogle();
        if (result?.status === 'RESTORED') {
            // Already handled by SyncContext (reloads the page to dashboard)
            return;
        } else if (result?.status === 'NEW_USER') {
            // Pre-fill name and skip step 1
            setFormData(prev => ({ ...prev, name: result.user.displayName || 'Usuario' }));
            setStep(2);
        }
    };

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

        // 2. Create Initial Account
        const initialCash = Number(formData.initialBalance) || 0;
        if (initialCash >= 0) {
            updateAccount('wallet', { initialBalance: initialCash });
        }

        // 3. Register Pet
        setSelectedPet(formData.pet);

        // 4. Cloud Backup (If connected to Google as a New User)
        if (firebaseUser) {
            await backupToCloud(firebaseUser.uid);
        }

        // 5. Navigate
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#050A1F] text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

            {step === 0 ? (
                // --- STEP 0: NEW WELCOME SCREEN ---
                <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative group mb-10">
                        <div className="absolute -inset-4 bg-gradient-to-br from-primary/40 to-blue-600/40 rounded-full blur-2xl opacity-50 animate-pulse" />
                        <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center relative z-10 shadow-2xl rotate-3">
                            <Wallet className="w-16 h-16 text-white -rotate-3" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black tracking-tighter text-foreground mb-3">
                        VanttFlow
                    </h1>
                    <p className="text-center text-muted-foreground/80 mb-12 px-4 leading-relaxed">
                        Domina tus finanzas personales con inteligencia y privacidad.
                    </p>

                    <div className="w-full space-y-4">
                        <Button 
                            onClick={handleGoogleAuth}
                            disabled={isSyncing}
                            className="w-full h-14 bg-white hover:bg-gray-100 text-black rounded-2xl font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {isSyncing ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-3" />
                            ) : (
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            )}
                            Continuar con Google
                        </Button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-border/50"></div>
                            <span className="flex-shrink-0 mx-4 text-muted-foreground/50 text-xs font-semibold uppercase tracking-widest">O</span>
                            <div className="flex-grow border-t border-border/50"></div>
                        </div>

                        <Button 
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="w-full h-14 bg-background/50 backdrop-blur-md border-border/40 hover:bg-foreground/5 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Empezar Modo Offline
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="z-10 w-full max-w-md">
                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                        ))}
                    </div>

                    <Card className="border border-border/30 shadow-2xl bg-[#0F1631]/60 backdrop-blur-2xl rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-6 text-foreground">
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
                                                className="pl-9 h-12 bg-background/50 border-border/50"
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
                                                    className="pl-9 font-mono tracking-widest h-12 bg-background/50 border-border/50"
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
                                                    className="pl-9 font-mono tracking-widest h-12 bg-background/50 border-border/50"
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
                                                    "cursor-pointer rounded-2xl p-4 border-2 transition-all hover:scale-105",
                                                    formData.pet === pet.id
                                                        ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                        : "border-border/30 bg-background/50 opacity-60 hover:opacity-100"
                                                )}
                                            >
                                                <div className="text-4xl text-center mb-2">{pet.emoji}</div>
                                                <div className="font-bold text-center">{pet.name}</div>
                                                <div className="text-[10px] text-center text-muted-foreground mt-1 leading-tight">{pet.desc}</div>
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
                                                className="pl-9 text-lg h-12 bg-background/50 border-border/50"
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
                                    
                                    {firebaseUser && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
                                            <Cloud className="w-3 h-3" />
                                            Respaldo Automático Activado
                                        </div>
                                    )}

                                    <div className="space-y-4 text-left p-4 bg-background/50 rounded-2xl border border-border/30">
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

                            <Button 
                                onClick={handleNext} 
                                disabled={isSyncing}
                                className="w-full h-12 text-lg rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {isSyncing ? (
                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {step === 5 ? t('onboarding.start_button') : t('onboarding.continue_button')} 
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
