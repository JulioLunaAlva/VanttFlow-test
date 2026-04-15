import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { TrendingDown, TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";

export const ForecastWidget = () => {
    const { t } = useTranslation();
    const { getForecast } = useFinance();
    const { user } = useIdentity();
    const forecast = getForecast();
    const currency = user?.currency || 'MXN';

    // Safety levels:
    // Green: Forecast > 20% of current balance (plenty buffer)
    // Yellow: Forecast > 0 but < 20% (tight)
    // Red: Forecast < 0 (Danger)

    // Fallback for divide by zero
    const bufferRatio = forecast.currentBalance > 0
        ? (forecast.forecastBalance / forecast.currentBalance)
        : (forecast.forecastBalance > 0 ? 1 : 0);

    const statusColor = forecast.forecastBalance < 0
        ? "text-red-600 dark:text-red-400"
        : (bufferRatio < 0.2 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400");

    // Instead of full background color, we use subtle borders and a very light tint that respects the theme
    // We use 'bg-card' as base to ensure it matches the theme (dark/light/pink/gamer)
    // We add a colored border-l-4 (left border) to indicate status clearly without overwhelming the card

    const borderClass = forecast.forecastBalance < 0
        ? "border-l-red-500"
        : (bufferRatio < 0.2 ? "border-l-amber-500" : "border-l-emerald-500");

    const tintClass = forecast.forecastBalance < 0
        ? "bg-red-50/50 dark:bg-red-900/10"
        : (bufferRatio < 0.2 ? "bg-amber-50/50 dark:bg-amber-900/10" : "bg-emerald-50/50 dark:bg-emerald-900/10");

    return (
        <div className={cn(
            "h-full flex flex-col relative group overflow-hidden border-l-[6px] transition-all duration-500",
            forecast.forecastBalance < 0 ? "border-l-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]" : 
            bufferRatio < 0.2 ? "border-l-amber-500" : "border-l-emerald-500"
        )}>
            {/* Background tint */}
            <div className={cn(
                "absolute inset-0 opacity-10 -z-10 transition-colors duration-700",
                forecast.forecastBalance < 0 ? "bg-rose-500" : 
                bufferRatio < 0.2 ? "bg-amber-500" : "bg-emerald-500"
            )} />
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className={cn(
                        "p-2 rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-110",
                        forecast.forecastBalance < 0 ? "bg-rose-500/10 text-rose-500" : 
                        bufferRatio < 0.2 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                        <Calendar size={20} />
                    </span>
                    {t('dashboard.forecast_widget.title')}
                </h3>
                {forecast.forecastBalance < 0 ? (
                    <AlertTriangle className="h-6 w-6 text-rose-500 animate-pulse" />
                ) : (
                    <CheckCircle className={cn("h-6 w-6", statusColor)} />
                )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="space-y-6">
                    <div className="relative">
                        <div className={cn("text-4xl font-black tracking-tighter drop-shadow-sm transition-transform duration-500 group-hover:scale-105 origin-left", statusColor)}>
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency }).format(forecast.forecastBalance)}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mt-2 leading-none">
                            {t('dashboard.forecast_widget.real_available')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 group/row transition-all hover:bg-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover/row:text-foreground transition-colors">{t('dashboard.forecast_widget.current')}</span>
                            <span className="text-xs font-black">{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.currentBalance)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 group/row transition-all hover:bg-rose-500/10">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500">
                                <TrendingDown size={14} /> {t('dashboard.forecast_widget.pending_payments')} ({forecast.pendingCount})
                            </span>
                            <span className="text-xs font-black text-rose-500">-{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.pendingExpenses)}</span>
                        </div>

                        {forecast.estimatedDailyExpenses > 0 && (
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 border-dashed group/row transition-all hover:bg-white/10 italic">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 group-hover/row:text-foreground transition-colors">
                                    {t('dashboard.daily_expense_est')} (x{new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} {t('dashboard.days_left')})
                                </span>
                                <span className="text-[10px] font-black opacity-60">-{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.estimatedDailyExpenses)}</span>
                            </div>
                        )}

                        {forecast.pendingIncome > 0 && (
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group/row transition-all hover:bg-emerald-500/10">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    <TrendingUp size={14} /> {t('dashboard.forecast_widget.expected_income')}
                                </span>
                                <span className="text-xs font-black text-emerald-500">+{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.pendingIncome)}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Visual indicator of "buffer power" */}
                {forecast.forecastBalance > 0 && (
                    <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('dashboard.forecast_widget.buffer_safety') || 'Margen de Seguridad'}</span>
                            <span className={cn("text-[10px] font-black", statusColor)}>{(bufferRatio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className={cn("h-full transition-all duration-1000", 
                                    bufferRatio < 0.2 ? "bg-amber-500" : "bg-emerald-500"
                                )} 
                                style={{ width: `${Math.min(bufferRatio * 100, 100)}%` }} 
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
        </div>
    );
};
