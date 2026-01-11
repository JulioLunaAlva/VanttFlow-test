import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '@/context/IdentityContext';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useIdentity();

    const handleAction = () => {
        if (user) {
            navigate('/login');
        } else {
            navigate('/setup');
        }
    };

    return (
        <div className="min-h-screen bg-[#050A1F] text-white flex flex-col items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">

                {/* Brand Section */}
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    {/* Logo Icon - Preserved as requested */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img src="/logo.png" alt="VanttFlow Logo" className="relative w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-7xl md:text-[7.5rem] leading-[0.9] md:leading-[0.85] font-black tracking-[-0.07em] mb-4 select-none drop-shadow-2xl">
                            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Vantt</span>
                            <span className="bg-gradient-to-b from-blue-500 to-blue-600 bg-clip-text text-transparent italic px-1">Flow</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">
                            Reimagina tu libertad financiera con <span className="text-white font-bold">inteligencia</span> y <span className="text-white font-bold">estilo</span>.
                        </p>

                        <div className="pt-6 flex justify-center">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1e293b]/50 border border-blue-500/20 text-blue-500 text-[11px] font-black tracking-[0.25em] uppercase shadow-lg shadow-blue-500/5 backdrop-blur-md">
                                <Zap className="w-4 h-4 fill-current" />
                                VENTAJA + FLUJO
                            </span>
                        </div>
                    </div>
                </div>

                {/* Features Cards */}
                <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto pt-8">
                    <div className="p-6 bg-[#0B1026] border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors group shadow-lg">
                        <Shield className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        <h3 className="font-bold text-lg mb-1 text-white">Privado</h3>
                        <p className="text-sm text-slate-500">Tus datos son solo tuyos.</p>
                    </div>
                    <div className="p-6 bg-[#0B1026] border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors group shadow-lg">
                        <TrendingUp className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        <h3 className="font-bold text-lg mb-1 text-white">Inteligente</h3>
                        <p className="text-sm text-slate-500">Analiza cada movimiento.</p>
                    </div>
                    <div className="p-6 bg-[#0B1026] border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors group shadow-lg">
                        <Star className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        <h3 className="font-bold text-lg mb-1 text-white">Premium</h3>
                        <p className="text-sm text-slate-500">Interfaz de alto nivel.</p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8">
                    <Button
                        size="lg"
                        onClick={handleAction}
                        className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl shadow-2xl shadow-blue-900/40 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-300"
                    >
                        {user ? 'Continuar mi Viaje' : 'Empezar mi Viaje'}
                        <ArrowRight className="ml-2 w-6 h-6 border-l pl-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
