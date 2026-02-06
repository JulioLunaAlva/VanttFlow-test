import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { useTranslation } from 'react-i18next';
import { Wallet, CreditCard, Landmark, Banknote, TrendingUp, ChevronRight } from 'lucide-react';
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { useIdentity } from "@/context/IdentityContext";
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
        <Card className="h-full border-none shadow-xl bg-card/40 backdrop-blur-xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                    <Wallet size={16} className="text-primary" />
                    {t('dashboard.accounts_breakdown') || 'Mis Cuentas'}
                </CardTitle>
                <Link to="/accounts" className="p-2 bg-muted/50 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                    <ChevronRight size={14} />
                </Link>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="space-y-3">
                    {processedAccounts.length === 0 ? (
                        <div className="py-8 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                            <p className="text-xs text-muted-foreground font-bold">{t('dashboard.no_accounts') || 'Sin cuentas'}</p>
                        </div>
                    ) : (
                        processedAccounts.slice(0, 4).map((account) => {
                            const percentage = totalAssets > 0 && account.balance > 0
                                ? (account.balance / totalAssets) * 100
                                : 0;

                            return (
                                <div key={account.id} className="relative group/item">
                                    <div className="flex items-center justify-between z-10 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-muted/80 flex items-center justify-center border border-border/10">
                                                {getIcon(account.type)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black truncate max-w-[100px]">{account.name}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                                                    {percentage > 0 ? `${percentage.toFixed(0)}% del total` : account.type}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={cn(
                                            "text-xs font-black font-mono",
                                            account.balance < 0 ? "text-rose-500" : "text-foreground"
                                        )}>
                                            <PrivacyBlur intensity="sm">{formatCurrency(account.balance)}</PrivacyBlur>
                                        </p>
                                    </div>

                                    {/* Progress background bar */}
                                    {account.balance > 0 && (
                                        <div className="absolute inset-0 -mx-1 -my-1.5 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                                    )}
                                </div>
                            );
                        })
                    )}

                    {processedAccounts.length > 4 && (
                        <Link to="/accounts" className="block text-center text-[10px] font-black text-primary uppercase tracking-widest pt-2 hover:underline">
                            + {processedAccounts.length - 4} {t('common.more') || 'más'}
                        </Link>
                    )}

                    <div className="pt-4 mt-4 border-t border-border/40 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <div className="text-emerald-500">
                            Activos: <PrivacyBlur intensity="sm">{formatCurrency(totalAssets)}</PrivacyBlur>
                        </div>
                        <div className="text-rose-500">
                            Pasivos: <PrivacyBlur intensity="sm">{formatCurrency(Math.abs(totalDebts))}</PrivacyBlur>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
