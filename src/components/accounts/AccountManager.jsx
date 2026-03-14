import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFinance } from "@/context/FinanceContext";
import { Wallet, Plus, Trash2, Edit2, CreditCard } from 'lucide-react';
import { AccountForm } from './AccountForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
export const AccountManager = () => {
    const { accounts, addAccount, updateAccount, deleteAccount } = useFinance();
    const [open, setOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const handleSubmit = (data) => {
        if (editingAccount) {
            updateAccount(editingAccount.id, data);
        } else {
            addAccount(data);
        }
        setOpen(false);
        setEditingAccount(null);
    };
    const handleEdit = (account) => {
        setEditingAccount(account);
        setOpen(true);
    };
    const handleDelete = (id) => {
        deleteAccount(id);
        setAccountToDelete(null);
    };
    const getIcon = (type) => {
        switch (type) {
            case 'credit': return <CreditCard size={16} />;
            case 'cash': return <Wallet size={16} />;
            default: return <Wallet size={16} />;
        }
    };
    return (
        <>
            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (val) setEditingAccount(null);
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Wallet size={16} /> Mis Cuentas
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAccount ? 'Editar Cuenta' : 'Gestión de Cuentas'}</DialogTitle>
                    </DialogHeader>
                    {editingAccount && (
                        <div className="space-y-4 mb-6">
                            <div className="grid gap-2">
                                {accounts.map(account => (
                                    <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary" style={{ color: account.color }}>
                                                {getIcon(account.type)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{account.name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{account.type === 'credit' ? 'Crédito' : 'Efectivo/Débito'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(account)}>
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setAccountToDelete(account.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O crear nueva</span></div>
                            </div>
                        </div>
                    )}
                    <AccountForm
                        initialData={editingAccount}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            if (editingAccount) {
                                setEditingAccount(null);
                            } else {
                                setOpen(false);
                            }
                        }}
                    />
                </DialogContent>
            </Dialog>
            <AlertDialog open={accountToDelete} onOpenChange={() => setAccountToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la cuenta y podría afectar el historial si hay transacciones asociadas que no se hayan eliminado previamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(accountToDelete)}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};