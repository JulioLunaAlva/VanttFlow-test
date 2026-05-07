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
                    <Button variant="ghost" className="h-12 px-6 rounded-2xl glass-premium border-border/30 hover:bg-foreground/10 text-foreground gap-3 group transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl">
                        <Wallet size={18} className="text-primary group-hover:rotate-12 transition-transform shadow-glow" />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em]">{t('accounts.manage') || 'Mis Cuentas'}</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md glass-premium border-border/30 p-0 overflow-hidden rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                    <div className="p-10 border-b border-border/30 bg-foreground/5 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                        <DialogHeader className="relative z-10">
                            <DialogTitle className="text-3xl font-black tracking-tighter text-foreground drop-shadow-2xl">{editingAccount ? t('accounts.edit_account') || 'Editar Cuenta' : t('accounts.title') || 'Gestión de Cuentas'}</DialogTitle>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mt-2">{t('accounts.manage_subtitle') || 'Añade o modifica tus activos financieros'}</p>
                        </DialogHeader>
                    </div>

                    <div className="p-10 bg-black/40 backdrop-blur-3xl space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {!editingAccount && accounts.length > 0 && (
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    {accounts.map(account => (
                                        <div key={account.id} className="flex items-center justify-between p-5 glass-premium border border-border/30 rounded-3xl hover:bg-foreground/5 transition-all duration-500 group/item relative overflow-hidden">
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-foreground/5 border border-border/30 shadow-inner group-hover/item:scale-110 transition-transform duration-500" style={{ color: account.color }}>
                                                    {getIcon(account.type)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm tracking-tight text-foreground/90">{account.name}</p>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{account.type === 'credit' ? t('accounts.credit') || 'Crédito' : t('accounts.debit') || 'Efectivo/Débito'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 relative z-10">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 bg-foreground/5 hover:bg-foreground/10 rounded-xl" onClick={() => handleEdit(account)}>
                                                    <Edit2 size={14} className="text-primary/70" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 bg-rose-500/5 hover:bg-rose-500/20 rounded-xl text-rose-500/50 hover:text-rose-500" onClick={() => setAccountToDelete(account.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000" />
                                        </div>
                                    ))}
                                </div>
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/30"></span></div>
                                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0a0a0a] px-4 text-muted-foreground/30">{t('accounts.add_new') || 'Añadir Nueva'}</span></div>
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
                <AlertDialogContent className="glass-premium border-border/30 rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight text-foreground mb-2">{t('accounts.confirm_delete') || '¿Estás seguro?'}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground text-sm font-medium leading-relaxed">
                            {t('accounts.delete_desc') || 'Esta acción eliminará la cuenta y podría afectar el historial si hay transacciones asociadas que no se hayan eliminado previamente.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-4">
                        <AlertDialogCancel className="bg-foreground/5 hover:bg-foreground/10 border-border/30 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                            {t('common.cancel') || 'Cancelar'}
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 border border-rose-500/20 rounded-2xl shadow-glow font-black text-[10px] uppercase tracking-widest px-8 transition-all" onClick={() => handleDelete(accountToDelete)}>
                            {t('common.delete') || 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};