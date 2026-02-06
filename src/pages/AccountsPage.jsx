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

        return (
            <Card key={account.id} className="overflow-hidden hover:shadow-xl transition-all group relative border-none shadow-md">
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={14} />
                    </Button>
                </div>

                <div
                    className="h-36 p-6 text-white flex flex-col justify-between relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${account.color || '#1e293b'} 0%, #000000 100%)`,
                    }}
                >
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="opacity-70 text-[10px] font-black uppercase tracking-widest">{t('accounts.credit_card') || 'Tarjeta de Crédito'}</p>
                            <h3 className="font-black text-xl tracking-tighter truncate pr-8">{account.name}</h3>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <CreditCard className="w-5 h-5 opacity-80" />
                        </div>
                    </div>
                    <div className="z-10">
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">{t('accounts.current_debt') || 'Deuda Actual'}</p>
                        <p className="text-3xl font-black tracking-tighter font-mono">
                            <PrivacyBlur intensity="md">{formatCurrency(currentDebt)}</PrivacyBlur>
                        </p>
                    </div>

                    {/* Decorative abstract elements */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                <CardContent className="p-6 space-y-6 bg-card/50 backdrop-blur-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                            <span className="text-muted-foreground">{t('accounts.limit_used') || 'Uso de Crédito'}</span>
                            <span className={utilization > 80 ? 'text-rose-500' : 'text-emerald-500'}>{utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={utilization} className="h-2.5" indicatorClassName={utilization > 80 ? 'bg-rose-500' : 'bg-emerald-500'} />
                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground/60 pt-1">
                            <span>{t('accounts.limit_available') || 'Disponible'}: {formatCurrency(availableCredit)}</span>
                            <span>Total: {formatCurrency(account.limit)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-muted/30 p-3 rounded-2xl border border-border/10">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                <Calendar size={12} className="text-primary" /> {t('accounts.cutoff_day') || 'Corte'}
                            </div>
                            <p className="font-black text-sm">{t('accounts.day') || 'Día'} {account.cutOffDay}</p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-2xl border border-border/10">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                <AlertCircle size={12} className="text-primary" /> {t('accounts.pay_before') || 'Pago'}
                            </div>
                            <p className={`font-black text-sm ${utilization > 0 ? 'text-rose-500' : ''}`}>
                                {nextPaymentDate ? format(nextPaymentDate, 'dd MMM', { locale: currentLocale }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderDebitCard = (account) => {
        const balance = getAccountBalance(account.id);

        return (
            <Card key={account.id} className="overflow-hidden hover:shadow-xl transition-all group relative border-none shadow-md bg-card/40 backdrop-blur-xl border-l-4" style={{ borderLeftColor: account.color || '#10b981' }}>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-muted"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={14} />
                    </Button>
                </div>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-muted/50 border border-border/10 shadow-inner group-hover:scale-110 transition-transform">
                                {account.type === 'cash' ? <Banknote size={20} className="text-emerald-500" /> :
                                    account.type === 'investment' ? <TrendingUp size={20} className="text-blue-500" /> :
                                        <Landmark size={20} className="text-primary" />}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-black text-lg tracking-tight truncate leading-tight">{account.name}</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                                    {account.type === 'cash' ? t('accounts.cash') || 'Efectivo' :
                                        account.type === 'investment' ? t('accounts.investment') || 'Inversión' :
                                            t('accounts.debit_short') || 'Cta. Débito'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter mb-0.5">{t('accounts.available_balance') || 'Saldo Disponible'}</p>
                            <p className={`text-2xl font-black tracking-tighter ${balance < 0 ? 'text-rose-500' : 'text-foreground'}`}>
                                <PrivacyBlur intensity="md">{formatCurrency(balance)}</PrivacyBlur>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t('accounts.title') || 'Mis Cuentas'}
                    </h2>
                    <p className="text-muted-foreground font-medium">{t('accounts.subtitle') || 'Gestiona tu liquidez y líneas de crédito'}</p>
                </div>
                <div className="flex items-center gap-2">
                    <AccountManager />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Wallet size={18} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">{t('accounts.cash_debit_header') || 'Efectivo y Débito'}</h3>
                </div>
                {debitAccounts.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed rounded-[32px] bg-muted/10 opacity-60 space-y-4">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center shadow-inner">
                            <Wallet size={36} className="text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-lg tracking-tight">{t('accounts.no_debit_accounts') || 'No hay cuentas registradas'}</p>
                            <p className="text-sm text-muted-foreground px-8">{t('accounts.no_debit_accounts_desc') || 'Agregas tus cuentas bancarias o efectivo para ver sus saldos.'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {debitAccounts.map(renderDebitCard)}
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard size={18} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">{t('accounts.credit_header') || 'Líneas de Crédito'}</h3>
                </div>
                {creditCards.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed rounded-[32px] bg-muted/10 opacity-60 space-y-4">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center shadow-inner">
                            <CreditCard size={36} className="text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-lg tracking-tight">{t('accounts.no_credit_cards') || 'Sin tarjetas registradas'}</p>
                            <p className="text-sm text-muted-foreground px-8">{t('accounts.no_credit_cards_desc') || 'Mantén el control de tus fechas de corte y límites utilizados.'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {creditCards.map(renderCardVisual)}
                    </div>
                )}
            </div>

            <Dialog open={!!editingAccount} onOpenChange={(val) => !val && setEditingAccount(null)}>
                <DialogContent className="max-w-md rounded-[32px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">{t('accounts.edit_account') || 'Editar Cuenta'}</DialogTitle>
                    </DialogHeader>
                    {editingAccount && (
                        <AccountForm
                            initialData={editingAccount}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditingAccount(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
