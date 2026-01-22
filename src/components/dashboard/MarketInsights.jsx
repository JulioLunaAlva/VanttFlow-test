<<<<<<< HEAD
import React from 'react';
import { Brain, TrendingUp, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const MarketInsights = ({ data }) => {
    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Brain size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-primary">VanttFlow AI Engine v1.2</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Análisis predictivo basado en tus gastos</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-border/40 bg-card/50 space-y-3 relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <Sparkles size={100} />
                    </div>

                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                            <TrendingUp size={14} />
                            Oportunidad de Ahorro
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">ALTA</span>
                    </div>

                    <h3 className="text-lg font-black tracking-tight leading-tight">Adquisición Anticipada de Divisas</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Detectamos suscripciones mensuales por **$45.00 USD**. El peso está en un máximo semanal frente al dólar. Comprar $100 USD hoy podría ahorrarte un **4.2%** en cargos transaccionales el resto del mes.
                    </p>
                </div>

                <div className="p-5 rounded-2xl border border-border/40 bg-card/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-primary/60">Confianza de la Predicción</span>
                        <span className="text-xs font-black">92%</span>
                    </div>
                    <Progress value={92} className="h-1.5" />
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ahorro Estimado</p>
                            <p className="text-lg font-black text-emerald-500">+$12.50 USD</p>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ventana de Acción</p>
                            <p className="text-lg font-black">48 Horas</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-600/10 flex items-start gap-3">
                    <ShieldCheck size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-500/80 font-medium leading-relaxed italic">
                        "Basado en tus patrones de gasto en 'Tecnología' y 'Viajes', esta predicción tiene un factor de riesgo bajo."
                    </p>
                </div>
            </div>

            <Button className="w-full h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform font-black uppercase tracking-widest text-xs">
                Ejecutar Plan de Ahorro
                <ArrowRight size={16} className="ml-2" />
            </Button>
        </div>
    );
};
=======
import React from 'react';
import { Brain, TrendingUp, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const MarketInsights = ({ data }) => {
    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Brain size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-primary">VanttFlow AI Engine v1.2</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Análisis predictivo basado en tus gastos</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-border/40 bg-card/50 space-y-3 relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <Sparkles size={100} />
                    </div>

                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                            <TrendingUp size={14} />
                            Oportunidad de Ahorro
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">ALTA</span>
                    </div>

                    <h3 className="text-lg font-black tracking-tight leading-tight">Adquisición Anticipada de Divisas</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Detectamos suscripciones mensuales por **$45.00 USD**. El peso está en un máximo semanal frente al dólar. Comprar $100 USD hoy podría ahorrarte un **4.2%** en cargos transaccionales el resto del mes.
                    </p>
                </div>

                <div className="p-5 rounded-2xl border border-border/40 bg-card/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-primary/60">Confianza de la Predicción</span>
                        <span className="text-xs font-black">92%</span>
                    </div>
                    <Progress value={92} className="h-1.5" />
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ahorro Estimado</p>
                            <p className="text-lg font-black text-emerald-500">+$12.50 USD</p>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ventana de Acción</p>
                            <p className="text-lg font-black">48 Horas</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-600/10 flex items-start gap-3">
                    <ShieldCheck size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-500/80 font-medium leading-relaxed italic">
                        "Basado en tus patrones de gasto en 'Tecnología' y 'Viajes', esta predicción tiene un factor de riesgo bajo."
                    </p>
                </div>
            </div>

            <Button className="w-full h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform font-black uppercase tracking-widest text-xs">
                Ejecutar Plan de Ahorro
                <ArrowRight size={16} className="ml-2" />
            </Button>
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
