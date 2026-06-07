import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFinance } from "@/context/FinanceContext";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { useTranslation } from 'react-i18next';
import { useIdentity } from '@/context/IdentityContext';
import { cn } from "@/lib/utils";

const StatCard = ({ label, sublabel, value, icon: Icon, iconBg, iconColor, valueColor, accentColor, id }) => (
    <div
        id={id}
        className={cn(
            "relative overflow-hidden rounded-2xl p-4 md:p-5",
            "bg-card border border-border/40 dark:border-white/[0.06]",
            "shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)]",
            "transition-all duration-200 active:scale-[0.98]"
        )}
    >
        {/* Accent glow */}
        <div
            className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-[50px] opacity-35"
            style={{ background: accentColor }}
        />

        <div className="relative z-10 flex items-start justify-between mb-3">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/55">
                    {label}
                </p>
                {sublabel && (
                    <p className="text-[10px] text-muted-foreground/35 font-medium mt-0.5">
                        {sublabel}
                    </p>
                )}
            </div>
            {/* Icon */}
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
                <Icon size={15} className={iconColor} strokeWidth={2} />
            </div>
        </div>

        {/* Amount */}
        <div className={cn("text-[1.5rem] font-black tracking-[-0.035em] leading-none", valueColor)}>
            <PrivacyBlur intensity="lg">{value}</PrivacyBlur>
        </div>
    </div>
);

export const SummaryCards = React.memo(() => {
    const { t } = useTranslation();
    const { user } = useIdentity();
    const { summary } = useFinance();
    const { income, expense, balance } = summary;

    const fmt = (amount) => new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: user?.currency || 'MXN',
        maximumFractionDigits: 0
    }).format(amount);

    return (
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-3">
            <StatCard
                id="tour-balance"
                label={t('summary.total_balance')}
                sublabel={t('summary.current_status')}
                value={fmt(balance)}
                icon={Wallet}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                valueColor="text-foreground"
                accentColor="hsl(217 100% 65% / 0.3)"
            />
            <StatCard
                label={t('summary.income')}
                sublabel={t('summary.total_in')}
                value={fmt(income)}
                icon={TrendingUp}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-500"
                valueColor="text-emerald-500"
                accentColor="rgb(16 185 129 / 0.25)"
            />
            <StatCard
                label={t('summary.expense')}
                sublabel={t('summary.total_out')}
                value={fmt(expense)}
                icon={TrendingDown}
                iconBg="bg-rose-500/10"
                iconColor="text-rose-500"
                valueColor="text-rose-500"
                accentColor="rgb(244 63 94 / 0.25)"
            />
        </div>
    );
});