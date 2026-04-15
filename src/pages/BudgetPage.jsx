import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Wallet, AlertCircle } from 'lucide-react';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useIdentity } from "@/context/IdentityContext";

export const BudgetPage = () => {
    const { t, i18n } = useTranslation();
    const {
        categories,
        getBudgetStatus,
        updateBudget,
        selectedMonth
    } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [amount, setAmount] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    const budgetStatus = getBudgetStatus();

    // Calculate Totals
    const totalBudget = budgetStatus.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSpent = budgetStatus.reduce((acc, curr) => acc + curr.spent, 0);
    const totalProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Filter categories that don't have a budget yet
    const unbudgetedCategories = categories.filter(c =>
        c.type === 'expense' && !budgetStatus.find(b => b.categoryId === c.id)
    );

    const handleOpenCreate = () => {
        setEditingBudget(null);
        setSelectedCategoryId('');
        setAmount('');
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (budget) => {
        setEditingBudget(budget);
        setSelectedCategoryId(budget.categoryId);
        setAmount(budget.amount.toString());
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!selectedCategoryId) return toast.error(t('budget.error_select_category'));
        if (!amount || Number(amount) <= 0) return toast.error(t('budget.error_invalid_amount'));

        updateBudget(selectedCategoryId, Number(amount));
        setIsDialogOpen(false);
    };

    return (
    return (
        <div className="space-y-8 pb-24 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-card p-6 border-white/10 mb-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground">
                        {t('budget.title') || 'Mi Presupuesto'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">
                        {t('budget.subtitle') || 'Planifica y controla tus gastos mensuales'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                     <Button onClick={handleOpenCreate} disabled={unbudgetedCategories.length === 0} className="shadow-2xl gap-2 rounded-2xl h-12 font-black px-8 group transition-all duration-500 scale-100 hover:scale-105 active:scale-95 shadow-primary/20">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> {t('budget.set_budget')}
                    </Button>
                </div>
            </div>

            {/* Header Summary */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="glass-card card-glow p-6 group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('budget.total_budget')}</p>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                            <Wallet className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black tracking-tighter">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalBudget)}</div>
                        <p className="text-[9px] font-black text-muted-foreground/50 mt-1 uppercase tracking-widest leading-none">{t('budget.monthly_planning')}</p>
                    </div>
                </div>

                <div className="glass-card card-glow p-6 group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('budget.accumulated_consumption')}</p>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black tracking-tighter text-foreground">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalSpent)}</div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest pr-1">
                                <span className="text-muted-foreground/40">Progreso General</span>
                                <span className={cn(totalProgress > 90 ? "text-red-500" : "text-emerald-500")}>{totalProgress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <div
                                    className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.2)]", totalProgress > 90 ? "bg-red-500" : "bg-primary")}
                                    style={{ width: `${Math.min(totalProgress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card card-glow p-6 group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('budget.available_capital')}</p>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20">
                            <AlertCircle className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black tracking-tighter text-emerald-500">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Math.max(0, totalBudget - totalSpent))}</div>
                        <p className="text-[9px] font-black text-emerald-500/40 mt-1 uppercase tracking-widest leading-none">{t('budget.operating_margin')}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-black tracking-tighter">{t('budget.category_detail')}</h3>
            </div>

            {budgetStatus.length === 0 ? (
                <div className="text-center py-20 glass-card border-dashed border-white/10">
                    <div className="glass-premium p-8 rounded-[2rem] mb-6 shadow-2xl border-white/10 animate-bounce-slow">
                        <Wallet className="mx-auto h-16 w-16 text-primary drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter mb-2">{t('budget.no_budgets')}</h3>
                    <p className="text-muted-foreground max-w-sm mb-8 font-medium">{t('budget.no_budgets_desc')}</p>
                    <Button onClick={handleOpenCreate} size="lg" className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20">{t('budget.start_btn')}</Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {budgetStatus.map(budget => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            category={categories.find(c => c.id === budget.categoryId)}
                            onEdit={handleOpenEdit}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingBudget ? t('budget.edit_budget') : t('budget.new_budget')}</DialogTitle>
                        <DialogDescription>{t('budget.dialog_desc')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('budget.category_label')}</Label>
                            {editingBudget ? (
                                <div className="p-3 bg-muted rounded-md font-medium">
                                    {categories.find(c => c.id === editingBudget.categoryId)?.name}
                                </div>
                            ) : (
                                <CategorySelect
                                    categories={unbudgetedCategories}
                                    value={selectedCategoryId}
                                    onChange={setSelectedCategoryId}
                                    placeholder={t('budget.select_category')}
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('budget.monthly_limit')} ({new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(0).replace(/\d|[,.]/g, '').trim()})</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                        <Button onClick={handleSave}>{t('budget.save_limit')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
