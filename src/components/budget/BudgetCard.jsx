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
        <Card className={cn(
            "overflow-hidden transition-all duration-300 border-white/5 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:scale-[1.02] group",
            isOverBudget ? "ring-1 ring-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "hover:border-primary/20"
        )}>
            <CardContent className="p-5 space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-card border border-white/5 shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: `${category?.color}15` }}>
                            {renderIcon(category?.icon, category?.color)}
                        </div>
                        <div>
                            <h3 className="font-bold text-base tracking-tight">{category?.name || 'Desconocido'}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isOverBudget ? "bg-red-500" : "bg-emerald-500")} />
                                <span className={cn("text-[10px] uppercase font-bold tracking-widest opacity-70", isOverBudget ? "text-red-500" : "text-emerald-500")}>
                                    {isOverBudget ? 'Excedido' : 'En Control'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5" onClick={() => onEdit(budget)}>
                        <Edit2 size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Button>
                </div>
                {/* Amounts Container */}
                <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-inner">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Consumo</p>
                        <p className="text-2xl font-black tracking-tighter">${budget.spent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Límite</p>
                        <p className="text-sm font-bold opacity-80">${budget.amount.toLocaleString()}</p>
                        <p className={cn("text-[10px] font-black uppercase mt-0.5", isOverBudget ? "text-red-500" : "text-emerald-500")}>
                            {isOverBudget
                                ? `+${(budget.percentage - 100).toFixed(0)}% Sobre el límite`
                                : `$${(budget.amount - budget.spent).toLocaleString()} Disponibles`}
                        </p>
                    </div>
                </div>
                {/* Energy Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-foreground">Nivel de Consumo</span>
                        <span className={cn("text-xs font-black", isOverBudget ? "text-red-500" : "text-foreground")}>
                            {budget.percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="relative h-4 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r relative",
                                getEnergyColor(budget.percentage)
                            )}
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Animated Shine Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shine w-full h-full" />
                        </div>
                    </div>
                    {isOverBudget && (
                        <div className="flex items-center gap-1.5 px-1 py-1 text-red-500 animate-in fade-in slide-in-from-top-2">
                            <AlertTriangle size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Presupuesto en estado crítico</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};