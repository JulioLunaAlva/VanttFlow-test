import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { useTranslation } from 'react-i18next';
import { Wallet, CreditCard, Landmark, Banknote, TrendingUp, ChevronRight } from 'lucide-react';
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { useIdentity } from "@/context/IdentityContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const AccountsWidget = () => {
    const { accounts, getAccountBalance, getCreditCardStatus } = useFinance();
    const { t, i18n } = useTranslation();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language, {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calcular balances y totales
    const processedAccounts = accounts.map(acc => {
        let balance = 0;
        if (acc.type === 'credit') {
            const status = getCreditCardStatus(acc.id);
            balance = status ? -status.currentDebt : 0;
        } else {
            balance = getAccountBalance(acc.id);
        }
        return { ...acc, balance };
    }).sort((a, b) => b.balance - a.balance);

    const totalAssets = processedAccounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
    const totalDebts = processedAccounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0);

    const getIcon = (type) => {
        switch (type) {
            case 'cash': return <Banknote size={16} className="text-emerald-500" />;
            case 'credit': return <CreditCard size={16} className="text-rose-500" />;
            case 'investment': return <TrendingUp size={16} className="text-blue-500" />;
            default: return <Landmark size={16} className="text-primary" />;
        }
    };

    return (
        <div className="h-full flex flex-col relative group overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Wallet size={20} />
                    </span>
                    {t('dashboard.accounts_breakdown') || 'Mis Cuentas'}
                </h3>
                <Link to="/accounts">
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-2xl bg-foreground/5 border border-border/50 hover:bg-primary/20 hover:text-primary transition-all">
                        <ChevronRight size={18} />
                    </Button>
                </Link>
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="space-y-4">
                    {processedAccounts.length === 0 ? (
                        <div className="py-12 text-center bg-foreground/5 rounded-[2rem] border border-dashed border-border/50 flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-foreground/5">
                                <Wallet size={32} className="text-muted-foreground/30" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{t('dashboard.no_accounts') || 'Sin cuentas vinculadas'}</p>
                        </div>
                    ) : (
                        processedAccounts.slice(0, 4).map((account) => {
                            const percentage = totalAssets > 0 && account.balance > 0
                                ? (account.balance / totalAssets) * 100
                                : 0;

                            return (
                                <div key={account.id} className="relative group/item flex items-center justify-between p-3 rounded-2xl bg-foreground/5 border border-border/10 hover:border-border/30 hover:bg-foreground/10 transition-all duration-300">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 shrink-0 rounded-xl glass-premium border border-border/50 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/item:scale-110">
                                            {getIcon(account.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-base tracking-tight line-clamp-2 leading-tight pr-2">{account.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border",
                                                    account.type === 'credit' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                    account.type === 'investment' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                )}>
                                                    {account.type}
                                                </span>
                                                {percentage > 0 && (
                                                    <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest leading-none">
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className={cn(
                                            "text-xl font-black tracking-tighter drop-shadow-sm",
                                            account.balance < 0 ? "text-rose-500" : "text-foreground"
                                        )}>
                                            <PrivacyBlur intensity="sm">{formatCurrency(account.balance)}</PrivacyBlur>
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {processedAccounts.length > 4 && (
                        <Link to="/accounts" className="flex justify-center pt-2">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:scale-110 transition-transform cursor-pointer">
                                + {processedAccounts.length - 4} {t('common.more') || 'cuentas'}
                            </p>
                        </Link>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-border/50 flex gap-4">
                    <div className="flex-1 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-xs font-black text-emerald-500/60 uppercase tracking-widest mb-1">{t('common.assets') || 'Activos'}</p>
                        <p className="text-base font-black text-emerald-500 tracking-tight leading-none">
                            <PrivacyBlur intensity="sm">{formatCurrency(totalAssets)}</PrivacyBlur>
                        </p>
                    </div>
                    <div className="flex-1 p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                        <p className="text-xs font-black text-rose-500/60 uppercase tracking-widest mb-1">{t('common.liabilities') || 'Deudas'}</p>
                        <p className="text-base font-black text-rose-500 tracking-tight leading-none">
                            <PrivacyBlur intensity="sm">{formatCurrency(Math.abs(totalDebts))}</PrivacyBlur>
                        </p>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
        </div>
    );
};
