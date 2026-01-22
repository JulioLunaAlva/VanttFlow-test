import React, { useState } from 'react';
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{t('scheduled.title')}</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus size={16} /> {t('scheduled.new_recurrent')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('scheduled.new_payment_dialog')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button type="button" variant={type === 'income' ? 'default' : 'outline'} onClick={() => setType('income')}>{t('scheduled.income')}</Button>
                                <Button type="button" variant={type === 'expense' ? 'destructive' : 'outline'} onClick={() => setType('expense')}>{t('scheduled.expense')}</Button>
                            </div>

                            <Input placeholder={t('subscriptions.name_placeholder')} value={name} onChange={e => setName(e.target.value)} required />

                            <div className="flex gap-2 p-1 bg-muted rounded-lg">
                                <Button
                                    type="button"
                                    variant={frequency === 'monthly' ? 'default' : 'ghost'}
                                    className="flex-1 h-8 text-xs"
                                    onClick={() => setFrequency('monthly')}
                                >
                                    {t('scheduled.monthly_recurrent')}
                                </Button>
                                <Button
                                    type="button"
                                    variant={frequency === 'one-time' ? 'default' : 'ghost'}
                                    className="flex-1 h-8 text-xs"
                                    onClick={() => setFrequency('one-time')}
                                >
                                    {t('scheduled.one_time')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input type="number" placeholder={t('scheduled.amount_label')} value={amount} onChange={e => setAmount(e.target.value)} required />
                                {frequency === 'monthly' ? (
                                    <>
                                        <div className="flex items-center gap-2 border rounded px-3">
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">{t('scheduled.day_of_month')}</span>
                                            <Input type="number" min="1" max="31" value={dayOfMonth} onChange={e => setDayOfMonth(e.target.value)} className="border-0 focus-visible:ring-0 px-0" required />
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-muted-foreground mb-1">{t('scheduled.end_date_label')}</p>
                                            <DatePicker value={endDate} onChange={e => setEndDate(e.target.value)} />
                                        </div>
                                    </>
                                ) : (
                                    <DatePicker value={specificDate} onChange={e => setSpecificDate(e.target.value)} required />
                                )}
                            </div>

                            <CategorySelect
                                categories={categories.filter(c => c.type === type || c.type === 'both')}
                                value={categoryId}
                                onChange={setCategoryId}
                                placeholder={t('scheduled.category_placeholder')}
                            />

                            <AccountSelect
                                accounts={accounts}
                                value={accountId}
                                onChange={setAccountId}
                                placeholder={t('scheduled.account_placeholder')}
                            />

                            <Button type="submit" className="w-full">{t('scheduled.save_btn')}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scheduledPayments.map(payment => {
                    const category = categories.find(c => c.id === payment.categoryId);
                    const account = accounts.find(c => c.id === payment.accountId);

                    return (
                        <Card key={payment.id} className={`relative ${payment.status === 'paused' ? 'opacity-60 grayscale' : ''}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {payment.name}
                                </CardTitle>
                                <div className={`h-2 w-2 rounded-full ${payment.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(payment.amount)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {payment.frequency === 'monthly'
                                        ? t('scheduled.day_of_month_short', { day: payment.dayOfMonth })
                                        : t('scheduled.date_label', { date: payment.descDate })} • {payment.type === 'income' ? t('scheduled.income') : t('scheduled.expense')}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                    <span style={{ color: category?.color }}>{category?.name}</span>
                                    <span>{account?.name}</span>
                                </div>

                                <div className="mt-4 flex gap-2 justify-end border-t pt-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleScheduledStatus(payment.id)} title={payment.status === 'active' ? t('subscriptions.pause') : t('subscriptions.reactivate')}>
                                        <Power size={14} className={payment.status === 'active' ? "text-orange-500" : "text-green-500"} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                                        if (window.confirm(t('scheduled.delete_confirm'))) deleteScheduledPayment(payment.id);
                                    }}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {scheduledPayments.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Calendar className="mx-auto h-12 w-12 opacity-50 mb-2" />
                        <p>{t('scheduled.no_scheduled')}</p>
                        <p className="text-sm">{t('scheduled.no_scheduled_desc')}</p>
                    </div>
                )}
            </div>
        </div >
    );
};
