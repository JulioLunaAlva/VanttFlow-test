import React, { useState } from 'react';
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Calendar, TrendingUp, AlertCircle, Wallet, Edit2, Key, Landmark, Banknote } from 'lucide-react';
import { AccountManager } from "@/components/accounts/AccountManager";
import { AccountForm } from "@/components/accounts/AccountForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { es, enUS, ptBR, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useIdentity } from "@/context/IdentityContext";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { cn } from "@/lib/utils";

export const AccountsPage = () => {
    const { t, i18n } = useTranslation();
    const { accounts, getCreditCardStatus, updateAccount, getAccountBalance } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';

    const localeMap = { es, en: enUS, pt: ptBR, fr };
    const currentLocale = localeMap[i18n.language] || es;
    const [editingAccount, setEditingAccount] = useState(null);

    const creditCards = accounts.filter(a => a.type === 'credit');
    const debitAccounts = accounts.filter(a => a.type !== 'credit');

    const handleUpdate = (data) => {
        if (editingAccount) {
            updateAccount(editingAccount.id, data);
            setEditingAccount(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    const renderCardVisual = (account) => {
        const status = getCreditCardStatus(account.id);
        const { currentDebt, availableCredit, nextPaymentDate, utilization } = status || {
            currentDebt: 0, availableCredit: 0, nextPaymentDate: null, utilization: 0
        };

        // Clamp availableCredit to min 0 for display
        const displayAvailable = Math.max(0, availableCredit);
        const hasLimit = account.limit > 0;

        return (
            <div key={account.id} className="card-interactive overflow-hidden group relative flex flex-col h-auto min-h-[320px]">
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 bg-background/50 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm hover:bg-background/80 hover:text-primary transition-colors"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={16} />
                    </Button>
                </div>

                <div
                    className="min-h-[11rem] h-auto p-8 text-white flex flex-col justify-between relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${account.color || '#1e293b'} 0%, #000000 100%)`,
                    }}
                >
                    <div className="flex justify-between items-start z-10 drop-shadow-md">
                        <div>
                            <p className="opacity-90 text-[10px] font-bold uppercase tracking-widest mb-1 text-white">{t('accounts.credit_card') || 'Tarjeta de Crédito'}</p>
                            <h3 className="font-black text-2xl tracking-tight line-clamp-2 pr-12 text-white leading-tight">{account.name}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    
                    <div className="z-10 mt-6 drop-shadow-md">
                        <p className="text-[10px] opacity-90 font-bold uppercase tracking-widest mb-1 text-white">{t('accounts.current_debt') || 'Deuda Actual'}</p>
                        <p className="text-3xl font-black tracking-tight font-mono text-white leading-none">
                            <PrivacyBlur intensity="lg">{formatCurrency(currentDebt)}</PrivacyBlur>
                        </p>
                        {/* Alerta si el límite no está configurado */}
                        {!hasLimit && (
                            <p className="text-[10px] text-yellow-300/80 font-semibold mt-1.5 flex items-center gap-1">
                                <AlertCircle size={10} />
                                Configura el límite de crédito
                            </p>
                        )}
                    </div>

                    <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
                </div>

                <div className="flex-1 p-6 flex flex-col gap-6 bg-card border-t border-border/50">
                    {hasLimit ? (
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
                                <span className="text-muted-foreground/60">{t('accounts.limit_used') || 'Uso de Crédito'}</span>
                                <span className={cn(
                                    "p-1 px-3 rounded-full text-[9px]",
                                    utilization > 80 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                )}>{utilization.toFixed(1)}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-foreground/5 rounded-full overflow-hidden p-[1px] border border-border/30">
                                <Progress
                                    value={Math.min(utilization, 100)}
                                    className="h-full rounded-full"
                                    indicatorClassName={cn(
                                        "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                        utilization > 80 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                                    )}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black tracking-[0.1em] text-muted-foreground/40 pt-1">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow" /> {t('accounts.limit_available', { amount: formatCurrency(displayAvailable) })}</span>
                                <span>{t('accounts.limit_total', { amount: formatCurrency(account.limit) })}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                            <AlertCircle size={14} className="text-yellow-500 flex-shrink-0" />
                            <p className="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">
                                Edita la tarjeta para configurar el límite y ver el uso de crédito.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="bg-muted/30 p-3.5 rounded-2xl border border-border/40">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                <Calendar size={12} className="text-primary" /> {t('accounts.cutoff_day') || 'Corte'}
                            </div>
                            <p className="font-black text-sm text-foreground">
                                {account.cutOffDay ? `${t('accounts.day') || 'Día'} ${account.cutOffDay}` : '—'}
                            </p>
                        </div>
                        <div className="bg-muted/30 p-3.5 rounded-2xl border border-border/40">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                <AlertCircle size={12} className={utilization > 0 ? "text-rose-500" : "text-muted-foreground"} /> {t('accounts.pay_before') || 'Pago'}
                            </div>
                            <p className={cn(
                                "font-black text-sm",
                                utilization > 0 ? "text-rose-500" : "text-foreground"
                            )}>
                                {nextPaymentDate ? format(nextPaymentDate, 'dd MMM', { locale: currentLocale }) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDebitCard = (account) => {
        const balance = getAccountBalance(account.id);

        return (
            <div key={account.id} className="card-interactive flex flex-col h-auto min-h-[280px] relative overflow-hidden group">
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 hover:bg-foreground/10 rounded-2xl border border-border/30 shadow-sm"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                </div>
                <div className="p-8 flex-1 flex flex-col relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            {account.type === 'cash' ? <Banknote size={24} className="text-emerald-500" /> :
                                account.type === 'investment' ? <TrendingUp size={24} className="text-blue-500" /> :
                                    <Landmark size={24} className="text-primary" />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-xl tracking-tight line-clamp-2 leading-tight">{account.name}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                {account.type === 'cash' ? t('accounts.cash') || 'Efectivo' :
                                    account.type === 'investment' ? t('accounts.investment') || 'Inversión' :
                                        t('accounts.debit_short') || 'Cta. Débito'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{t('accounts.available_balance') || 'Saldo Disponible'}</p>
                        <p className={cn(
                            "text-3xl font-black tracking-tight truncate",
                            balance < 0 ? 'text-rose-500' : 'text-foreground'
                        )}>
                            <PrivacyBlur intensity="lg">{formatCurrency(balance)}</PrivacyBlur>
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ background: account.color || '#10b981', opacity: 0.8 }} />
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Compacto */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">{t('accounts.title') || 'Mis Cuentas'}</h2>
                        <p className="text-caption text-muted-foreground/50 mt-0.5">{t('accounts.subtitle') || 'Gestiona tu liquidez y líneas de crédito'}</p>
                    </div>
                </div>

                <div className="mt-4 sm:mt-0">
                    <AccountManager />
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-border/30 pb-4 relative group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl group-hover:scale-110 transition-transform">
                        <Wallet size={24} className="text-emerald-500 shadow-glow" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">{t('accounts.cash_debit_header') || 'Efectivo y Débito'}</h3>
                        <div className="absolute bottom-[-1px] left-0 w-24 h-[3px] bg-emerald-500 shadow-glow rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    </div>
                </div>
                {debitAccounts.length === 0 ? (
                    <div className="py-20 card-base border-dashed text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-border/30 text-muted-foreground/20">
                            <Wallet size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tighter text-foreground">{t('accounts.no_debit_accounts') || 'No hay cuentas registradas'}</p>
                            <p className="text-xs text-muted-foreground/60 font-medium px-4 mt-1">{t('accounts.no_debit_accounts_desc') || 'Agrega tus cuentas bancarias o efectivo para ver sus saldos.'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {debitAccounts.map(renderDebitCard)}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-border/30 pb-4 relative group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl group-hover:scale-110 transition-transform">
                        <CreditCard size={24} className="text-primary shadow-glow" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">{t('accounts.credit_header') || 'Líneas de Crédito'}</h3>
                        <div className="absolute bottom-[-1px] left-0 w-24 h-[3px] bg-primary shadow-glow rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    </div>
                </div>
                {creditCards.length === 0 ? (
                    <div className="py-20 card-base border-dashed text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-border/30 text-muted-foreground/20">
                            <CreditCard size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tighter text-foreground">{t('accounts.no_credit_cards') || 'Sin tarjetas registradas'}</p>
                            <p className="text-xs text-muted-foreground/60 font-medium px-4 mt-1">{t('accounts.no_credit_cards_desc') || 'Mantén el control de tus fechas de corte y límites utilizados.'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {creditCards.map(renderCardVisual)}
                    </div>
                )}
            </div>

            <Dialog open={!!editingAccount} onOpenChange={(val) => !val && setEditingAccount(null)}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-border/30">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black tracking-tighter text-foreground">{t('accounts.edit_account') || 'Editar Cuenta'}</DialogTitle>
                            <p className="text-xs text-muted-foreground/60">{t('accounts.edit_desc') || 'Ajusta los detalles de tu cuenta financiera'}</p>
                        </DialogHeader>
                    </div>
                    <div className="p-6 pt-4">
                        {editingAccount && (
                            <AccountForm
                                initialData={editingAccount}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingAccount(null)}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
