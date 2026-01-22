import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/FinanceContext";
import { Plus, Target, Trophy, Trash2, Edit2, Rocket, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoneyInput } from "@/components/ui/MoneyInput";
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";

export const GoalsPage = () => {
    const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Add Funds Local State
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [fundAmount, setFundAmount] = useState('');

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
        setIsAddFundsOpen(true);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Metas de Ahorro</h2>
                    <p className="text-muted-foreground">Visualiza tus sueños y alcánzalos paso a paso.</p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 border-0">
                            <Plus size={20} /> Nueva Meta
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingGoal ? 'Editar Meta' : 'Nueva Meta Financiera'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre de la Meta</label>
                                <Input
                                    placeholder="Ej. Viaje a Europa, Auto Nuevo..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Monto Objetivo</label>
                                <MoneyInput
                                    value={targetAmount}
                                    onChange={setTargetAmount}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ahorrado Actualmente (Opcional)</label>
                                <MoneyInput
                                    value={currentSaved}
                                    onChange={setCurrentSaved}
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4">Guardar Meta</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog para Agregar Fondos */}
                <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar Fondos: {selectedGoal?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddFunds} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Monto a agregar</label>
                                <MoneyInput
                                    value={fundAmount}
                                    onChange={setFundAmount}
                                    required
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">Registrar Ahorro</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals && goals.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0;
                    const isCompleted = progress >= 100;

                    return (
                        <Card key={goal.id} className={cn(
                            "relative overflow-hidden transition-all duration-300 hover:shadow-xl border-t-4",
                            isCompleted ? "border-t-yellow-400 bg-gradient-to-b from-yellow-500/10 to-transparent" : "border-t-primary"
                        )}>
                            {isCompleted && (
                                <div className="absolute top-0 right-0 p-2">
                                    <Star className="text-yellow-400 fill-yellow-400 animate-pulse" size={24} />
                                </div>
                            )}

                            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-xl font-bold truncate flex items-center gap-2">
                                    {isCompleted ? <Trophy className="text-yellow-500" size={24} /> : <Target className="text-primary" size={24} />}
                                    {goal.name}
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(goal)}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => deleteGoal(goal.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-bold tracking-tight">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(goal.currentSaved)}
                                            </p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                                                Meta: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(goal.targetAmount)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("text-2xl font-bold", isCompleted ? "text-yellow-600 dark:text-yellow-400" : "text-primary")}>
                                                {progress.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Custom Progress Bar */}
                                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out relative",
                                                isCompleted ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-blue-500 to-purple-600"
                                            )}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
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
                                                <span className="flex items-center gap-2"><Trophy size={16} /> ¡Meta Cumplida! (Agregar extra)</span>
                                            ) : (
                                                <span className="flex items-center gap-2"><Rocket size={16} /> Agregar Fondos</span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {(!goals || goals.length === 0) && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/5">
                        <div className="bg-primary/10 p-6 rounded-full mb-6 ring-8 ring-primary/5">
                            <Target className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Sin metas definidas</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Define un objetivo financiero, visualízalo y nosotros te ayudaremos a alcanzarlo.
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>Crear mi primera meta</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
