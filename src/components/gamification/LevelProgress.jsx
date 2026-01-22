import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import { Sparkles, Trophy, Zap, Star } from 'lucide-react';

export const LevelProgress = ({ variant = 'full', showTitle = true, className }) => {
    const { xp, currentLevel, nextLevel, isEnabled } = useGamification();

    if (!isEnabled) return null;

    const progress = nextLevel
        ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
        : 100;

    if (variant === 'compact') {
        return (
            <div className={cn("flex flex-col gap-1 select-none", className)}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                        <div className="relative">
                            <Star size={10} className="text-amber-500 fill-amber-500 animate-pulse" />
                            <div className="absolute inset-0 bg-amber-500/20 blur-[4px] rounded-full" />
                        </div>
                        <span className="text-[10px] font-black italic text-foreground tracking-tighter">L{currentLevel.level}</span>
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground/80 tracking-widest">{xp} XP</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted border border-border/30">
                    <div
                        className="h-full relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-primary to-purple-500 shadow-[0_0_8px_rgba(var(--primary),0.2)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-3 select-none", className)}>
            <div className="flex items-end justify-between px-1">
                <div className="space-y-0.5 text-left">
                    <p className="text-[9px] font-black tracking-[0.2em] text-primary/70 uppercase">Progreso de Nivel</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black italic tracking-tighter text-foreground drop-shadow-sm">Lvl {currentLevel.level}</span>
                        <div className="h-5 w-[1px] bg-border/60 -rotate-[15deg] mx-1" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{currentLevel.title}</span>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1 group/xp">
                        <span className="text-lg font-black text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.3)]">{xp}</span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">XP</span>
                    </div>
                    {nextLevel && (
                        <span className="text-[8px] font-bold text-muted-foreground/40 italic">Meta: {nextLevel.minXp}</span>
                    )}
                </div>
            </div>

            <div className="relative h-4 w-full overflow-hidden rounded-xl bg-card border-2 border-border/40 p-[2px] shadow-inner">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />

                <div
                    className="h-full relative overflow-hidden rounded-[8px] bg-gradient-to-r from-indigo-600 via-primary to-purple-500 shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ width: `${progress}%` }}
                >
                    {/* High-end shimmer effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.3)_45%,rgba(255,255,255,0.3)_55%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_3s_infinite]" />

                    {/* Leading glow flare */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 blur-xl animate-pulse" />
                </div>
            </div>

            {showTitle && (
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 group cursor-default">
                        <div className="relative">
                            <Trophy size={14} className="group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 blur-[6px] bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">Siguiente nivel en camino</p>
                    </div>
                    {nextLevel && (
                        <p className="text-[9px] font-bold text-muted-foreground italic opacity-60">Faltan {nextLevel.minXp - xp} XP</p>
                    )}
                </div>
            )}
        </div>
    );
};
