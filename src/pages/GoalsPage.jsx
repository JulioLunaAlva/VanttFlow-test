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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-premium px-6 py-5 md:px-10 md:py-8 rounded-[2rem] border-border/30 group relative overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Target size={22} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
                            {t('goals.title')}
                        </h2>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 mt-1 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {t('goals.subtitle')}
                        </p>
                    </div>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="glass-premium border-border/50 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground shadow-2xl gap-3 rounded-2xl h-14 font-black px-10 hover:scale-105 active:scale-95 transition-all duration-500 mt-6 md:mt-0 relative z-10">
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

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {goals && goals.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0;
                    const isCompleted = progress >= 100;

                    return (
                        <div key={goal.id} className={cn(
                            "glass-premium rounded-[3rem] relative overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] border-border/30 group",
                            isCompleted ? "bg-yellow-500/5 border-yellow-500/20" : ""
                        )}>
                            {isCompleted && (
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            <div className="p-8 pb-4 flex flex-row items-center justify-between space-y-0 relative z-10">
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
                            <div className="p-8 pt-4 relative z-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-black tracking-tighter text-foreground drop-shadow-lg">
                                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(goal.currentSaved)}
                                            </p>
                                            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-black mt-2">
                                                {t('goals.target_label', { amount: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(goal.targetAmount) })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("text-3xl font-black tracking-tighter", isCompleted ? "text-yellow-500 drop-shadow-glow" : "text-primary")}>
                                                {progress.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Custom Progress Bar */}
                                    <div className="h-4 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30 p-[3px]">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out relative rounded-full",
                                                isCompleted ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-glow" : "bg-gradient-to-r from-primary to-blue-400 shadow-glow"
                                            )}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-foreground/20 animate-pulse rounded-full" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            className={cn(
                                                "w-full font-black shadow-xl transition-all active:scale-95 rounded-2xl h-14 text-[10px] uppercase tracking-[0.2em]",
                                                isCompleted ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-glow" : "glass-premium border-border/50 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground"
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
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center glass-premium border-dashed border-2 border-border/30 rounded-[3rem] group overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="glass-premium p-10 rounded-[2.5rem] mb-8 shadow-2xl border-border/30 animate-bounce-slow inline-block bg-primary/5 relative z-10">
                                <Target className="w-16 h-16 text-primary drop-shadow-glow" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black tracking-tighter text-foreground/40 mb-3 drop-shadow-2xl">{t('goals.no_goals')}</h3>
                                <p className="text-foreground/20 max-w-sm mb-8 font-black text-[10px] uppercase tracking-[0.2em]">
                                    {t('goals.no_goals_desc')}
                                </p>
                                <Button size="lg" className="glass-premium border-border/50 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground rounded-2xl h-14 px-10 font-black shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500" onClick={() => setIsCreateDialogOpen(true)}>{t('goals.create_first')}</Button>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
};
