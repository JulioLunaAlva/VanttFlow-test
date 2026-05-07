import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { format, isPast, isToday } from 'date-fns';
import { enUS, es, ptBR, fr } from 'date-fns/locale';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIdentity } from '@/context/IdentityContext';

import { cn } from "@/lib/utils";

const locales = { es, en: enUS, pt: ptBR, fr };
export const PendingPaymentsWidget = () => {
    const { t, i18n } = useTranslation();
    const { user } = useIdentity();
    const { getScheduledForMonth, selectedMonth, processScheduledPayment } = useFinance();
    const scheduledItems = getScheduledForMonth(selectedMonth);

    const pendingItems = scheduledItems.filter(i => i.state === 'pending' && i.status === 'active').sort((a, b) => a.dayOfMonth - b.dayOfMonth);

    const currentLocale = locales[i18n.language.split('-')[0]] || es;

    if (scheduledItems.length === 0) return null;

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Clock size={20} />
                    </span>
                    {t('dashboard.pending')}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-foreground/5 border border-border/30 px-3 py-1 rounded-full uppercase tracking-widest text-muted-foreground">
                        {t('dashboard.pending_count', { count: pendingItems.length })}
                    </span>
                    <Button variant="ghost" className="text-[10px] h-auto p-2 font-black uppercase text-primary hover:bg-primary/10 rounded-xl" asChild>
                        <Link to="/scheduled">{t('dashboard.view_all')}</Link>
                    </Button>
                </div>
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    {pendingItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                                <Check className="h-8 w-8 text-emerald-500" />
                            </div>
                            <p className="font-black text-sm tracking-tight">{t('dashboard.all_caught_up')}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{t('common.great_job') || '¡Buen trabajo!'}</p>
                        </div>
                    )}
                    {pendingItems.map(item => {
                        const isLate = isPast(item.currentMonthDate) && isToday(item.currentMonthDate);
                        return (
                            <div key={item.id} className="group relative flex items-center justify-between p-4 rounded-[1.5rem] bg-foreground/5 border border-border/30 hover:border-border/30 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110",
                                        isLate ? "bg-rose-500/20 text-rose-500 border border-rose-500/20" : "bg-primary/10 text-primary border border-primary/20"
                                    )}>
                                        {isLate ? <AlertCircle size={24} /> : <Clock size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-black text-lg tracking-tight leading-none group-hover:text-primary transition-colors">{item.name}</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-60">
                                            {format(item.currentMonthDate, 'd MMM', { locale: currentLocale })} • <span className="text-foreground/80">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: user?.currency || 'MXN' }).format(item.amount)}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:scale-110 transition-all"
                                        title={t('dashboard.mark_paid')}
                                        onClick={() => processScheduledPayment(item, 'pay')}
                                    >
                                        <Check size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-10 w-10 rounded-2xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:scale-110 transition-all"
                                        title={t('dashboard.skip_month')}
                                        onClick={() => processScheduledPayment(item, 'skip')}
                                    >
                                        <X size={18} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};