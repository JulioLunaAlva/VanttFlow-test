import React, { useState } from 'react';
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
    const [frequency, setFrequency] = useState('monthly'); // monthly | one-time
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [specificDate, setSpecificDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
        <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('subscriptions.title')}</h2>
                    <p className="text-muted-foreground">{t('subscriptions.subtitle')}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus size={16} /> {t('subscriptions.new_subscription')}</Button>
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

                            <div className="flex gap-2 p-1 bg-muted rounded-lg hidden">
                                {/* Hidden for Subscriptions Page - assuming monthly mostly, but keeping logic */}
                                <Button type="button" variant="default" className="flex-1 h-8 text-xs">{t('subscriptions.monthly')}</Button>
                            </div>

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

            {/* Projection Card */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-primary text-primary-foreground md:col-span-2">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">{t('subscriptions.projected_monthly_fixed')}</p>
                            <h3 className="text-4xl font-bold mt-2">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(totalMonthlyFixed)}</h3>
                            <p className="text-white/60 text-xs mt-1">{t('subscriptions.monthly_ready_note')}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                            <RefreshCw size={32} className="opacity-90" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                        <span className="text-muted-foreground text-sm">{t('subscriptions.active_subscriptions')}</span>
                        <span className="text-3xl font-bold">{activeSubscriptions}</span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scheduledPayments.map(payment => {
                    const category = categories.find(c => c.id === payment.categoryId);
                    const account = accounts.find(c => c.id === payment.accountId);

                    return (
                        <Card key={payment.id} className={`relative group ${payment.status === 'paused' ? 'opacity-60 grayscale' : ''}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-muted">
                                        {/* Placeholder Check for Logo based on name? */}
                                        <Zap size={16} className="text-primary" />
                                    </div>
                                    <CardTitle className="text-sm font-medium truncate max-w-[120px]" title={payment.name}>
                                        {payment.name}
                                    </CardTitle>
                                </div>
                                <div className={`h-2 w-2 rounded-full ${payment.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">
                                    {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(payment.amount)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {t('accounts.day')} {payment.dayOfMonth} • {account?.name}
                                </p>

                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleScheduledStatus(payment.id)} title={payment.status === 'active' ? t('subscriptions.pause') : t('subscriptions.reactivate')}>
                                        <Power size={14} className={payment.status === 'active' ? "text-orange-500" : "text-green-500"} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                                        if (window.confirm(t('subscriptions.delete_confirm'))) deleteScheduledPayment(payment.id);
                                    }}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {scheduledPayments.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl opacity-40 space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                            <TrendingUp size={40} />
                        </div>
                        <div className="text-center max-w-sm">
                            <p className="text-xl font-bold">{t('subscriptions.no_subscriptions')}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {t('subscriptions.no_subscriptions_desc')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
