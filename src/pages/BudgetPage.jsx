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
import { useGamification } from "@/context/GamificationContext";

export const BudgetPage = () => {
    const { t, i18n } = useTranslation();
    const {
        categories,
        getBudgetStatus,
        updateBudget,
        selectedMonth
    } = useFinance();
    const { completeMission } = useGamification();
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
        completeMission('check_budget');
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6 pb-32 xl:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Compacto */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">{t('budget.title') || 'Mi Presupuesto'}</h2>
                        <p className="text-caption text-muted-foreground/50 mt-0.5">{t('budget.subtitle') || 'Planifica y controla tus gastos mensuales'}</p>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0">
                     <Button 
                        onClick={handleOpenCreate} 
                        disabled={unbudgetedCategories.length === 0} 
                        className="w-full sm:w-auto gap-2"
                    >
                        <Plus size={16} /> 
                        <span>{t('budget.set_budget')}</span>
                    </Button>
                </div>
            </div>

            {/* Header Summary */}
            <div className="grid gap-8 md:grid-cols-3">
                <div className="card-elevated p-10 rounded-3xl border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">{t('budget.total_budget')}</p>
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-glow transition-all duration-500 group-hover:scale-110">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-lg">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalBudget)}</div>
                        <div className="text-[11px] font-black text-primary/40 mt-6 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {t('budget.monthly_planning')}
                        </div>
                    </div>
                </div>

                <div className="card-elevated p-10 rounded-3xl border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className={cn(
                        "absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000",
                        totalProgress > 90 ? "bg-rose-500/5" : "bg-emerald-500/5"
                    )} />
                    <div className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">{t('budget.accumulated_consumption')}</p>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-lg">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalSpent)}</div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-muted-foreground">Progreso General</span>
                                <span className={cn(
                                    "p-1 px-3 rounded-full border shadow-glow",
                                    totalProgress > 90 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                )}>{totalProgress.toFixed(0)}%</span>
                            </div>
                            <div className="h-4 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30 p-1">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full",
                                        totalProgress > 90 ? "bg-gradient-to-r from-rose-600 to-rose-400" : "bg-gradient-to-r from-primary to-emerald-400 shadow-glow"
                                    )}
                                    style={{ width: `${Math.min(totalProgress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-elevated p-10 rounded-3xl border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">{t('budget.available_capital')}</p>
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-glow transition-all duration-500 group-hover:scale-110">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black tracking-tighter text-emerald-500 drop-shadow-lg">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Math.max(0, totalBudget - totalSpent))}</div>
                        <div className="text-[11px] font-black text-emerald-500/40 mt-6 uppercase tracking-[0.3em] flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                            {t('budget.operating_margin')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-6 pt-4">
                <h3 className="text-3xl font-black tracking-tighter text-foreground drop-shadow-lg">{t('budget.category_detail')}</h3>
            </div>

            {budgetStatus.length === 0 ? (
                <div className="col-span-full py-20 card-base border-dashed text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-border/30 text-muted-foreground/20">
                        <Wallet size={40} className="text-primary drop-shadow-lg" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tighter text-foreground">{t('budget.no_budgets')}</p>
                        <p className="text-xs text-muted-foreground/60 font-medium px-4">{t('budget.no_budgets_desc')}</p>
                    </div>
                    <Button onClick={handleOpenCreate} className="mt-4 gap-2">
                        <Plus size={16} /> {t('budget.start_btn')}
                    </Button>
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
