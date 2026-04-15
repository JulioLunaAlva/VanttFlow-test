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
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-12">
            {/* Total Balance Card */}
            <div id="tour-balance" className="group relative overflow-hidden p-8 rounded-[2.5rem] glass-premium transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(var(--primary),0.15)] border-white/5 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none group-hover:text-primary transition-colors duration-500">{t('summary.total_balance')}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t('summary.current_status')}</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-6">
                            <DollarSign className="h-7 w-7 text-primary" />
                        </div>
                    </div>
                    
                    <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground drop-shadow-2xl transition-transform duration-500 group-hover:translate-x-1">
                        <PrivacyBlur intensity="lg">{formatCurrency(balance)}</PrivacyBlur>
                    </div>
                </div>
            </div>

            {/* Income Card */}
            <div className="group relative overflow-hidden p-8 rounded-[2.5rem] glass-premium transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] border-white/5 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none group-hover:text-emerald-500 transition-colors duration-500">{t('summary.income')}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t('summary.total_in')}</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:rotate-6">
                            <ArrowUpCircle className="h-7 w-7 text-emerald-500" />
                        </div>
                    </div>
                    
                    <div className="text-4xl md:text-5xl font-black tracking-tighter text-emerald-500 drop-shadow-2xl transition-transform duration-500 group-hover:translate-x-1">
                        <PrivacyBlur intensity="lg">{formatCurrency(income)}</PrivacyBlur>
                    </div>
                </div>
            </div>

            {/* Expense Card */}
            <div className="group relative overflow-hidden p-8 rounded-[2.5rem] glass-premium transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(244,63,94,0.15)] border-white/5 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px] group-hover:bg-rose-500/20 transition-all duration-700" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none group-hover:text-rose-500 transition-colors duration-500">{t('summary.expense')}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t('summary.total_out')}</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-rose-500/20 group-hover:-rotate-6">
                            <ArrowDownCircle className="h-7 w-7 text-rose-500" />
                        </div>
                    </div>
                    
                    <div className="text-4xl md:text-5xl font-black tracking-tighter text-rose-500 drop-shadow-2xl transition-transform duration-500 group-hover:translate-x-1">
                        <PrivacyBlur intensity="lg">{formatCurrency(expense)}</PrivacyBlur>
                    </div>
                </div>
            </div>
        </div>
    );
});