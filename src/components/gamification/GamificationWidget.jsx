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
        <div className="h-full flex flex-col relative group overflow-hidden">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-700" />

            <div className="p-6 border-b border-border/30 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                        <Sword size={20} />
                    </span>
                    <h3 className="text-xl font-black tracking-tight leading-none">{t('dashboard.gamification')}</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 animate-pulse uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    {t('dashboard.active_system')}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex items-center gap-6 mb-8 group/pet">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl opacity-0 group-hover/pet:opacity-100 transition-opacity duration-700" />
                        <div className="relative transform transition-transform duration-500 group-hover/pet:scale-110">
                            <SpiritPet size="sm" showBubble={false} className="relative z-10" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-3xl tracking-tighter leading-tight truncate bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                            {t(`dashboard.levels.l${currentLevel.level}`)}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5 transition-transform duration-500 hover:scale-105">
                                <Star size={14} className="fill-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-wider">{t('dashboard.level_label')} {currentLevel.level}</span>
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">
                                {t('dashboard.xp_to_next', { xp, next: nextLevel?.minXp || 'MAX' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <LevelProgress showTitle={false} />
                </div>

                <div className="mt-auto pt-8 border-t border-border/30">
                    <div className="flex items-center justify-between text-[11px] mb-6">
                        <span className="text-muted-foreground/40 font-black uppercase tracking-[0.3em]">{t('dashboard.ach_tracker')}</span>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="font-black text-primary hover:text-foreground transition-all flex items-center gap-2 group/btn px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/20 active:scale-95 shadow-lg">
                                    <span className="text-lg leading-none">{unlockedCount}</span>
                                    <span className="opacity-30 text-[10px] tracking-widest">/ {achievements.length}</span>
                                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md glass-premium border-border/30 shadow-[0_0_80px_rgba(var(--primary),0.1)]">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black tracking-tighter text-foreground mb-2">{t('dashboard.trophy_room')}</DialogTitle>
                                    <DialogDescription className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">
                                        {t('dashboard.trophy_desc')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {achievements.map(ach => {
                                        const Icon = ARCH_ICONS[ach.icon] || Trophy;
                                        return (
                                            <div
                                                key={ach.id}
                                                className={cn(
                                                    "flex items-center gap-6 p-5 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group/item",
                                                    ach.unlocked
                                                        ? "bg-foreground/5 border-primary/20 hover:bg-foreground/10 active:scale-[0.98]"
                                                        : "bg-foreground/5 border-border/30 opacity-30 grayscale blur-[1px]"
                                                )}
                                            >
                                                {ach.unlocked && (
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover/item:bg-primary/20 transition-all duration-700" />
                                                )}
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center relative transition-transform duration-500 group-hover/item:scale-110 shadow-2xl",
                                                    ach.unlocked
                                                        ? "bg-gradient-to-br from-primary to-indigo-600 text-foreground border border-border/30"
                                                        : "bg-foreground/5 text-muted-foreground"
                                                )}>
                                                    {ach.unlocked ? (
                                                        <>
                                                            <Icon size={26} className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                                                        </>
                                                    ) : <Lock size={22} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-base tracking-tighter uppercase">{t(`dashboard.achievements.${ach.id}_name`)}</h4>
                                                    <p className="text-[11px] text-muted-foreground/60 font-bold leading-relaxed mt-1 italic">"{t(`dashboard.achievements.${ach.id}_desc`)}"</p>
                                                </div>
                                                {ach.unlocked && (
                                                    <div className="shrink-0 relative">
                                                        <div className="text-[10px] font-black italic text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
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

                    <div className="grid grid-cols-4 gap-4">
                        {achievements.slice(0, 4).map(ach => {
                            const Icon = ARCH_ICONS[ach.icon] || Trophy;
                            return (
                                <div key={ach.id} className="relative h-14">
                                    <button
                                        onClick={() => setSelectedArch(selectedArch === ach.id ? null : ach.id)}
                                        className={cn(
                                            "w-full h-full rounded-2xl flex items-center justify-center transition-all duration-500 relative group/icon shadow-lg",
                                            ach.unlocked
                                                ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 text-amber-500 border border-amber-500/20 hover:border-amber-500/50 hover:scale-110 active:scale-95'
                                                : 'bg-foreground/5 text-muted-foreground/20 border border-border/30 opacity-40 grayscale blur-[0.5px]',
                                            selectedArch === ach.id && "ring-2 ring-primary ring-offset-4 ring-offset-background scale-110 bg-primary/10"
                                        )}
                                    >
                                        <Icon size={22} className={cn("transition-all duration-500 group-hover/icon:rotate-6", ach.unlocked && "drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]")} />

                                        {/* Status Dot */}
                                        {ach.unlocked && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-border/50" />
                                        )}
                                    </button>

                                    {/* Custom Tooltip */}
                                    {selectedArch === ach.id && (
                                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 glass-premium border border-border/30 p-4 rounded-[2rem] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={cn("p-2 rounded-xl shadow-lg", ach.unlocked ? "bg-amber-500/10 text-amber-500" : "bg-foreground/5 text-muted-foreground")}>
                                                    <Icon size={16} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase text-foreground tracking-[0.2em] leading-tight">{t(`dashboard.achievements.${ach.id}_name`)}</p>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground/60 font-bold leading-relaxed italic">"{t(`dashboard.achievements.${ach.id}_desc`)}"</p>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900/95 rotate-45 border-r border-b border-border/30" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});
