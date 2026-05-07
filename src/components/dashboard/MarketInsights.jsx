import React from 'react';
import { Brain, TrendingUp, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
export const MarketInsights = ({ data }) => {
    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 p-5 rounded-2xl glass-premium border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center animate-pulse-slow">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h4 className="text-base font-black tracking-tighter text-foreground">Market Intelligence v2.5</h4>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Análisis Proyectado & Oportunidades</p>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="p-6 rounded-2xl glass-card card-glow border-border/50 space-y-4 relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                        <TrendingUp size={120} />
                    </div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2">
                            <Zap size={14} className="fill-current" />
                            Oportunidad Detectada
                        </span>
                        <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 tracking-widest">CRÍTICA</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tighter leading-tight text-foreground group-hover:translate-x-1 transition-transform duration-500">Adquisición Anticipada de Divisas</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Detectamos suscripciones mensuales por **$45.00 USD**. El peso está en un máximo semanal frente al dólar. Comprar hoy podría asegurarte un ahorro del **4.2%** proyectado.
                    </p>
                </div>

                <div className="p-6 rounded-2xl glass-card border-border/30 space-y-5">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Precisión del Modelo</span>
                        <span className="text-xs font-black text-primary">94.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                         <div className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: '94.8%' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Impacto Estimado</p>
                            <p className="text-xl font-black text-emerald-400">+$12.50 USD</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Ventana Crítica</p>
                            <p className="text-xl font-black text-foreground">48 Horas</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                    <ShieldCheck size={18} className="text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-blue-400/80 font-black tracking-tight leading-relaxed italic">
                        "Análisis ejecutado localmente basado en tus patrones de gasto histórico en tecnología y servicios digitales."
                    </p>
                </div>
            </div>

            <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest text-[10px]">
                Ejecutar Plan de Ahorro
                <ArrowRight size={18} className="ml-2" />
            </Button>
        </div>
    );
};
