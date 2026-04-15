import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '@/context/IdentityContext';
import { useTranslation } from 'react-i18next';

export const LandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useIdentity();

    const [, setActiveFeature] = React.useState(0);
    const features = [
        {
            icon: Shield,
            title: t('landing.features.privacy.title', 'Privado'),
            description: t('landing.features.privacy.desc', 'Tus datos son solo tuyos.'),
            color: "text-emerald-400"
        },
        {
            icon: TrendingUp,
            title: t('landing.features.smart.title', 'Inteligente'),
            description: t('landing.features.smart.desc', 'Analiza cada movimiento.'),
            color: "text-blue-400"
        },
        {
            icon: Star,
            title: t('landing.features.premium.title', 'Premium'),
            description: t('landing.features.premium.desc', 'Interfaz de alto nivel.'),
            color: "text-yellow-400"
        }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleAction = () => {
        if (user) {
            navigate('/login');
        } else {
            navigate('/setup');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden font-sans">
            {/* Ultra-Premium Background Design */}
            <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
            <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="z-10 max-w-5xl w-full text-center space-y-12 md:space-y-20 animate-in fade-in zoom-in duration-1000 py-12">

                {/* Brand Section */}
                <div className="flex flex-col items-center gap-6 md:gap-10">
                    {/* Premium Logo Container */}
                    <div className="relative group perspective-1000 cursor-default">
                        <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                        <div className="relative glass-premium p-6 rounded-[3rem] border-white/20 shadow-2xl transition-all duration-700 group-hover:rotate-6 group-hover:scale-110">
                            <img src="/logo.png" alt="VanttFlow Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative inline-block">
                             <h1 className="text-6xl sm:text-8xl md:text-[9rem] leading-[0.85] font-black tracking-[-0.08em] select-none">
                                <span className="bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">Vantt</span>
                                <span className="bg-gradient-to-tr from-blue-400 to-blue-600 bg-clip-text text-transparent italic px-2 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">Flow</span>
                            </h1>
                            <div className="absolute -top-12 -right-12 md:-top-16 md:-right-16 glass-premium px-4 py-2 rounded-2xl border-white/10 shadow-xl rotate-12 animate-bounce-slow">
                                <span className="text-primary font-black text-xs tracking-widest">v2.5 PREMIUM</span>
                            </div>
                        </div>

                        <p className="text-xl md:text-3xl text-slate-400 max-w-3xl mx-auto font-black tracking-tight leading-[1.2] px-4">
                            {t('landing.subtitle_hero', 'Reimagina tu libertad financiera con inteligencia y estilo.')}
                        </p>

                        <div className="pt-4 flex justify-center gap-4">
                            <span className="glass-premium px-8 py-3 rounded-full border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.4em] uppercase shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-4">
                                <Zap className="w-4 h-4 fill-current inline-block mr-2 mb-1" />
                                {t('landing.hero_tag', 'VENTAJA + FLUJO')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="flex flex-col items-center gap-12">
                     <Button
                        size="lg"
                        onClick={handleAction}
                        className="h-20 px-16 rounded-[2rem] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-2xl shadow-[0_20px_50px_rgba(59,130,246,0.4)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.6)] group transition-all duration-500 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-4">
                            {user ? t('common.continue', 'Continuar') : t('common.start', 'Empezar')}
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </span>
                    </Button>

                    {/* Features Showcase */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
                        {features.map((feature, i) => (
                            <div key={i} className="glass-card card-glow p-8 text-left group transition-all duration-700 hover:-translate-y-4 border-white/5 active:scale-95 cursor-default">
                                <div className="mb-8 relative">
                                    <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${feature.color.replace('text-', 'bg-')}`} />
                                    <div className="relative w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700">
                                        <feature.icon className={`w-8 h-8 ${feature.color}`} strokeWidth={2} />
                                    </div>
                                </div>
                                <h3 className="font-black text-2xl mb-3 text-white tracking-tighter group-hover:translate-x-2 transition-transform duration-700">{feature.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed group-hover:translate-x-2 transition-transform duration-700 delay-75">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Section */}
                <div className="py-10 opacity-40 hover:opacity-100 transition-opacity duration-1000">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">MÁXIMA PRIVACIDAD LOCAL</p>
                    <div className="flex justify-center gap-8 text-slate-500">
                        <Shield className="w-6 h-6" />
                        <Zap className="w-6 h-6" />
                        <Star className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};
