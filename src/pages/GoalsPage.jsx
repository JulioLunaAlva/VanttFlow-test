import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { useGamification } from "@/context/GamificationContext";
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
    const { completeMission, gainXp } = useGamification();
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
            completeMission('add_goal');
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
        <div className="space-y-6 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Compacto */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <Target size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">{t('goals.title')}</h2>
                        <p className="text-caption text-muted-foreground/50 mt-0.5">{t('goals.subtitle')}</p>
                    </div>
                </div>

                <div className="mt-4 sm:mt-0">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="w-full sm:w-auto gap-2">
                                <Plus size={16} /> 
                                {t('goals.new_goal')}
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
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {goals && goals.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0;
                    const isCompleted = progress >= 100;

                    return (
                        <div key={goal.id} className={cn(
                            "card-base relative overflow-hidden group",
                            isCompleted ? "ring-1 ring-yellow-500/50 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.15)]" : ""
                        )}>
                            <div className="p-6 pb-4 flex flex-row items-center justify-between space-y-0 relative z-10">
                                <div className="text-xl font-black tracking-tighter truncate flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl border",
                                        isCompleted ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20 shadow-glow" : "bg-primary/10 text-primary border-primary/20"
                                    )}>
                                        {isCompleted ? <Trophy size={26} /> : <Target size={26} />}
                                    </div>
                                    <span className="truncate text-foreground drop-shadow-lg">{goal.name}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground/30 hover:text-foreground hover:bg-foreground/5 rounded-xl" onClick={() => handleEdit(goal)}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground/30 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl" onClick={() => deleteGoal(goal.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 pt-0 relative z-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-2xl font-black tracking-tighter text-foreground">
                                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(goal.currentSaved)}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-black mt-1">
                                                {t('goals.target_label', { amount: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(goal.targetAmount) })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("text-2xl font-black tracking-tighter", isCompleted ? "text-yellow-500" : "text-primary")}>
                                                {progress.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Custom Progress Bar */}
                                    <div className="h-4 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30 p-0.5">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out rounded-full",
                                                isCompleted ? "bg-yellow-500" : "bg-primary"
                                            )}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            variant={isCompleted ? "default" : "outline"}
                                            className={cn(
                                                "w-full gap-2",
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
                    </div>
                    );
                })}

                {(!goals || goals.length === 0) && (
                    <div className="col-span-full py-20 card-base border-dashed text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-border/30 text-muted-foreground/20">
                            <Target size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tighter text-foreground">{t('goals.no_goals')}</p>
                            <p className="text-xs text-muted-foreground/60 font-medium px-4">{t('goals.no_goals_desc')}</p>
                        </div>
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4 gap-2">
                            <Plus size={16} /> {t('goals.create_first')}
                        </Button>
                    </div>
                )}
                </div>
        </div>
    );
};
