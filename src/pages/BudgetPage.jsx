<<<<<<< HEAD
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
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export const BudgetPage = () => {
    const {
        categories,
        getBudgetStatus,
        updateBudget,
        selectedMonth
    } = useFinance();

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
        if (!selectedCategoryId) return toast.error('Selecciona una categoría');
        if (!amount || Number(amount) <= 0) return toast.error('Ingresa un monto válido');

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
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Presupuesto Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">${totalBudget.toLocaleString()}</div>
                        <p className="text-[10px] font-medium text-primary/60 mt-1 uppercase tracking-wider">Planificación Mensual</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl ring-1 ring-black/5 dark:ring-black/20 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Consumo Acumulado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-foreground">${totalSpent.toLocaleString()}</div>
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
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Capital Disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-emerald-500">${Math.max(0, totalBudget - totalSpent).toLocaleString()}</div>
                        <p className="text-[10px] font-medium text-emerald-500/60 mt-1 uppercase tracking-wider">Margen Operativo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Detalle por Categoría</h2>
                <Button onClick={handleOpenCreate} disabled={unbudgetedCategories.length === 0}>
                    <Plus className="mr-2 h-4 w-4" /> Asignar Presupuesto
                </Button>
            </div>

            {/* Budgets Grid */}
            {budgetStatus.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/50">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No tienes presupuestos definidos</h3>
                    <p className="text-muted-foreground mb-4">Asigna límites a tus categorías para controlar tus gastos.</p>
                    <Button onClick={handleOpenCreate}>Comenzar</Button>
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
                        <DialogTitle>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</DialogTitle>
                        <DialogDescription>Define cuánto quieres gastar máximo en esta categoría.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            {editingBudget ? (
                                <div className="p-3 bg-muted rounded-md font-medium">
                                    {categories.find(c => c.id === editingBudget.categoryId)?.name}
                                </div>
                            ) : (
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="">Seleccionar categoría...</option>
                                    {unbudgetedCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Límite Mensual ($)</Label>
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
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar Límite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
=======
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
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export const BudgetPage = () => {
    const {
        categories,
        getBudgetStatus,
        updateBudget,
        selectedMonth
    } = useFinance();

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
        if (!selectedCategoryId) return toast.error('Selecciona una categoría');
        if (!amount || Number(amount) <= 0) return toast.error('Ingresa un monto válido');

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
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Presupuesto Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">${totalBudget.toLocaleString()}</div>
                        <p className="text-[10px] font-medium text-primary/60 mt-1 uppercase tracking-wider">Planificación Mensual</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-xl ring-1 ring-black/5 dark:ring-black/20 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Consumo Acumulado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-foreground">${totalSpent.toLocaleString()}</div>
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
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Capital Disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-emerald-500">${Math.max(0, totalBudget - totalSpent).toLocaleString()}</div>
                        <p className="text-[10px] font-medium text-emerald-500/60 mt-1 uppercase tracking-wider">Margen Operativo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Detalle por Categoría</h2>
                <Button onClick={handleOpenCreate} disabled={unbudgetedCategories.length === 0}>
                    <Plus className="mr-2 h-4 w-4" /> Asignar Presupuesto
                </Button>
            </div>

            {/* Budgets Grid */}
            {budgetStatus.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/50">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No tienes presupuestos definidos</h3>
                    <p className="text-muted-foreground mb-4">Asigna límites a tus categorías para controlar tus gastos.</p>
                    <Button onClick={handleOpenCreate}>Comenzar</Button>
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
                        <DialogTitle>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</DialogTitle>
                        <DialogDescription>Define cuánto quieres gastar máximo en esta categoría.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            {editingBudget ? (
                                <div className="p-3 bg-muted rounded-md font-medium">
                                    {categories.find(c => c.id === editingBudget.categoryId)?.name}
                                </div>
                            ) : (
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="">Seleccionar categoría...</option>
                                    {unbudgetedCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Límite Mensual ($)</Label>
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
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar Límite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
