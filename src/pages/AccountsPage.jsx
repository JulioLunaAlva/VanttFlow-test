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

        return (
            <div key={account.id} className="glass-premium overflow-hidden group relative border-border/30 rounded-[2.5rem] transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] active:scale-95">
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 bg-foreground/5 hover:bg-foreground/20 text-foreground backdrop-blur-3xl border border-border/30 rounded-2xl shadow-2xl"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={16} />
                    </Button>
                </div>

                <div
                    className="h-56 p-10 text-foreground flex flex-col justify-between relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${account.color || '#1e293b'} 0%, #000000 100%)`,
                    }}
                >
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="opacity-40 text-[9px] font-black uppercase tracking-[0.4em] mb-2">{t('accounts.credit_card') || 'Tarjeta de Crédito'}</p>
                            <h3 className="font-black text-3xl tracking-tighter truncate pr-12 drop-shadow-2xl">{account.name}</h3>
                        </div>
                        <div className="p-4 bg-foreground/5 rounded-3xl backdrop-blur-3xl border border-border/30 shadow-3xl transform -rotate-12 transition-transform group-hover:rotate-0 duration-700">
                            <CreditCard className="w-8 h-8 text-primary shadow-glow" />
                        </div>
                    </div>
                    
                    <div className="z-10 mt-auto">
                        <p className="text-[9px] opacity-40 font-black uppercase tracking-[0.4em] mb-2">{t('accounts.current_debt') || 'Deuda Actual'}</p>
                        <p className="text-3xl font-black tracking-tighter font-mono drop-shadow-2xl">
                            <PrivacyBlur intensity="lg">{formatCurrency(currentDebt)}</PrivacyBlur>
                        </p>
                    </div>

                    {/* Premium Abstract Elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-foreground/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-8 space-y-8 bg-black/20 backdrop-blur-3xl">
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
                                value={utilization} 
                                className="h-full rounded-full" 
                                indicatorClassName={cn(
                                    "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                    utilization > 80 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                                )} 
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-black tracking-[0.1em] text-muted-foreground/40 pt-1">
                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow" /> {t('accounts.limit_available') || 'Disponible'}: {formatCurrency(availableCredit)}</span>
                            <span>Total: <span className="text-foreground/40">{formatCurrency(account.limit)}</span></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-premium p-4 rounded-3xl border border-border/30 transition-all hover:bg-foreground/5 group/stat">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
                                <Calendar size={14} className="text-primary group-hover:scale-110 transition-transform" /> {t('accounts.cutoff_day') || 'Corte'}
                            </div>
                            <p className="font-black text-base text-foreground/90">{t('accounts.day') || 'Día'} {account.cutOffDay}</p>
                        </div>
                        <div className="glass-premium p-4 rounded-3xl border border-border/30 transition-all hover:bg-foreground/5 group/stat">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
                                <AlertCircle size={14} className="text-rose-500/80 group-hover:scale-110 transition-transform" /> {t('accounts.pay_before') || 'Pago'}
                            </div>
                            <p className={cn(
                                "font-black text-base",
                                utilization > 0 ? "text-rose-400" : "text-foreground/90"
                            )}>
                                {nextPaymentDate ? format(nextPaymentDate, 'dd MMM', { locale: currentLocale }) : 'N/A'}
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
            <div key={account.id} className="glass-premium group relative border-border/30 flex flex-col h-full rounded-[2.5rem] transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] active:scale-95 overflow-hidden">
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 hover:bg-foreground/10 rounded-2xl border border-border/30 shadow-2xl backdrop-blur-3xl"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                </div>
                <div className="p-10 space-y-8 flex-1 flex flex-col relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="p-5 rounded-[2rem] bg-foreground/5 border border-border/30 shadow-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 backdrop-blur-3xl">
                            {account.type === 'cash' ? <Banknote size={28} className="text-emerald-500 shadow-glow" /> :
                                account.type === 'investment' ? <TrendingUp size={28} className="text-blue-500 shadow-glow" /> :
                                    <Landmark size={28} className="text-primary shadow-glow" />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-2xl tracking-tight truncate leading-tight drop-shadow-2xl">{account.name}</h3>
                            <p className="text-[10px] font-black text-muted-foreground opacity-40 uppercase tracking-[0.4em] mt-2">
                                {account.type === 'cash' ? t('accounts.cash') || 'Efectivo' :
                                    account.type === 'investment' ? t('accounts.investment') || 'Inversión' :
                                        t('accounts.debit_short') || 'Cta. Débito'}
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 mt-auto group/balance">
                        <p className="text-[10px] font-black text-muted-foreground opacity-30 uppercase tracking-[0.4em] mb-3 group-hover/balance:text-primary/40 transition-colors">{t('accounts.available_balance') || 'Saldo Disponible'}</p>
                        <p className={cn(
                            "text-3xl font-black tracking-tighter truncate drop-shadow-2xl transition-transform duration-500 group-hover/balance:translate-x-1",
                            balance < 0 ? 'text-rose-500' : 'text-foreground'
                        )}>
                            <PrivacyBlur intensity="lg">{formatCurrency(balance)}</PrivacyBlur>
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[6px] transition-all duration-700 group-hover:h-[8px]" style={{ background: account.color || '#10b981', opacity: 0.3 }} />
                
                {/* Decorative background circle */}
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-foreground/5 rounded-full blur-[60px] pointer-events-none" />
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-premium px-6 py-5 md:px-10 md:py-8 rounded-[2rem] border-border/30 group relative overflow-hidden transition-all duration-500">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg flex-shrink-0">
                        <CreditCard size={22} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
                            {t('accounts.title') || 'Mis Cuentas'}
                        </h2>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 mt-1">
                            {t('accounts.subtitle') || 'Gestiona tu liquidez y líneas de crédito'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0 relative z-10">
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
                    <div className="py-24 flex flex-col items-center justify-center glass-premium border-2 border-dashed border-border/30 rounded-[3rem] opacity-60 space-y-6 group hover:border-emerald-500/30 transition-all duration-700">
                        <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center shadow-black/50 shadow-2xl group-hover:scale-110 transition-transform">
                            <Wallet size={48} className="text-muted-foreground/40 group-hover:text-emerald-500/60 transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-xl tracking-tight text-foreground/80">{t('accounts.no_debit_accounts') || 'No hay cuentas registradas'}</p>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-12 mt-2">{t('accounts.no_debit_accounts_desc') || 'Agregas tus cuentas bancarias o efectivo para ver sus saldos.'}</p>
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
                    <div className="py-24 flex flex-col items-center justify-center glass-premium border-2 border-dashed border-border/30 rounded-[3rem] opacity-60 space-y-6 group hover:border-primary/30 transition-all duration-700">
                        <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center shadow-black/50 shadow-2xl group-hover:scale-110 transition-transform">
                            <CreditCard size={48} className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-xl tracking-tight text-foreground/80">{t('accounts.no_credit_cards') || 'Sin tarjetas registradas'}</p>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-12 mt-2">{t('accounts.no_credit_cards_desc') || 'Mantén el control de tus fechas de corte y límites utilizados.'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {creditCards.map(renderCardVisual)}
                    </div>
                )}
            </div>

            <Dialog open={!!editingAccount} onOpenChange={(val) => !val && setEditingAccount(null)}>
                <DialogContent className="max-w-md glass-premium border-border/30 p-0 overflow-hidden rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                    <div className="p-10 border-b border-border/30 bg-foreground/5 backdrop-blur-3xl relative overflow-hidden group">
                         {/* Background mystical glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                        
                        <DialogHeader className="relative z-10">
                            <DialogTitle className="text-3xl font-black tracking-tighter text-foreground drop-shadow-2xl">{t('accounts.edit_account') || 'Editar Cuenta'}</DialogTitle>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mt-2">{t('accounts.edit_desc') || 'Ajusta los detalles de tu cuenta financiera'}</p>
                        </DialogHeader>
                    </div>
                    <div className="p-10 bg-black/40 backdrop-blur-3xl">
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
