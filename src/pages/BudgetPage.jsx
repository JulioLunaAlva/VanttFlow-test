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
        <div className="space-y-8 pb-24 md:pb-8 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-premium p-10 rounded-[3rem] border-border/30 mb-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">
                        {t('budget.title') || 'Mi Presupuesto'}
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                        {t('budget.subtitle') || 'Planifica y controla tus gastos mensuales'}
                    </p>
                </div>
                <div className="mt-6 md:mt-0 relative z-10">
                     <Button 
                        onClick={handleOpenCreate} 
                        disabled={unbudgetedCategories.length === 0} 
                        className="glass-premium border-border/50 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground shadow-2xl gap-3 rounded-2xl h-14 font-black px-10 group transition-all duration-500 hover:scale-105 active:scale-95"
                    >
                        <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500 text-primary shadow-glow" /> 
                        <span className="tracking-tight">{t('budget.set_budget')}</span>
                    </Button>
                </div>
            </div>

            {/* Header Summary */}
            <div className="grid gap-8 md:grid-cols-3">
                <div className="glass-premium p-10 rounded-[3rem] border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">{t('budget.total_budget')}</p>
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-glow transition-all duration-500 group-hover:scale-110">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalBudget)}</div>
                        <p className="text-[11px] font-black text-primary/40 mt-6 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {t('budget.monthly_planning')}
                        </p>
                    </div>
                </div>

                <div className="glass-premium p-10 rounded-[3rem] border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className={cn(
                        "absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000",
                        totalProgress > 90 ? "bg-rose-500/5" : "bg-emerald-500/5"
                    )} />
                    <div className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">{t('budget.accumulated_consumption')}</p>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalSpent)}</div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-foreground/20">Progreso General</span>
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

                <div className="glass-premium p-10 rounded-[3rem] border-border/30 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">{t('budget.available_capital')}</p>
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-glow transition-all duration-500 group-hover:scale-110">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-5xl font-black tracking-tighter text-emerald-500 drop-shadow-2xl">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Math.max(0, totalBudget - totalSpent))}</div>
                        <p className="text-[11px] font-black text-emerald-500/40 mt-6 uppercase tracking-[0.3em] flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                            {t('budget.operating_margin')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-6 pt-4">
                <h3 className="text-3xl font-black tracking-tighter text-foreground drop-shadow-lg">{t('budget.category_detail')}</h3>
            </div>

            {budgetStatus.length === 0 ? (
                <div className="text-center py-32 glass-premium rounded-[4rem] border-2 border-dashed border-border/30 mt-4 active:scale-98 transition-all duration-500">
                    <div className="glass-premium p-10 rounded-[2.5rem] mb-10 shadow-2xl border-border/30 animate-bounce-slow inline-block bg-primary/5">
                        <Wallet className="mx-auto h-20 w-20 text-primary drop-shadow-glow" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-foreground mb-4 drop-shadow-2xl">{t('budget.no_budgets')}</h3>
                    <p className="text-foreground/40 max-w-sm mx-auto mb-12 font-black uppercase tracking-[0.2em] text-[10px]">{t('budget.no_budgets_desc')}</p>
                    <Button onClick={handleOpenCreate} size="lg" className="glass-premium bg-primary text-foreground rounded-[2rem] h-16 px-12 font-black shadow-2xl shadow-primary/40 hover:scale-110 transition-all duration-500">{t('budget.start_btn')}</Button>
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
