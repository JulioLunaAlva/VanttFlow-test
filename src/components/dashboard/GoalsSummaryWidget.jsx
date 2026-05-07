import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFinance } from "@/context/FinanceContext";
import { Target, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useIdentity } from '@/context/IdentityContext';
export const GoalsSummaryWidget = () => {
    const { t } = useTranslation();
    const { user } = useIdentity();
    const { goals } = useFinance();
    if (!goals || goals.length === 0) {
        return (
        <div className="h-full flex flex-col relative overflow-hidden group">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Target size={20} />
                    </span>
                    {t('dashboard.saving_goals')}
                </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 relative z-10">
                <div className="w-20 h-20 bg-foreground/5 rounded-[2.5rem] border border-border/30 flex items-center justify-center relative group-hover:rotate-12 transition-all duration-700">
                    <Target className="text-primary/40 group-hover:text-primary transition-colors" size={40} />
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-[20px] -z-10" />
                </div>
                <div className="space-y-2">
                    <p className="font-black text-lg tracking-tight leading-tight">{t('dashboard.no_goals_title')}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-[200px]">
                        {t('dashboard.no_goals_desc')}
                    </p>
                </div>
                <Link to="/goals" className="w-full">
                    <Button variant="secondary" className="w-full h-11 rounded-2xl bg-foreground/5 border border-border/30 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
                        {t('dashboard.create_first_goal')}
                    </Button>
                </Link>
            </div>
            
            {/* Background elements */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        </div>
        );
    }
    // Top 3 goals by progress or recently updated
    const sortedGoals = [...goals].sort((a, b) => {
        const progA = (a.currentSaved / a.targetAmount) * 100;
        const progB = (b.currentSaved / b.targetAmount) * 100;
        return progB - progA; // Show closest to completion first
    }).slice(0, 3);
    return (
        <div className="h-full flex flex-col relative group overflow-hidden">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Trophy size={20} />
                    </span>
                    {t('dashboard.goals_progress')}
                </h3>
                <Link to="/goals">
                    <Button variant="ghost" className="text-[10px] h-auto p-2 font-black uppercase text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl flex items-center gap-1">
                        {t('dashboard.view_all_goals')} <ChevronRight size={14} />
                    </Button>
                </Link>
            </div>
            <div className="p-6 flex-1 space-y-6 pt-6 relative z-10 overflow-y-auto custom-scrollbar">
                {sortedGoals.map(goal => {
                    const progress = (goal.currentSaved / goal.targetAmount) * 100;
                    const isCompleted = progress >= 100;
                    return (
                        <div key={goal.id} className="space-y-3 group/item">
                            <div className="flex justify-between items-end">
                                <span className="font-black text-sm uppercase tracking-wider truncate pr-2 opacity-80">{goal.name}</span>
                                <span className={cn(
                                    "text-xl font-black tracking-tighter",
                                    isCompleted ? "text-amber-500" : "text-primary"
                                )}>
                                    {Math.min(progress, 100).toFixed(0)}%
                                </span>
                            </div>
                            
                            <div className="relative h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30 shadow-inner">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000 relative",
                                        isCompleted ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-primary to-primary/40"
                                    )}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                >
                                    {/* Shining effect */}
                                    <div className="absolute top-0 right-0 h-full w-4 bg-foreground/20 blur-sm -skew-x-12 animate-shimmer" />
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-foreground/5 px-3 py-1.5 rounded-xl border border-border/30">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{t('dashboard.saved_amount') || 'Ahorrado'}</p>
                                    <p className="text-[10px] font-black">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: user?.currency || 'MXN', maximumFractionDigits: 0 }).format(goal.currentSaved)}</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                    <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{t('dashboard.goal_target')}</p>
                                    <p className="text-[10px] font-black opacity-60 group-hover/item:opacity-100 transition-opacity">
                                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: user?.currency || 'MXN', maximumFractionDigits: 0 }).format(goal.targetAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {goals.length > 3 && (
                    <div className="pt-2 flex justify-center">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 text-center animate-pulse">
                            + {goals.length - 3} {t('dashboard.more_goals_count') || 'objetivos adicionales'}
                        </p>
                    </div>
                )}
            </div>

            {/* Background elements */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
        </div>
    );
};