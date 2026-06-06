import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFinance } from "@/context/FinanceContext";
import { Wallet, Plus, Trash2, Edit2, CreditCard } from 'lucide-react';
import { AccountForm } from './AccountForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
export const AccountManager = () => {
    const { t } = useTranslation();
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
                    <Button variant="outline" className="h-10 px-4 rounded-xl hover:bg-accent hover:text-accent-foreground gap-2">
                        <Wallet size={16} className="text-primary" />
                        <span className="font-bold text-xs">{t('accounts.manage') || 'Gestión'}</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/30">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black tracking-tight text-foreground">{editingAccount ? t('accounts.edit_account') || 'Editar Cuenta' : t('accounts.title') || 'Gestión de Cuentas'}</DialogTitle>
                            <p className="text-xs text-muted-foreground">{t('accounts.manage_subtitle') || 'Añade o modifica tus activos financieros'}</p>
                        </DialogHeader>
                    </div>

                    <div className="p-6 bg-background space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {!editingAccount && accounts.length > 0 && (
                            <div className="space-y-6">
                                <div className="grid gap-3">
                                    {accounts.map(account => (
                                        <div key={account.id} className="flex items-center justify-between p-4 card-base card-interactive">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted border border-border/50" style={{ color: account.color }}>
                                                    {getIcon(account.type)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{account.name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{account.type === 'credit' ? t('accounts.credit') || 'Crédito' : t('accounts.debit') || 'Efectivo/Débito'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => handleEdit(account)}>
                                                    <Edit2 size={14} className="text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground" onClick={() => setAccountToDelete(account.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
                                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold"><span className="bg-background px-4 text-muted-foreground">{t('accounts.add_new') || 'Añadir Nueva'}</span></div>
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
                    </div>
                </DialogContent>
            </Dialog>
            <AlertDialog open={accountToDelete} onOpenChange={() => setAccountToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('accounts.confirm_delete') || '¿Estás seguro?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('accounts.delete_desc') || 'Esta acción eliminará la cuenta y podría afectar el historial si hay transacciones asociadas que no se hayan eliminado previamente.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('common.cancel') || 'Cancelar'}
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => handleDelete(accountToDelete)}>
                            {t('common.delete') || 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};