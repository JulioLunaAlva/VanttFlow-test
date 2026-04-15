import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { Plus, Target, Trophy, Trash2, Edit2, Rocket, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoneyInput } from "@/components/ui/MoneyInput";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { AccountSelect } from "@/components/ui/AccountSelect";
import { toLocalDateStr } from '@/lib/utils';

export const GoalsPage = () => {
    const { t, i18n } = useTranslation();
    const { goals, addGoal, updateGoal, deleteGoal, accounts, addTransaction } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Add Funds Local State
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [fundAmount, setFundAmount] = useState('');
    const [fundAccountId, setFundAccountId] = useState('');

    // Create/Edit Goal Form State
    const [editingGoal, setEditingGoal] = useState(null);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentSaved, setCurrentSaved] = useState('');

    const triggerCelebration = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const goalData = {
            name,
            targetAmount: parseFloat(targetAmount) || 0,
            currentSaved: parseFloat(currentSaved) || 0
        };

        if (editingGoal) {
            updateGoal(editingGoal.id, { ...editingGoal, ...goalData });
        } else {
            addGoal(goalData);
        }

        setIsCreateDialogOpen(false);
        setEditingGoal(null);
        setName('');
        setTargetAmount('');
        setCurrentSaved('');
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setName(goal.name);
        setTargetAmount(goal.targetAmount);
        setCurrentSaved(goal.currentSaved);
        setIsCreateDialogOpen(true);
    };

    const handleAddFunds = (e) => {
        e.preventDefault();
        if (!selectedGoal || !fundAmount) return;

        const added = parseFloat(fundAmount);
        const newTotal = selectedGoal.currentSaved + added;

        updateGoal(selectedGoal.id, {
            ...selectedGoal,
            currentSaved: newTotal
        });

        // Add transaction to reflect in account balance
        addTransaction({
            amount: added,
            description: `${t('goals.saving_for')}: ${selectedGoal.name}`,
            type: 'expense',
            category: 'savings',
            accountId: fundAccountId || (accounts[0]?.id),
            date: toLocalDateStr()
        });

        // Check for completion celebration
        if (newTotal >= selectedGoal.targetAmount && selectedGoal.currentSaved < selectedGoal.targetAmount) {
            triggerCelebration();
        }

        setIsAddFundsOpen(false);
        setFundAmount('');
        setSelectedGoal(null);
    };

    const openAddFunds = (goal) => {
        setSelectedGoal(goal);
        setFundAmount('');
        if (accounts.length > 0) setFundAccountId(accounts[0].id);
        setIsAddFundsOpen(true);
    };

    return (
        <div className="space-y-8 pb-24 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-card p-6 border-white/10 mb-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground">
                        {t('goals.title')}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">
                        {t('goals.subtitle')}
                    </p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-2xl gap-2 rounded-2xl h-12 font-black px-8 group transition-all duration-500 scale-100 hover:scale-105 active:scale-95 shadow-primary/20">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> {t('goals.new_goal')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingGoal ? t('goals.edit_goal') : t('goals.new_goal_title')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('goals.goal_name')}</label>
                                <Input
                                    placeholder={t('goals.goal_placeholder')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('goals.target_amount')}</label>
                                <MoneyInput
                                    value={targetAmount}
                                    onChange={setTargetAmount}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('goals.current_saved')}</label>
                                <MoneyInput
                                    value={currentSaved}
                                    onChange={setCurrentSaved}
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4">{t('goals.save_goal')}</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog para Agregar Fondos */}
                <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('goals.add_funds')}: {selectedGoal?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddFunds} className="space-y-4 pt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('goals.account_source') || 'Cuenta de origen'}</label>
                                    <AccountSelect
                                        accounts={accounts}
                                        value={fundAccountId}
                                        onChange={setFundAccountId}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('goals.add_funds_amount')}</label>
                                    <MoneyInput
                                        value={fundAmount}
                                        onChange={setFundAmount}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">{t('goals.register_saving')}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals && goals.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0;
                    const isCompleted = progress >= 100;

                    return (
                        <div key={goal.id} className={cn(
                            "glass-card card-glow relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-white/10",
                            isCompleted ? "bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent border-yellow-500/30" : ""
                        )}>
                            {isCompleted && (
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                            )}

                            <div className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                                <div className="text-xl font-black tracking-tighter truncate flex items-center gap-3">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10",
                                        isCompleted ? "bg-yellow-500/20 text-yellow-500" : "bg-primary/10 text-primary"
                                    )}>
                                        {isCompleted ? <Trophy size={24} /> : <Target size={24} />}
                                    </div>
                                    <span className="truncate">{goal.name}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-white/5 rounded-xl" onClick={() => handleEdit(goal)}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl" onClick={() => deleteGoal(goal.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 pt-4">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-bold tracking-tight">
                                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(goal.currentSaved)}
                                            </p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                                                {t('goals.target_label', { amount: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(goal.targetAmount) })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("text-2xl font-bold", isCompleted ? "text-yellow-600 dark:text-yellow-400" : "text-primary")}>
                                                {progress.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Custom Progress Bar */}
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out relative rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]",
                                                isCompleted ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-gradient-to-r from-primary to-blue-400"
                                            )}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            className={cn(
                                                "w-full font-semibold shadow-md transition-transform active:scale-95",
                                                isCompleted ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""
                                            )}
                                            onClick={() => openAddFunds(goal)}
                                        >
                                            {isCompleted ? (
                                                <span className="flex items-center gap-2"><Trophy size={16} /> {t('goals.goal_achieved')}</span>
                                            ) : (
                                                <span className="flex items-center gap-2"><Rocket size={16} /> {t('goals.add_funds')}</span>
                                            )}
                                        </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {(!goals || goals.length === 0) && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center glass-card border-dashed border-white/10">
                            <div className="glass-premium p-8 rounded-[2rem] mb-6 shadow-2xl border-white/10 animate-bounce-slow">
                                <Target className="w-16 h-16 text-primary drop-shadow-lg" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter mb-2">{t('goals.no_goals')}</h3>
                            <p className="text-muted-foreground max-w-sm mb-8 font-medium">
                                {t('goals.no_goals_desc')}
                            </p>
                            <Button size="lg" className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20" onClick={() => setIsCreateDialogOpen(true)}>{t('goals.create_first')}</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
