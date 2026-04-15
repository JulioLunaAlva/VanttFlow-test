import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { useFinance } from "@/context/FinanceContext";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { useTranslation } from 'react-i18next';
import { useIdentity } from '@/context/IdentityContext';

export const SummaryCards = React.memo(() => {
    const { t } = useTranslation();
    const { user } = useIdentity();
    const { summary } = useFinance();
    const { income, expense, balance } = summary;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: user?.currency || 'MXN'
        }).format(amount);
    };

    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8">
            <div id="tour-balance" className="glass-card card-glow p-6 group">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('summary.total_balance')}</p>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                        <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-3xl md:text-5xl font-black tracking-tighter text-foreground drop-shadow-sm">
                        <PrivacyBlur intensity="lg">{formatCurrency(balance)}</PrivacyBlur>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {t('summary.current_status')}
                        </p>
                    </div>
                </div>
            </div>
            <div className="glass-card card-glow p-6 group">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('summary.income')}</p>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20">
                        <ArrowUpCircle className="h-6 w-6 text-emerald-500" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-2xl md:text-4xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                        <PrivacyBlur intensity="lg">{formatCurrency(income)}</PrivacyBlur>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {t('summary.total_in')}
                        </p>
                    </div>
                </div>
            </div>
            <div className="glass-card card-glow p-6 group">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('summary.expense')}</p>
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-destructive/20">
                        <ArrowDownCircle className="h-6 w-6 text-destructive" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-2xl md:text-4xl font-black tracking-tighter text-destructive dark:text-red-400 drop-shadow-sm">
                        <PrivacyBlur intensity="lg">{formatCurrency(expense)}</PrivacyBlur>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {t('summary.total_out')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});