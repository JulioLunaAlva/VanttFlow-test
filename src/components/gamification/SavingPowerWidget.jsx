import React, { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Zap, ShieldCheck, Flame, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
export const SavingPowerWidget = React.memo(() => {
    const { budgets, transactions, summary: financeSummary } = useFinance();
    const { isEnabled } = useGamification();
    const navigate = useNavigate();
    if (isEnabled) return null;
    const savingData = useMemo(() => {
        if (!budgets || budgets.length === 0) return {
            score: 0,
            label: 'Crea un presupuesto para activar',
            color: 'from-muted to-muted-foreground/20',
            glow: 'rgba(var(--muted), 0.2)',
            icon: Zap,
            totalBudget: 0,
            savings: 0,
            isEmpty: true
        };
        const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount || 0), 0);
        const summary = financeSummary || { expense: 0 };
        const totalExpenses = summary.expense;
        const savings = Math.max(0, totalBudget - totalExpenses);
        const score = Math.round((savings / totalBudget) * 100);
        let label = 'Ahorrador Novato';
        let color = 'from-blue-400 to-indigo-600';
        let glow = 'rgba(59, 130, 246, 0.5)';
        let icon = Zap;
        if (score >= 90) {
            label = 'Leyenda del Ahorro';
            color = 'from-amber-400 via-orange-500 to-red-600';
            glow = 'rgba(245, 158, 11, 0.6)';
            icon = Flame;
        } else if (score >= 50) {
            label = 'Guardián Financiero';
            color = 'from-emerald-400 to-teal-600';
            glow = 'rgba(16, 185, 129, 0.5)';
            icon = ShieldCheck;
        } else if (score >= 20) {
            label = 'Estratega';
            color = 'from-blue-500 to-blue-700';
            glow = 'rgba(59, 130, 246, 0.5)';
            icon = TrendingUp;
        }
        return { score, label, color, glow, icon, totalBudget, totalExpenses, savings, isEmpty: false };
    }, [budgets, transactions, financeSummary]);
    const { score, label, color, glow, icon: Icon, totalBudget, savings, isEmpty } = savingData;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
        >
            <Card className={cn(
                "overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group transition-all duration-500 relative flex flex-col h-full",
                "hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:border-primary/30",
                "anime:border-2 anime:shadow-[6px_6px_0px_rgba(0,0,0,0.1)]",
                "gamer:border-primary/50 gamer:shadow-[0_0_20px_rgba(var(--primary),0.2)]"
            )}>
                {/* Dynamic Background Glow */}
                <div
                    className={cn("absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none bg-gradient-to-br transition-all duration-1000", color)}
                    style={{ backgroundColor: undefined }}
                />
                <CardHeader className="pb-2 relative z-10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary/80 anime:text-foreground gamer:text-primary">
                            <Zap className="h-4 w-4 text-primary animate-pulse" />
                            Poder de Ahorro
                        </CardTitle>
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary animate-pulse">
                            EFICIENCIA ACTIVA
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col h-full relative z-10 pt-0">
                    <div className="flex items-center justify-between mb-5">
                        <div className="space-y-1">
                            <motion.h3
                                key={score}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-black tracking-tighter italic leading-none text-foreground"
                            >
                                {score}% <span className="text-[10px] not-italic font-black text-foreground/60 uppercase ml-1 tracking-widest anime:text-foreground/80 gamer:text-primary/60">Eficiencia</span>
                            </motion.h3>
                            <p className={cn(
                                "text-[11px] font-black uppercase tracking-[0.2em] drop-shadow-sm",
                                isEmpty ? "text-muted-foreground" : "bg-clip-text text-transparent bg-gradient-to-r brightness-110 saturate-150",
                                color
                            )}>
                                {label}
                            </p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 bg-gradient-to-br transition-transform duration-500",
                                color
                            )}
                        >
                            <Icon className="text-white h-7 w-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                        </motion.div>
                    </div>
                    {/* Enhanced Progress Bar */}
                    <div className="relative mb-6">
                        <div className="h-4 w-full rounded-full bg-muted/30 border border-border/20 p-[3px] overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={cn("h-full rounded-full relative bg-gradient-to-r shadow-[0_0_15px_rgba(0,0,0,0.2)]", color)}
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
                                {/* Segmented Look Overlay */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '8px 100%' }}
                                />
                            </motion.div>
                        </div>
                        {/* Milestone markers */}
                        <div className="absolute top-full left-0 w-full flex justify-between px-1 mt-1">
                            {[0, 25, 50, 75, 100].map(m => (
                                <div key={m} className="flex flex-col items-center">
                                    <div className={cn("h-1 w-[1px] bg-border/60", score >= m && "bg-primary")} />
                                    <span className="text-[9px] font-black text-foreground/70 mt-0.5 anime:text-foreground gamer:text-primary/80">{m}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {isEmpty ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 rounded-3xl bg-muted/20 border-2 border-dashed border-border/40 mt-2 group/empty transition-all hover:bg-muted/30">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover/empty:scale-110 transition-transform">
                                <Sparkles className="text-muted-foreground/60" size={20} />
                            </div>
                            <p className="text-xs font-black text-foreground/80 leading-tight max-w-[150px] anime:text-foreground gamer:text-primary-foreground">
                                {label}
                            </p>
                            <Button
                                variant="link"
                                onClick={() => navigate('/budget')}
                                className="text-[10px] text-primary font-black uppercase tracking-widest mt-2 h-auto p-0 hover:underline"
                            >
                                Configurar ahora <ArrowRight size={10} className="ml-1" />
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 backdrop-blur-sm hover:bg-muted/60 transition-colors group/stat">
                                <p className="text-[9px] font-black uppercase text-foreground/60 tracking-widest mb-1.5 flex items-center gap-1.5 anime:text-foreground/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 anime:bg-foreground/40" />
                                    Teórico
                                </p>
                                <p className="text-lg font-black tracking-tight text-foreground">${totalBudget.toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-sm hover:bg-primary/10 transition-colors group/stat relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12">
                                    <TrendingUp size={24} />
                                </div>
                                <p className="text-[9px] font-black uppercase text-primary/80 tracking-widest mb-1.5 flex items-center gap-1.5 gamer:text-primary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                                    Real
                                </p>
                                <p className="text-lg font-black text-primary tracking-tight">${savings.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                    {isEmpty && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-card flex items-center justify-center overflow-hidden shadow-sm">
                                            <div className={cn("w-full h-full opacity-40 bg-gradient-to-br", color)} />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground/70 italic tracking-tight">
                                    {score > 80 ? '¡Disciplina legendaria!' : '¡Sigue así, vas ganando!'}
                                </p>
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-primary/60 animate-pulse text-foreground/40">
                                v1.2 Beta
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
});
const Button = ({ children, variant, className, ...props }) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variant === "link" && "text-primary underline-offset-4 hover:underline",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};