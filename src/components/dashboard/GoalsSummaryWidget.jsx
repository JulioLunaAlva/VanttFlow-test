import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFinance } from "@/context/FinanceContext";
import { Target, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useIdentity } from '@/context/IdentityContext';
export const GoalsSummaryWidget = () => {
    const { t } = useTranslation();
    const { user } = useIdentity();
    const { goals } = useFinance();
    if (!goals || goals.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target size={16} className="text-primary" />
                        {t('dashboard.saving_goals')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[280px] text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Target className="text-primary" size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">{t('dashboard.no_goals_title')}</p>
                        <p className="text-xs text-muted-foreground px-6">
                            {t('dashboard.no_goals_desc')}
                        </p>
                    </div>
                    <Link to="/goals">
                        <span className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full transition-colors">{t('dashboard.create_first_goal')}</span>
                    </Link>
                </CardContent>
            </Card>
        );
    }
    // Top 3 goals by progress or recently updated
    const sortedGoals = [...goals].sort((a, b) => {
        const progA = (a.currentSaved / a.targetAmount) * 100;
        const progB = (b.currentSaved / b.targetAmount) * 100;
        return progB - progA; // Show closest to completion first
    }).slice(0, 3);
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" />
                    {t('dashboard.goals_progress')}
                </CardTitle>
                <Link to="/goals" className="text-xs text-muted-foreground hover:text-primary flex items-center">
                    {t('dashboard.view_all_goals')} <ChevronRight size={12} />
                </Link>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-4">
                {sortedGoals.map(goal => {
                    const progress = (goal.currentSaved / goal.targetAmount) * 100;
                    const isCompleted = progress >= 100;
                    return (
                        <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium truncate pr-2">{goal.name}</span>
                                <span className={cn("font-bold", isCompleted ? "text-yellow-600" : "text-primary")}>
                                    {progress.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000",
                                        isCompleted ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-primary"
                                    )}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground flex justify-between">
                                <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: user?.currency || 'MXN', maximumFractionDigits: 0 }).format(goal.currentSaved)}</span>
                                <span>{t('dashboard.goal_target')}: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: user?.currency || 'MXN', maximumFractionDigits: 0 }).format(goal.targetAmount)}</span>
                            </p>
                        </div>
                    );
                })}
                {goals.length > 3 && (
                    <p className="text-center text-[10px] text-muted-foreground pt-2">
                        {t('dashboard.more_goals', { count: goals.length - 3 })}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};