import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { LevelProgress } from './LevelProgress';
import { SpiritPet } from './SpiritPet';
import { Sword, Trophy, Star, ChevronRight, Zap, Target, PieChart, Flame, Lock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const ARCH_ICONS = {
    Zap: Zap,
    Target: Target,
    PieChart: PieChart,
    Flame: Flame
};

export const GamificationWidget = React.memo(() => {
    const { t } = useTranslation();
    const { currentLevel, nextLevel, achievements, isEnabled, xp } = useGamification();
    const [selectedArch, setSelectedArch] = React.useState(null);

    if (!isEnabled) return null;

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl group transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/50 relative">
            {/* Mesh Gradient Background - More subtle in light modes */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none opacity-30 dark:opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none opacity-20 dark:opacity-30 group-hover:opacity-60 transition-opacity duration-700" />

            <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary/80">
                        <Sword className="h-4 w-4" />
                        {t('dashboard.gamification')}
                    </CardTitle>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary animate-pulse">
                        {t('dashboard.active_system')}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                        <SpiritPet size="sm" showBubble={false} className="relative z-10 scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 max-w-full">
                            <h3 className="font-black text-2xl tracking-tight leading-tight truncate bg-gradient-to-r from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
                                {t(`dashboard.levels.l${currentLevel.level}`)}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20">
                                <Star size={12} className="fill-amber-500" />
                                <span className="text-[10px] font-black uppercase">{t('dashboard.level_label')} {currentLevel.level}</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                {t('dashboard.xp_to_next', { xp, next: nextLevel?.minXp || 'MAX' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <LevelProgress showTitle={false} />
                </div>

                <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-[11px] mb-4">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest opacity-70">{t('dashboard.ach_tracker')}</span>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="font-black text-primary hover:text-foreground transition-all flex items-center gap-1 group/btn">
                                    {unlockedCount} / {achievements.length}
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black italic tracking-tighter">{t('dashboard.trophy_room')}</DialogTitle>
                                    <DialogDescription className="text-sm font-medium text-muted-foreground">
                                        {t('dashboard.trophy_desc')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {achievements.map(ach => {
                                        const Icon = ARCH_ICONS[ach.icon] || Trophy;
                                        return (
                                            <div
                                                key={ach.id}
                                                className={cn(
                                                    "flex items-center gap-5 p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group/item",
                                                    ach.unlocked
                                                        ? "bg-primary/5 border-primary/20 hover:border-primary/40"
                                                        : "bg-muted/30 border-border opacity-50 grayscale hover:opacity-100 transition-all duration-500"
                                                )}
                                            >
                                                {ach.unlocked && (
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                                )}
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center relative",
                                                    ach.unlocked
                                                        ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                                                        : "bg-muted text-muted-foreground"
                                                )}>
                                                    {ach.unlocked ? (
                                                        <>
                                                            <Icon size={24} className="relative z-10" />
                                                            <div className="absolute inset-0 bg-white/20 rounded-xl blur-[2px] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                        </>
                                                    ) : <Lock size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-sm uppercase tracking-wide">{t(`dashboard.achievements.${ach.id}_name`)}</h4>
                                                    <p className="text-xs text-muted-foreground font-medium mt-1">{t(`dashboard.achievements.${ach.id}_desc`)}</p>
                                                </div>
                                                {ach.unlocked && (
                                                    <div className="shrink-0">
                                                        <div className="text-[9px] font-black italic text-primary uppercase bg-primary/20 px-3 py-1 rounded-full border border-primary/30 shadow-sm">
                                                            {t('dashboard.achieved')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {achievements.slice(0, 4).map(ach => {
                            const Icon = ARCH_ICONS[ach.icon] || Trophy;
                            return (
                                <div key={ach.id} className="relative h-12">
                                    <button
                                        onClick={() => setSelectedArch(selectedArch === ach.id ? null : ach.id)}
                                        className={cn(
                                            "w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 relative group/icon",
                                            ach.unlocked
                                                ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-600 dark:text-amber-500 border border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(var(--amber-500),0.2)]'
                                                : 'bg-muted/50 text-muted-foreground/30 border border-border opacity-40 grayscale',
                                            selectedArch === ach.id && "ring-2 ring-primary ring-offset-4 ring-offset-background scale-105"
                                        )}
                                    >
                                        <Icon size={20} className={cn("transition-transform duration-300 group-hover/icon:scale-110", ach.unlocked && "drop-shadow-[0_0_8px_rgba(var(--amber-500),0.5)]")} />

                                        {/* Status Dot */}
                                        <div className={cn(
                                            "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full",
                                            ach.unlocked ? "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,1)]" : "bg-muted-foreground/20"
                                        )} />
                                    </button>

                                    {/* Custom Tooltip - Adaptive background */}
                                    {selectedArch === ach.id && (
                                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-card border border-border p-3 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className={cn("p-1.5 rounded-lg", ach.unlocked ? "bg-amber-500/20 text-amber-600 dark:text-amber-500" : "bg-muted text-muted-foreground")}>
                                                    <Icon size={12} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase text-foreground tracking-widest">{t(`dashboard.achievements.${ach.id}_name`)}</p>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground font-medium leading-[1.4]">{t(`dashboard.achievements.${ach.id}_desc`)}</p>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card rotate-45 border-r border-b border-border" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
