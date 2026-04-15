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
        <div className="h-full flex flex-col relative group overflow-hidden">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] group-hover:bg-emerald-500/10 transition-all duration-1000" />

            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-lg transition-transform duration-500 group-hover:scale-110">
                        <Target size={20} />
                    </span>
                    <h3 className="text-xl font-black tracking-tight leading-none">{t('dashboard.missions_title')}</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                    <span className="text-[11px] font-black text-primary leading-none">
                        {completedCount}
                    </span>
                    <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest">
                        / {dailyMissions.length}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="space-y-4">
                    {dailyMissions.map((mission) => {
                        const Icon = ICON_MAP[mission.icon] || Sparkles;
                        return (
                            <div
                                key={mission.id}
                                className={cn(
                                    "group/item flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-500 border relative overflow-hidden",
                                    mission.completed
                                        ? "bg-primary/5 border-primary/20 opacity-60 backdrop-blur-sm"
                                        : "glass-premium border-white/5 hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10",
                                    mission.completed 
                                        ? "bg-primary/10 text-primary/60" 
                                        : "bg-white/5 text-muted-foreground group-hover/item:text-primary group-hover/item:bg-primary/10 group-hover/item:rotate-6"
                                )}>
                                    <Icon size={22} className="drop-shadow-sm" />
                                </div>
                                <div className="flex-1 min-w-0 relative z-10">
                                    <p className={cn(
                                        "text-[13px] font-black tracking-tight leading-tight truncate transition-all",
                                        mission.completed ? "text-primary/40 line-through decoration-1" : "text-foreground group-hover/item:translate-x-1"
                                    )}>
                                        {t(`dashboard.missions.${mission.id}`)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            mission.completed ? "bg-primary/20" : "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] animate-pulse"
                                        )} />
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.2em]",
                                            mission.completed ? "text-primary/30" : "text-primary/80"
                                        )}>+{mission.xp} XP</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 relative z-10">
                                    {mission.completed ? (
                                        <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                                            <CheckCircle2 className="text-primary h-5 w-5 animate-in zoom-in duration-500" />
                                        </div>
                                    ) : (
                                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover/item:border-primary/30 transition-colors">
                                            <Circle className="text-muted-foreground/20 h-5 w-5 group-hover/item:text-primary/40 transition-colors" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-auto pt-8">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">{t('dashboard.daily_progress')}</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-4 w-full glass-premium border border-white/5 rounded-2xl p-1 overflow-hidden relative shadow-2xl">
                        <div
                            className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-600 rounded-xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_3s_infinite]" />
                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', backgroundSize: '8px 4px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};