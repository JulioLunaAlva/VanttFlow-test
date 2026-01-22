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
        <div className="grid gap-4 md:grid-cols-3">
            <Card id="tour-balance" className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-lg anime:border-2 gamer:border-primary/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-foreground/60 anime:text-foreground/80">{t('summary.total_balance')}</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tracking-tighter text-foreground">
                        <PrivacyBlur intensity="lg">{formatCurrency(balance)}</PrivacyBlur>
                    </div>
                    <p className="text-[10px] font-bold text-foreground/40 mt-1 uppercase tracking-tighter">
                        {t('summary.current_status')}
                    </p>
                </CardContent>
            </Card>
            <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-lg anime:border-2 hover:border-emerald-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-foreground/60 anime:text-foreground/80">{t('summary.income')}</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400 anime:text-emerald-700">
                        <PrivacyBlur intensity="lg">{formatCurrency(income)}</PrivacyBlur>
                    </div>
                    <p className="text-[10px] font-bold text-foreground/40 mt-1 uppercase tracking-tighter">
                        {t('summary.total_in')}
                    </p>
                </CardContent>
            </Card>
            <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-lg anime:border-2 hover:border-destructive/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-foreground/60 anime:text-foreground/80">{t('summary.expense')}</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <ArrowDownCircle className="h-4 w-4 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black tracking-tighter text-destructive dark:text-red-400 anime:text-red-700">
                        <PrivacyBlur intensity="lg">{formatCurrency(expense)}</PrivacyBlur>
                    </div>
                    <p className="text-[10px] font-bold text-foreground/40 mt-1 uppercase tracking-tighter">
                        {t('summary.total_out')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
});