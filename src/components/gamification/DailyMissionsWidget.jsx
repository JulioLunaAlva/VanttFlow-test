import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Sparkles, Trophy, Target, Receipt, PieChart, CalendarClock, BarChart3 } from 'lucide-react';
const ICON_MAP = {
    Receipt,
    Target,
    PieChart,
    CalendarClock,
    BarChart3,
};
import { useTranslation } from 'react-i18next';

export const DailyMissionsWidget = () => {
    const { t } = useTranslation();
    const { dailyMissions, isEnabled } = useGamification();
    if (!dailyMissions || dailyMissions.length === 0) return null;
    const completedCount = dailyMissions.filter(m => m.completed).length;
    const progress = (completedCount / dailyMissions.length) * 100;
    return (
        <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] transition-all duration-500 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy size={80} className="text-primary rotate-12" />
            </div>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                        <Target className="h-3 w-3 text-primary" />
                        {t('dashboard.missions_title')}
                    </CardTitle>
                    <span className="text-[10px] font-black text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full">
                        {completedCount}/{dailyMissions.length}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {dailyMissions.map((mission) => {
                        const Icon = ICON_MAP[mission.icon] || Sparkles;
                        return (
                            <div
                                key={mission.id}
                                className={cn(
                                    "group/item flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 border",
                                    mission.completed
                                        ? "bg-primary/5 border-primary/20 opacity-70"
                                        : "bg-muted/30 border-border/40 hover:border-primary/30 hover:bg-muted/50"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                    mission.completed ? "bg-primary/20 text-primary" : "bg-card text-muted-foreground group-hover/item:text-primary group-hover/item:bg-primary/10"
                                )}>
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-bold leading-tight truncate",
                                        mission.completed ? "text-primary/70 line-through decoration-2" : "text-foreground"
                                    )}>
                                        {t(`dashboard.missions.${mission.id}`)}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                                        <p className="text-[10px] font-black text-primary uppercase tracking-tighter">+{mission.xp} XP</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {mission.completed ? (
                                        <CheckCircle2 className="text-primary h-5 w-5 animate-in zoom-in duration-300" />
                                    ) : (
                                        <Circle className="text-muted-foreground/30 h-5 w-5 group-hover/item:text-primary/40 transition-colors" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('dashboard.daily_progress')}</span>
                        <span className="text-[9px] font-black text-primary uppercase">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden p-[1px] border border-border/20">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};