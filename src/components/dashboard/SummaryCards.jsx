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
            <Card id="tour-balance" className="sm:col-span-2 md:col-span-1 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">{t('summary.total_balance')}</CardTitle>
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                    <div className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        <PrivacyBlur intensity="lg">{formatCurrency(balance)}</PrivacyBlur>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground/60 mt-2 uppercase tracking-wider">
                        {t('summary.current_status')}
                    </p>
                </CardContent>
            </Card>
            <Card className="group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">{t('summary.income')}</CardTitle>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                        <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                    <div className="text-2xl md:text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        <PrivacyBlur intensity="lg">{formatCurrency(income)}</PrivacyBlur>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground/60 mt-2 uppercase tracking-wider">
                        {t('summary.total_in')}
                    </p>
                </CardContent>
            </Card>
            <Card className="group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">{t('summary.expense')}</CardTitle>
                    <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center transition-transform group-hover:scale-110">
                        <ArrowDownCircle className="h-5 w-5 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 md:pb-6">
                    <div className="text-2xl md:text-4xl font-bold tracking-tight text-destructive dark:text-red-400">
                        <PrivacyBlur intensity="lg">{formatCurrency(expense)}</PrivacyBlur>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground/60 mt-2 uppercase tracking-wider">
                        {t('summary.total_out')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
});