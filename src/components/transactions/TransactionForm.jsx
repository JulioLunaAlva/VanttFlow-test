import React, { useState, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { PlusCircle, Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { useGamification } from "@/context/GamificationContext";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { cn } from "@/lib/utils";
import { toLocalDateStr } from "@/lib/utils";


export const TransactionForm = ({ initialData = null, onSuccess, submitLabel }) => {
    const { addTransaction, editTransaction, categories, accounts, transactions, addInstallments } = useFinance();
    const { completeMission } = useGamification();
    const { t } = useTranslation();

    const uniqueId = useId();
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [type, setType] = useState(initialData?.type || 'expense');
    const [category, setCategory] = useState(initialData?.category || '');
    const [accountId, setAccountId] = useState(initialData?.accountId || '');
    const [targetAccountId, setTargetAccountId] = useState(initialData?.targetAccountId || '');
    const [date, setDate] = useState(initialData?.date ? toLocalDateStr(new Date(initialData.date + 'T12:00:00')) : toLocalDateStr());
    const [attachment, setAttachment] = useState(initialData?.attachment || null); // { name, base64 }

    // Installments status
    const [isInstallments, setIsInstallments] = useState(false);
    const [installmentCount, setInstallmentCount] = useState(3);
    const [installmentFrequency, setInstallmentFrequency] = useState('monthly');


    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount);
            setDescription(initialData.description);
            setType(initialData.type);
            setCategory(initialData.category);
            setAccountId(initialData.accountId);
            setTargetAccountId(initialData.targetAccountId || '');
            const dateStr = initialData.date ? toLocalDateStr(new Date(initialData.date + 'T12:00:00')) : toLocalDateStr();
            setDate(dateStr);
            setAttachment(initialData.attachment || null);
        } else {
            // Reset for "New Transaction" mode if initialData becomes null (e.g. form reuse)
            setAmount('');
            setDescription('');
            setCategory('');
            setAttachment(null);
            setDate(toLocalDateStr());
            // Type and Account might persist as user preference, but let's be safe or keep current behavior if it works for user.
            // keeping type/account as is or resetting? User might want to batch add.
            // Let's just ensure attachment is cleared.
        }
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            // Logic to auto-set category based on type change in "Add" mode
            setCategory('');
        }
    }, [type]);

    useEffect(() => {
        // Default to first account if available and none selected
        if (accounts.length > 0 && !accountId) {
            setAccountId(accounts[0].id);
        }
    }, [accounts]);

    // Smart Categorization Logic
    useEffect(() => {
        if (initialData || !description || description.length < 3 || category) return;

        const timer = setTimeout(() => {
            const matches = transactions.filter(t =>
                t.description.toLowerCase().includes(description.toLowerCase()) &&
                t.type === type &&
                t.category
            );

            if (matches.length > 0) {
                // Find the most frequent category for this description
                const counts = matches.reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + 1;
                    return acc;
                }, {});

                const mostFrequent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                if (mostFrequent) {
                    setCategory(mostFrequent);
                    toast.info(`Sugerencia: Categoría "${categories.find(c => c.id === mostFrequent)?.name}" aplicada automáticamente`, {
                        duration: 2000,
                        position: 'bottom-right'
                    });
                }
            }
        }, 500); // Debounce to avoid jumping while typing

        return () => clearTimeout(timer);
    }, [description, type, transactions, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        const transactionData = {
            amount: parseFloat(amount),
            description,
            type,
            category: type === 'transfer' ? 'transfer' : (category || (type === 'income' ? 'other_income' : 'other_expense')),
            accountId: accountId || (accounts[0]?.id),
            targetAccountId: type === 'transfer' ? targetAccountId : null,
            date,
            attachment // Save base64
        };

        if (initialData) {
            editTransaction(initialData.id, transactionData);
        } else if (isInstallments && type === 'expense') {
            addInstallments(transactionData, {
                count: parseInt(installmentCount),
                frequency: installmentFrequency
            });
        } else {
            addTransaction(transactionData);
            completeMission('reg_trans');
        }

        if (onSuccess) {
            onSuccess();
        } else {
            // Reset form only if not editing (or handled by parent)
            setAmount('');
            setDescription('');
            setCategory('');
            setAttachment(null);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit check
                toast.error('La imagen es muy pesada (max 2MB)');
                return;
            }
            
            // 1. Convert to base64 for preview/storage
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({ name: file.name, base64: reader.result });
            };
            reader.readAsDataURL(file);

            
        }
    };


    return (
        <div className="flex flex-col w-full">
            <div className="relative">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Premium Segmented Control for Type */}
                    <div className="relative flex p-1.5 bg-muted/40 backdrop-blur-sm rounded-2xl border border-border/40 overflow-hidden w-full max-w-sm mx-auto shadow-inner">
                        {['income', 'expense', 'transfer'].map((tType) => (
                            <button
                                key={tType}
                                type="button"
                                onClick={() => setType(tType)}
                                className={cn(
                                    "relative flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 z-10",
                                    type === tType ? "text-primary-foreground shadow-lg scale-[1.02]" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                )}
                            >
                                {type === tType && (
                                    <div className={cn(
                                        "absolute inset-0 rounded-xl shadow-md -z-10 transition-all duration-500",
                                        tType === 'income' ? 'bg-emerald-500' : tType === 'expense' ? 'bg-rose-500' : 'bg-blue-500'
                                    )} />
                                )}
                                {tType === 'income' ? t('scheduled.income') : tType === 'expense' ? t('scheduled.expense') : t('transactions.transfer')}
                            </button>
                        ))}
                    </div>

                    {/* Apple Wallet Style Amount Input */}
                    <div className="relative py-4 flex flex-col items-center">
                        <span className="text-caption font-bold tracking-widest text-muted-foreground mb-2 uppercase">{t('transactions.amount') || 'Monto de la transacción'}</span>
                        <div className="relative max-w-[280px] w-full">
                            <span className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 font-black text-2xl transition-colors duration-500",
                                type === 'income' ? "text-emerald-500" : type === 'expense' ? "text-rose-500" : "text-blue-500"
                            )}>$</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                className={cn(
                                    "pl-10 h-20 text-center text-4xl font-black bg-transparent border-0 border-b-2 border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all duration-500",
                                    type === 'income' ? "text-emerald-500" : type === 'expense' ? "text-rose-500" : "text-blue-500"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Input
                            type="text"
                            placeholder={t('transactions.description')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">{type === 'transfer' ? t('transactions.origin_account') : t('transactions.account')}</label>
                            <AccountSelect
                                accounts={accounts}
                                value={accountId}
                                onChange={setAccountId}
                                placeholder={type === 'transfer' ? t('transactions.origin_account') : t('transactions.account')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">{type === 'transfer' ? t('transactions.target_account') : t('budget.category_label')}</label>
                            {type === 'transfer' ? (
                                <AccountSelect
                                    accounts={accounts.filter(a => a.id !== accountId)}
                                    value={targetAccountId}
                                    onChange={setTargetAccountId}
                                    placeholder={t('transactions.target_account')}
                                />
                            ) : (
                                <CategorySelect
                                    categories={categories.filter(c => c.type === type || c.type === 'both')}
                                    value={category}
                                    onChange={setCategory}
                                    placeholder={t('budget.category_label')}
                                />
                            )}
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">{t('transactions.date') || 'Fecha'}</label>
                            <DatePicker
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Attachment Section */}
                    <div className="space-y-2 pb-4">
                        {!attachment ? (
                            <div className="flex items-center gap-2">
                                <input
                                    id={`file-upload-${uniqueId}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    className={cn(
                                        "w-full text-muted-foreground border-dashed h-12"
                                    )} 
                                    onClick={() => document.getElementById(`file-upload-${uniqueId}`).click()}
                                >
                                    <Upload size={16} className="mr-2" />
                                    {t('transactions.attach_receipt')}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-2 border rounded bg-muted/20 text-sm">
                                <div className="flex items-center gap-2 truncate">
                                    <ImageIcon size={16} className="text-blue-500" />
                                    <span className="truncate max-w-[150px]">{attachment.name}</span>
                                    {attachment.base64 && (
                                        <a href={attachment.base64} download={attachment.name} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline ml-2">
                                            (Ver)
                                        </a>
                                    )}
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachment(null)}>
                                    <X size={14} />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Installments Section */}
                    {type === 'expense' && !initialData && (
                        <div className="pt-2 border-t border-border/40 pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <PlusCircle size={14} className={cn(isInstallments ? "text-primary" : "text-muted-foreground")} />
                                    {t('transactions.installments_label')}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsInstallments(!isInstallments)}
                                    className={cn(
                                        "w-10 h-5 rounded-full transition-colors relative",
                                        isInstallments ? "bg-primary" : "bg-muted"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-3 h-3 rounded-full bg-card transition-all",
                                        isInstallments ? "right-1" : "left-1"
                                    )} />
                                </button>
                            </div>

                            {isInstallments && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">{t('transactions.num_payments')}</label>
                                        <Input
                                            type="number"
                                            min="2"
                                            max="48"
                                            value={installmentCount}
                                            onChange={(e) => setInstallmentCount(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">{t('subscriptions.monthly')}</label>
                                        <select
                                            value={installmentFrequency}
                                            onChange={(e) => setInstallmentFrequency(e.target.value)}
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            <option value="monthly">{t('scheduled.monthly_recurrent')}</option>
                                            <option value="fortnightly">{t('transactions.fortnightly')}</option>
                                        </select>
                                    </div>
                                    <p className="col-span-2 text-[10px] text-muted-foreground italic px-1">
                                        Se registrará el monto total en tu historial y se crearán {installmentCount} pagos programados de {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount / installmentCount)} cada uno.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest gap-3 shadow-xl active:scale-95 transition-all">
                        <PlusCircle size={20} /> {submitLabel || t('transactions.add')}
                    </Button>
                </form>
            </div>
        </div>
    );
};
