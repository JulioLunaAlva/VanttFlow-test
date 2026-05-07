import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DollarSign, Edit2, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";
import * as Icons from 'lucide-react';
export const BudgetCard = ({ budget, category, onEdit }) => {
    // Calculate color based on percentage
    const getProgressColor = (percent) => {
        if (percent >= 100) return "bg-red-500";
        if (percent >= 85) return "bg-yellow-500";
        return "bg-emerald-500";
    };
    const renderIcon = (iconName, color) => {
        const Icon = Icons[iconName] || Icons.HelpCircle;
        return <Icon size={24} style={{ color }} />;
    };
    const isOverBudget = budget.percentage > 100;
    const progressPercent = Math.min(budget.percentage, 100);
    const getEnergyColor = (percent) => {
        if (percent >= 100) return "from-red-500 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]";
        if (percent >= 85) return "from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]";
        return "from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]";
    };
    return (
        <div className={cn(
            "glass-card card-glow overflow-hidden transition-all duration-500 hover:scale-[1.03] group border-border/30",
            isOverBudget ? "bg-red-500/5 ring-1 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]" : ""
        )}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl flex items-center justify-center glass-premium border-border/30 shadow-2xl group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${category?.color}20` }}>
                            {renderIcon(category?.icon, category?.color)}
                        </div>
                        <div>
                            <h3 className="font-black text-lg tracking-tighter text-foreground">{category?.name || 'Desconocido'}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isOverBudget ? "bg-red-500" : "bg-emerald-500")} />
                                <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isOverBudget ? "text-red-500" : "text-emerald-500/60")}>
                                    {isOverBudget ? 'Excedido' : 'En Control'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-foreground/5 border border-transparent hover:border-border/30" onClick={() => onEdit(budget)}>
                        <Edit2 size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </Button>
                </div>

                {/* Amounts Container */}
                <div className="glass-premium rounded-3xl p-5 flex justify-between items-center border-border/30 shadow-inner bg-foreground/5 transition-all duration-500 group-hover:bg-foreground/10">
                    <div>
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1.5">Consumo</p>
                        <p className="text-2xl font-black tracking-tighter">${budget.spent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1.5">Límite</p>
                        <p className="text-sm font-black opacity-80">${budget.amount.toLocaleString()}</p>
                        <p className={cn("text-[8px] font-black uppercase mt-1 tracking-widest", isOverBudget ? "text-red-500" : "text-emerald-500/60")}>
                            {isOverBudget
                                ? `+${(budget.percentage - 100).toFixed(0)}% Sobre el límite`
                                : `$${(budget.amount - budget.spent).toLocaleString()} Disponibles`}
                        </p>
                    </div>
                </div>

                {/* Energy Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] text-foreground">Nivel de Consumo</span>
                        <span className={cn("text-xs font-black", isOverBudget ? "text-red-500" : "text-foreground")}>
                            {budget.percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="relative h-4 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30 p-0.5 shadow-inner">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 ease-out relative",
                                getEnergyColor(budget.percentage)
                            )}
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Animated Shine Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shine w-full h-full" />
                        </div>
                    </div>
                    {isOverBudget && (
                        <div className="flex items-center gap-2 px-1 py-1 text-red-500 animate-in fade-in slide-in-from-top-2">
                            <AlertTriangle size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Presupuesto en estado crítico</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};