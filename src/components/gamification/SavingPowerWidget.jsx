import React, { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useGamification } from '@/context/GamificationContext';
import { useIdentity } from '@/context/IdentityContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Zap, ShieldCheck, Flame, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

export const SavingPowerWidget = () => {
    const { t } = useTranslation();
    const { budgets, transactions, summary: financeSummary } = useFinance();
    const { isEnabled } = useGamification();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';
    const navigate = useNavigate();
    
    const savingData = useMemo(() => {
        if (!budgets || budgets.length === 0) return {
            score: 0,
            label: t('dashboard.setup_budget'),
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
        let label = t('dashboard.ranks.novice');
        let color = 'from-blue-400 to-indigo-600';
        let glow = 'rgba(59, 130, 246, 0.5)';
        let icon = Zap;
        if (score >= 90) {
            label = t('dashboard.ranks.legend');
            color = 'from-amber-400 via-orange-500 to-red-600';
            glow = 'rgba(245, 158, 11, 0.6)';
            icon = Flame;
        } else if (score >= 50) {
            label = t('dashboard.ranks.guardian');
            color = 'from-emerald-400 to-teal-600';
            glow = 'rgba(16, 185, 129, 0.5)';
            icon = ShieldCheck;
        } else if (score >= 20) {
            label = t('dashboard.ranks.strategist');
            color = 'from-blue-500 to-blue-700';
            glow = 'rgba(59, 130, 246, 0.5)';
            icon = TrendingUp;
        }
        return { score, label, color, glow, icon, totalBudget, totalExpenses, savings, isEmpty: false };
    }, [budgets, transactions, financeSummary, t]);

    const { score, label, color, icon: Icon, totalBudget, savings, isEmpty } = savingData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
        >
            <div className="h-full flex flex-col relative group overflow-hidden">
                <div className={cn(
                    "absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] opacity-10 group-hover:opacity-30 transition-all duration-1000", 
                    color === 'from-muted to-muted-foreground/20' ? 'bg-muted' : 'bg-gradient-to-br ' + color
                )} />
                
                <div className="p-6 border-b border-border/30 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-lg transition-transform duration-500 group-hover:scale-110">
                            <Zap size={20} className="animate-pulse" />
                        </span>
                        <h3 className="text-xl font-black tracking-tight leading-none">{t('dashboard.saving')}</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary animate-pulse tracking-widest uppercase">
                        {t('dashboard.active_efficiency')}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex items-center justify-between mb-8 group/main">
                        <div className="space-y-2">
                            <h3 className="text-5xl font-black tracking-tighter leading-none text-foreground drop-shadow-2xl">
                                {score}<span className="text-2xl ml-1 opacity-50">%</span>
                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase ml-3 tracking-[0.3em] inline-block translate-y-[-10px]">{t('dashboard.efficiency')}</span>
                            </h3>
                            <p className={cn(
                                "text-xs font-black uppercase tracking-[0.4em] drop-shadow-sm transition-all duration-500 group-hover/main:tracking-[0.5em]",
                                isEmpty ? "text-muted-foreground/40" : "bg-clip-text text-transparent bg-gradient-to-r saturate-200",
                                color
                            )}>
                                {label}
                            </p>
                        </div>
                        <div className={cn(
                                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-3xl border border-border/50 bg-gradient-to-br transition-all duration-700 hover:scale-115 hover:rotate-10",
                                color
                            )}
                        >
                            <Icon className="text-foreground h-8 w-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                        </div>
                    </div>

                    <div className="relative mb-10 mt-2">
                        <div className="h-6 w-full rounded-2xl bg-foreground/5 border border-border/30 p-1 overflow-hidden backdrop-blur-xl">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className={cn("h-full rounded-xl relative bg-gradient-to-r shadow-2xl overflow-hidden", color)}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" />
                            </motion.div>
                        </div>
                    </div>

                    {isEmpty ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-[2rem] bg-foreground/5 border border-dashed border-border/30 mt-6 group/empty transition-all hover:bg-card/[0.08] hover:border-primary/30">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-foreground/5 border border-border/30 flex items-center justify-center mb-4 transition-all duration-500 shadow-2xl">
                                <Sparkles className="text-primary/40 group-hover:text-primary transition-colors" size={24} />
                            </div>
                            <p className="text-[13px] font-bold text-muted-foreground/80 leading-relaxed max-w-[200px] mb-4">
                                "{label}"
                            </p>
                            <Button
                                variant="link"
                                onClick={() => navigate('/budget')}
                                className="text-[10px] text-primary font-black uppercase tracking-[0.3em] h-auto p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/20 transition-all"
                            >
                                {t('dashboard.setup_now')} <ArrowRight size={14} className="ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-5 rounded-[2rem] glass-premium border border-border/30 hover:border-border/50 transition-all duration-500 shadow-2xl">
                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.3em] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-foreground/20" />
                                    {t('dashboard.theoretical')}
                                </p>
                                <p className="text-xl font-black tracking-tighter text-foreground">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalBudget)}
                                </p>
                            </div>
                            <div className="p-5 rounded-[2rem] glass-premium border border-primary/20 hover:border-primary/50 transition-all duration-500 shadow-2xl relative overflow-hidden">
                                <p className="text-[10px] font-black uppercase text-primary/80 tracking-[0.3em] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                                    {t('dashboard.real')}
                                </p>
                                <p className="text-xl font-black text-primary tracking-tighter">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(savings)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};