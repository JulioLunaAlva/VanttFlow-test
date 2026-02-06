import React, { useState, useEffect, useId } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { PlusCircle, Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { cn } from "@/lib/utils";

export const TransactionForm = ({ initialData = null, onSuccess, submitLabel = "Agregar" }) => {
    const { addTransaction, editTransaction, categories, accounts, transactions, addInstallments } = useFinance();
    const uniqueId = useId();
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [type, setType] = useState(initialData?.type || 'expense');
    const [category, setCategory] = useState(initialData?.category || '');
    const [accountId, setAccountId] = useState(initialData?.accountId || '');
    const [targetAccountId, setTargetAccountId] = useState(initialData?.targetAccountId || '');
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
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
            setCategory(initialData.category);
            setAccountId(initialData.accountId);
            setTargetAccountId(initialData.targetAccountId || '');
            const dateStr = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            setDate(dateStr);
            setAttachment(initialData.attachment || null);
        } else {
            // Reset for "New Transaction" mode if initialData becomes null (e.g. form reuse)
            setAmount('');
            setDescription('');
            setCategory('');
            setAttachment(null);
            setDate(new Date().toISOString().split('T')[0]);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit check
                alert('La imagen es muy pesada (max 2MB)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({ name: file.name, base64: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? 'Editar Transacción' : 'Nueva Transacción'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                        <Button
                            type="button"
                            variant={type === 'income' ? 'default' : 'ghost'}
                            onClick={() => setType('income')}
                            className={cn("flex-1 text-xs", type === 'income' && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                        >
                            Ingreso
                        </Button>
                        <Button
                            type="button"
                            variant={type === 'expense' ? 'default' : 'ghost'}
                            onClick={() => setType('expense')}
                            className={cn("flex-1 text-xs", type === 'expense' && "bg-red-600 hover:bg-red-700 text-white")}
                        >
                            Gasto
                        </Button>
                        <Button
                            type="button"
                            variant={type === 'transfer' ? 'default' : 'ghost'}
                            onClick={() => setType('transfer')}
                            className={cn("flex-1 text-xs", type === 'transfer' && "bg-blue-600 hover:bg-blue-700 text-white")}
                        >
                            Transferencia
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <AccountSelect
                                accounts={accounts}
                                value={accountId}
                                onChange={setAccountId}
                                placeholder={type === 'transfer' ? "Cuenta Origen" : "Cuenta"}
                            />
                        </div>
                        <div className="space-y-2">
                            {type === 'transfer' ? (
                                <AccountSelect
                                    accounts={accounts.filter(a => a.id !== accountId)}
                                    value={targetAccountId}
                                    onChange={setTargetAccountId}
                                    placeholder="Cuenta Destino"
                                />
                            ) : (
                                <CategorySelect
                                    categories={categories.filter(c => c.type === type || c.type === 'both')}
                                    value={category}
                                    onChange={setCategory}
                                    placeholder="Categoría"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <MoneyInput
                                value={amount}
                                onChange={setAmount}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <DatePicker
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
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
                                <Button type="button" variant="outline" size="sm" className="w-full text-muted-foreground border-dashed" onClick={() => document.getElementById(`file-upload-${uniqueId}`).click()}>
                                    <Upload size={16} className="mr-2" /> Adjuntar comprobante/foto
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
                                    Diferir en parcialidades
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
                                        "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                        isInstallments ? "right-1" : "left-1"
                                    )} />
                                </button>
                            </div>

                            {isInstallments && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Núm. de pagos</label>
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
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Frecuencia</label>
                                        <select
                                            value={installmentFrequency}
                                            onChange={(e) => setInstallmentFrequency(e.target.value)}
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            <option value="monthly">Mensual</option>
                                            <option value="fortnightly">Quincenal</option>
                                        </select>
                                    </div>
                                    <p className="col-span-2 text-[10px] text-muted-foreground italic px-1">
                                        Se registrará el monto total en tu historial y se crearán {installmentCount} pagos programados de {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount / installmentCount)} cada uno.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full gap-2">
                        <PlusCircle size={16} /> {submitLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
