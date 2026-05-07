import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { Plus, Calendar, Power, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useTranslation } from 'react-i18next';
import { useIdentity } from "@/context/IdentityContext";
import { Label } from "@/components/ui/label";

export const ScheduledPage = () => {
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
    const [frequency, setFrequency] = useState('monthly'); // monthly | one-time
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [specificDate, setSpecificDate] = useState('');
    const [endDate, setEndDate] = useState(''); // Optional end date for monthly

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

    return (
        <div className="space-y-10 pb-32 md:pb-8 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-premium p-10 rounded-[3rem] border-border/30 mb-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">
                        {t('scheduled.title')}
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                        {t('scheduled.subtitle') || 'Automatización De Pagos Recurrentes'}
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-6 md:mt-0 glass-premium border-border/50 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground shadow-2xl gap-3 rounded-2xl h-14 font-black px-10 hover:scale-105 active:scale-95 transition-all duration-500 relative z-10">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> 
                            {t('scheduled.new_recurrent')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-premium border-border/30 max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tighter">{t('scheduled.new_payment_dialog')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4 p-1 bg-foreground/5 rounded-2xl border border-border/30">
                                <Button type="button" variant="ghost" className={cn("rounded-xl font-black tracking-tighter transition-all", type === 'income' ? "bg-emerald-500 text-foreground shadow-lg" : "hover:bg-foreground/5")} onClick={() => setType('income')}>{t('scheduled.income')}</Button>
                                <Button type="button" variant="ghost" className={cn("rounded-xl font-black tracking-tighter transition-all", type === 'expense' ? "bg-rose-500 text-foreground shadow-lg" : "hover:bg-foreground/5")} onClick={() => setType('expense')}>{t('scheduled.expense')}</Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Concepto</Label>
                                <Input placeholder={t('subscriptions.name_placeholder')} value={name} onChange={e => setName(e.target.value)} required className="h-12 rounded-2xl border-border/30 bg-foreground/5 px-4 font-bold" />
                            </div>

                            <div className="flex gap-2 p-1 bg-foreground/5 border border-border/30 rounded-2xl">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className={cn("flex-1 h-10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all", frequency === 'monthly' ? "bg-primary text-foreground" : "text-muted-foreground")}
                                    onClick={() => setFrequency('monthly')}
                                >
                                    {t('scheduled.monthly_recurrent')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className={cn("flex-1 h-10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all", frequency === 'one-time' ? "bg-primary text-foreground" : "text-muted-foreground")}
                                    onClick={() => setFrequency('one-time')}
                                >
                                    {t('scheduled.one_time')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">{t('scheduled.amount_label')}</Label>
                                    <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="h-12 rounded-2xl border-border/30 bg-foreground/5 px-4 font-black text-xl" />
                                </div>
                                {frequency === 'monthly' ? (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">{t('scheduled.day_of_month')}</Label>
                                        <div className="flex items-center gap-2 h-12 rounded-2xl border border-border/30 bg-foreground/5 px-4">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <Input type="number" min="1" max="31" value={dayOfMonth} onChange={e => setDayOfMonth(e.target.value)} className="border-0 focus-visible:ring-0 px-0 font-black text-lg bg-transparent" required />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">{t('scheduled.date')}</Label>
                                        <DatePicker value={specificDate} onChange={e => setSpecificDate(e.target.value)} required className="h-12 rounded-2xl border-border/30 bg-foreground/5" />
                                    </div>
                                )}
                            </div>

                            {frequency === 'monthly' && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">{t('scheduled.end_date_label')}</Label>
                                    <DatePicker value={endDate} onChange={e => setEndDate(e.target.value)} className="h-12 rounded-2xl border-border/30 bg-foreground/5" />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Categoría</Label>
                                    <CategorySelect
                                        categories={categories.filter(c => c.type === type || c.type === 'both')}
                                        value={categoryId}
                                        onChange={setCategoryId}
                                        placeholder={t('scheduled.category_placeholder')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Cuenta</Label>
                                    <AccountSelect
                                        accounts={accounts}
                                        value={accountId}
                                        onChange={setAccountId}
                                        placeholder={t('scheduled.account_placeholder')}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                                {t('scheduled.save_btn')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scheduledPayments.map(payment => {
                    const category = categories.find(c => c.id === payment.categoryId);
                    const account = accounts.find(c => c.id === payment.accountId);

                    return (
                        <div key={payment.id} className={cn(
                            "glass-card card-glow border-border/30 overflow-hidden group transition-all duration-500 hover:-translate-y-2",
                            payment.status === 'paused' && "opacity-60 grayscale scale-95"
                        )}>
                            <div className="p-6 border-b border-border/30">
                                <div className="flex items-center justify-between mb-4">
                                    <span style={{ color: category?.color }} className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-foreground/5 rounded-full border border-border/30">
                                        {category?.name}
                                    </span>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        payment.status === 'active' ? (payment.type === 'income' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]") : "bg-muted"
                                    )} />
                                </div>
                                <h3 className="text-xl font-black tracking-tighter text-foreground mb-1 group-hover:translate-x-1 transition-transform duration-500">{payment.name}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">
                                    <Calendar size={12} className="text-primary" />
                                    {payment.frequency === 'monthly'
                                        ? t('scheduled.day_of_month_short', { day: payment.dayOfMonth })
                                        : t('scheduled.date_label', { date: payment.descDate })}
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className={cn(
                                    "text-3xl font-black tracking-tight",
                                    payment.type === 'income' ? "text-emerald-400" : "text-foreground"
                                )}>
                                    {payment.type === 'income' ? '+' : '-'} {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(payment.amount)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/5 border border-border/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 truncate max-w-[100px]">{account?.name}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/30 transition-all" onClick={() => toggleScheduledStatus(payment.id)}>
                                            <Power size={18} className={payment.status === 'active' ? "text-orange-500" : "text-emerald-500"} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-rose-500/20 border border-border/30 group/del" onClick={() => {
                                            if (window.confirm(t('scheduled.delete_confirm'))) deleteScheduledPayment(payment.id);
                                        }}>
                                            <Trash2 size={18} className="text-muted-foreground group-hover/del:text-rose-500 transition-colors" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {scheduledPayments.length === 0 && (
                    <div className="col-span-full py-20 glass-card border-dashed border-border/30 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-border/30 text-muted-foreground/20">
                            <Calendar size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tighter text-foreground">{t('scheduled.no_scheduled')}</p>
                            <p className="text-xs text-muted-foreground/60 font-medium px-4">{t('scheduled.no_scheduled_desc')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
