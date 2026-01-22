import React, { useState } from 'react';
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Calendar, TrendingUp, AlertCircle, Wallet, Edit2, Key } from 'lucide-react';
import { AccountManager } from "@/components/accounts/AccountManager";
import { AccountForm } from "@/components/accounts/AccountForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CreditCardsPage = () => {
    const { accounts, getCreditCardStatus, updateAccount } = useFinance();
    const [editingAccount, setEditingAccount] = useState(null);

    const creditCards = accounts.filter(a => a.type === 'credit');
    const debitAccounts = accounts.filter(a => a.type !== 'credit');

    const handleUpdate = (data) => {
        if (editingAccount) {
            updateAccount(editingAccount.id, data);
            setEditingAccount(null);
        }
    };

    const renderCardVisual = (account) => {
        const status = getCreditCardStatus(account.id);
        const { currentDebt, availableCredit, nextPaymentDate, utilization } = status || {
            currentDebt: 0, availableCredit: 0, nextPaymentDate: null, utilization: 0
        };

        return (
            <Card key={account.id} className="overflow-hidden hover:shadow-lg transition-all group relative">
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={14} />
                    </Button>
                </div>

                <div
                    className="h-32 p-6 text-white flex flex-col justify-between relative"
                    style={{
                        background: `linear-gradient(135deg, ${account.color || '#000'} 0%, #000000 100%)`,
                    }}
                >
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="opacity-80 text-xs uppercase tracking-wider">Tarjeta de Crédito</p>
                            <h3 className="font-bold text-lg truncate pr-8">{account.name}</h3>
                        </div>
                        <CreditCard className="opacity-80" />
                    </div>
                    <div className="z-10">
                        <p className="text-xs opacity-70">Deuda Actual</p>
                        <p className="text-2xl font-mono">${currentDebt.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>

                    {/* Decorativo */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                </div>

                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Límite Utilizado</span>
                            <span className={`font-medium ${utilization > 80 ? 'text-red-500' : 'text-primary'}`}>{utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={utilization} className={`h-2 ${utilization > 80 ? 'bg-red-100' : ''}`} indicatorClassName={utilization > 80 ? 'bg-red-500' : ''} />
                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                            <span>Disp: ${availableCredit.toLocaleString('es-MX')}</span>
                            <span>Total: ${Number(account.limit).toLocaleString('es-MX')}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar size={14} /> Corte
                            </div>
                            <p className="font-medium">Día {account.cutOffDay}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertCircle size={14} /> Pagar antes de
                            </div>
                            <p className={`font-medium ${utilization > 0 ? 'text-red-600' : ''}`}>
                                {nextPaymentDate ? format(nextPaymentDate, 'dd MMM', { locale: es }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderDebitCard = (account) => {
        return (
            <Card key={account.id} className="overflow-hidden hover:shadow-md transition-all group relative border-l-4" style={{ borderLeftColor: account.color || '#10b981' }}>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setEditingAccount(account)}
                    >
                        <Edit2 size={14} />
                    </Button>
                </div>
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-md bg-muted">
                                {account.type === 'cash' ? <Wallet size={16} /> : <CreditCard size={16} />}
                            </div>
                            <h3 className="font-semibold text-lg">{account.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">{account.type === 'cash' ? 'Efectivo' : 'Débito / Cuenta'}</p>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mis Cuentas</h2>
                    <p className="text-muted-foreground">Gestiona tus tarjetas de crédito, débito y efectivo.</p>
                </div>
                <div className="flex items-center gap-2">
                    <AccountManager />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><CreditCard size={20} /> Crédito</h3>
                {creditCards.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl opacity-40 space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <CreditCard size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-medium">No hay tarjetas de crédito</p>
                            <p className="text-sm text-muted-foreground">Registra tus plásticos para controlar límites y cortes.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {creditCards.map(renderCardVisual)}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><Wallet size={20} /> Efectivo y Débito</h3>
                {debitAccounts.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl opacity-40 space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Wallet size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-medium">Sin cuentas de débito</p>
                            <p className="text-sm text-muted-foreground">Añade tu efectivo inicial o cuentas de nómina.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {debitAccounts.map(renderDebitCard)}
                    </div>
                )}
            </div>

            <Dialog open={!!editingAccount} onOpenChange={(val) => !val && setEditingAccount(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Cuenta</DialogTitle>
                    </DialogHeader>
                    {editingAccount && (
                        <AccountForm
                            initialData={editingAccount}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditingAccount(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
