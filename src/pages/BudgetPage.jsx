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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0">
            {/* Header Summary */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl ring-1 ring-black/5 dark:ring-black/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-primary/20" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">{t('budget.total_budget')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalBudget)}</div>
                        <p className="text-[10px] font-medium text-primary/60 mt-1 uppercase tracking-wider">{t('budget.monthly_planning')}</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl ring-1 ring-black/5 dark:ring-black/20 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">{t('budget.accumulated_consumption')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-foreground">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalSpent)}</div>
                        <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                <span className="opacity-40">Progreso General</span>
                                <span className={cn(totalProgress > 90 ? "text-red-500" : "text-emerald-500")}>{totalProgress.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900/40 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={cn("h-full transition-all duration-1000 ease-out", totalProgress > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]")}
                                    style={{ width: `${Math.min(totalProgress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl ring-1 ring-black/5 dark:ring-black/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-emerald-500/20" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">{t('budget.available_capital')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-emerald-500">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Math.max(0, totalBudget - totalSpent))}</div>
                        <p className="text-[10px] font-medium text-emerald-500/60 mt-1 uppercase tracking-wider">{t('budget.operating_margin')}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('budget.category_detail')}</h2>
                <Button onClick={handleOpenCreate} disabled={unbudgetedCategories.length === 0}>
                    <Plus className="mr-2 h-4 w-4" /> {t('budget.set_budget')}
                </Button>
            </div>

            {/* Budgets Grid */}
            {budgetStatus.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/50">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">{t('budget.no_budgets')}</h3>
                    <p className="text-muted-foreground mb-4">{t('budget.no_budgets_desc')}</p>
                    <Button onClick={handleOpenCreate}>{t('budget.start_btn')}</Button>
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
