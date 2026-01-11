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

    const percent = Math.min(budget.percentage, 100);
    const isOverBudget = budget.percentage > 100;

    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", isOverBudget ? "border-red-500/50 bg-red-500/5" : "")}>
            <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-muted/50" style={{ backgroundColor: `${category?.color}20` }}>
                            {renderIcon(category?.icon, category?.color)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">{category?.name || 'Desconocido'}</h3>
                            <p className="text-xs text-muted-foreground">
                                {isOverBudget ? <span className="text-red-500 font-medium flex items-center gap-1"><AlertTriangle size={10} /> Excedido</span> : 'En rango'}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(budget)}>
                        <Edit2 size={14} />
                    </Button>
                </div>

                {/* Amounts */}
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-2xl font-bold">${budget.spent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Gastado</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">de ${budget.amount.toLocaleString()}</p>
                        <p className={cn("text-xs font-medium", isOverBudget ? "text-red-500" : "text-emerald-500")}>
                            {isOverBudget ? `${(budget.percentage - 100).toFixed(0)}% Extra` : `${(budget.amount - budget.spent).toLocaleString()} Restante`}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <Progress value={percent} className="h-2" indicatorClassName={getProgressColor(budget.percentage)} />
                </div>
            </CardContent>
        </Card>
    );
};
