import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/FinanceContext";
import { Plus, Calendar, Power, Trash2, Zap, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useTranslation } from 'react-i18next';
import { useIdentity } from "@/context/IdentityContext";

export const SubscriptionsPage = () => {
    const { t, i18n } = useTranslation();
    const { scheduledPayments, addScheduledPayment, toggleScheduledStatus, deleteScheduledPayment, categories, accounts } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [frequency] = useState('monthly'); // monthly | one-time
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [specificDate, setSpecificDate] = useState('');
    const [endDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addScheduledPayment({
            name,
            amount: parseFloat(amount),
            type,
            categoryId,
            accountId,
            frequency,
            dayOfMonth: frequency === 'monthly' ? parseInt(dayOfMonth) : null,
            descDate: frequency === 'one-time' ? specificDate : null,
            endDate: (frequency === 'monthly' && endDate) ? endDate : null
        });
        setIsDialogOpen(false);
        // Reset form
        setName('');
        setAmount('');
        setCategoryId('');
        setSpecificDate('');
    };

    // Calculations for Projection
    const totalMonthlyFixed = scheduledPayments
        .filter(p => p.status === 'active' && p.frequency === 'monthly' && p.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const activeSubscriptions = scheduledPayments.filter(p => p.status === 'active').length;

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-0 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-premium p-10 rounded-[3rem] border-border/30 mb-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">{t('subscriptions.title')}</h2>
                    <div className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                        {t('subscriptions.subtitle')}
                    </div>
                </div>
                <div className="mt-6 md:mt-0 relative z-10">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="glass-premium border-border/50 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground shadow-2xl gap-3 rounded-2xl h-14 font-black px-10 group transition-all duration-500 hover:scale-105 active:scale-95">
                                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500 text-primary shadow-glow" /> 
                                <span className="tracking-tight">{t('subscriptions.new_subscription')}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('subscriptions.new_subscription_dialog')}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button type="button" variant={type === 'income' ? 'default' : 'outline'} onClick={() => setType('income')}>{t('subscriptions.recurring_income')}</Button>
                                    <Button type="button" variant={type === 'expense' ? 'destructive' : 'outline'} onClick={() => setType('expense')}>{t('subscriptions.fixed_expense')}</Button>
                                </div>

                                <Input placeholder={t('subscriptions.name_placeholder')} value={name} onChange={e => setName(e.target.value)} required />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="number" placeholder={t('subscriptions.monthly_amount')} value={amount} onChange={e => setAmount(e.target.value)} required />
                                    <div className="flex items-center gap-2 border rounded px-3">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">{t('subscriptions.charge_day')}</span>
                                        <Input type="number" min="1" max="31" value={dayOfMonth} onChange={e => setDayOfMonth(e.target.value)} className="border-0 focus-visible:ring-0 px-0" required />
                                    </div>
                                </div>

                                <CategorySelect
                                    categories={categories.filter(c => c.type === type || c.type === 'both')}
                                    value={categoryId}
                                    onChange={setCategoryId}
                                    placeholder={t('subscriptions.category_placeholder')}
                                />

                                <AccountSelect
                                    accounts={accounts}
                                    value={accountId}
                                    onChange={setAccountId}
                                    placeholder={t('subscriptions.account_placeholder')}
                                />

                                <Button type="submit" className="w-full">{t('subscriptions.save_btn')}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="glass-premium md:col-span-2 rounded-[3.5rem] border-border/30 overflow-hidden group active:scale-98 transition-all duration-500 relative bg-primary/5">
                    <div className="p-12 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                        <div>
                            <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow" />
                                {t('subscriptions.projected_monthly_fixed')}
                            </p>
                            <h3 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">
                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(totalMonthlyFixed)}
                            </h3>
                            <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[0.3em] mt-6 flex items-center gap-2">
                                <AlertCircle size={14} className="text-primary/40" />
                                {t('subscriptions.monthly_ready_note')}
                            </p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] glass-premium border-border/30 shadow-3xl group-hover:scale-110 transition-transform duration-1000 group-hover:bg-primary/10">
                            <RefreshCw size={50} className="text-primary animate-spin-slow drop-shadow-glow" />
                        </div>
                    </div>
                    
                    <div className="absolute top-[-40%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                </div>

                <div className="glass-premium rounded-[3.5rem] border-border/30 flex flex-col items-center justify-center p-10 text-center group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className="w-20 h-20 rounded-[2rem] glass-premium border-border/30 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                        <Zap size={36} className="text-primary drop-shadow-glow" />
                    </div>
                    <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.4em] mb-2">{t('subscriptions.active_subscriptions')}</span>
                    <span className="text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">{activeSubscriptions}</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scheduledPayments.map(payment => {
                    const account = accounts.find(c => c.id === payment.accountId);

                    return (
                        <div key={payment.id} className={cn(
                            "glass-premium rounded-[2.5rem] border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden",
                            payment.status === 'paused' && "opacity-40 grayscale"
                        )}>
                            <div className="p-8 border-b border-border/30 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl glass-premium border-border/30 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 bg-primary/5">
                                        <Zap size={24} className="text-primary drop-shadow-glow" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xl font-black tracking-tighter text-foreground truncate drop-shadow-sm" title={payment.name}>
                                            {payment.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                            <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em]">Recurring</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-glow transition-colors duration-500",
                                    payment.status === 'active' 
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                        : "bg-foreground/5 text-foreground/20 border-border/30"
                                )}>
                                    {payment.status === 'active' ? 'Active' : 'Paused'}
                                </div>
                            </div>
                            <div className="p-8 relative z-10">
                                <div className="text-2xl md:text-3xl font-black tracking-tighter text-foreground mb-6 drop-shadow-2xl">
                                    {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(payment.amount)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-foreground/20" />
                                            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                                                {t('accounts.day')} {payment.dayOfMonth}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary/20" />
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] truncate max-w-[150px]">
                                                {account?.name || 'No Account'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 glass-premium bg-foreground/5 hover:bg-foreground/10 rounded-2xl"
                                            onClick={() => toggleScheduledStatus(payment.id)}
                                        >
                                            <Power size={18} className={payment.status === 'active' ? "text-orange-500" : "text-emerald-500"} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 glass-premium bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl"
                                            onClick={() => {
                                                if (window.confirm(t('subscriptions.delete_confirm'))) deleteScheduledPayment(payment.id);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {scheduledPayments.length === 0 && (
                    <div className="col-span-full py-32 glass-premium rounded-[4rem] border-2 border-dashed border-border/30 mt-4 flex flex-col items-center justify-center group overflow-hidden relative">
                        <TrendingUp className="mx-auto h-20 w-20 text-primary drop-shadow-glow mb-10" />
                        <div className="text-center max-w-sm relative z-10 px-6">
                            <h3 className="text-2xl font-black tracking-tighter text-foreground mb-4 drop-shadow-2xl">{t('subscriptions.no_subscriptions')}</h3>
                            <p className="text-foreground/40 font-black uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                                {t('subscriptions.no_subscriptions_desc')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
