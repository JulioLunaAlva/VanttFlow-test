<<<<<<< HEAD
import React, { useState, useEffect, useId } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { PlusCircle, Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { MoneyInput } from "@/components/ui/MoneyInput";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { DatePicker } from "@/components/ui/DatePicker";

export const TransactionForm = ({ initialData = null, onSuccess, submitLabel = "Agregar" }) => {
    const { addTransaction, editTransaction, categories, accounts } = useFinance();
    const uniqueId = useId();
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [type, setType] = useState(initialData?.type || 'expense');
    const [category, setCategory] = useState(initialData?.category || '');
    const [accountId, setAccountId] = useState(initialData?.accountId || '');
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [attachment, setAttachment] = useState(initialData?.attachment || null); // { name, base64 }

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount);
            setDescription(initialData.description);
            setType(initialData.type);
            setCategory(initialData.category);
            setAccountId(initialData.accountId);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        const transactionData = {
            amount: parseFloat(amount),
            description,
            type,
            category: category || (type === 'income' ? 'other_income' : 'other_expense'),
            accountId: accountId || (accounts[0]?.id),
            date,
            attachment // Save base64
        };

        if (initialData) {
            editTransaction(initialData.id, transactionData);
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
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant={type === 'income' ? 'default' : 'outline'}
                            onClick={() => setType('income')}
                            className="w-full"
                        >
                            Ingreso
                        </Button>
                        <Button
                            type="button"
                            variant={type === 'expense' ? 'destructive' : 'outline'}
                            onClick={() => setType('expense')}
                            className={type === 'expense' ? 'bg-red-600 hover:bg-red-700 text-white' : 'w-full'}
                        >
                            Gasto
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <AccountSelect
                                accounts={accounts}
                                value={accountId}
                                onChange={setAccountId}
                                placeholder="Cuenta"
                            />
                        </div>
                        <div className="space-y-2">
                            <CategorySelect
                                categories={categories.filter(c => c.type === type || c.type === 'both')}
                                value={category}
                                onChange={setCategory}
                                placeholder="Categoría"
                            />
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
                    <div className="space-y-2">
                        {!attachment ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`file-upload-${uniqueId}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button type="button" variant="outline" size="sm" className="w-full text-muted-foreground dashed border-dashed" onClick={() => document.getElementById(`file-upload-${uniqueId}`).click()}>
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
                                            (Ver/Descargar)
                                        </a>
                                    )}
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachment(null)}>
                                    <X size={14} />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full gap-2">
                        <PlusCircle size={16} /> Agregar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
=======
import React, { useState, useEffect, useId } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { PlusCircle, Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { MoneyInput } from "@/components/ui/MoneyInput";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { DatePicker } from "@/components/ui/DatePicker";

export const TransactionForm = ({ initialData = null, onSuccess, submitLabel = "Agregar" }) => {
    const { addTransaction, editTransaction, categories, accounts } = useFinance();
    const uniqueId = useId();
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [type, setType] = useState(initialData?.type || 'expense');
    const [category, setCategory] = useState(initialData?.category || '');
    const [accountId, setAccountId] = useState(initialData?.accountId || '');
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [attachment, setAttachment] = useState(initialData?.attachment || null); // { name, base64 }

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount);
            setDescription(initialData.description);
            setType(initialData.type);
            setCategory(initialData.category);
            setAccountId(initialData.accountId);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        const transactionData = {
            amount: parseFloat(amount),
            description,
            type,
            category: category || (type === 'income' ? 'other_income' : 'other_expense'),
            accountId: accountId || (accounts[0]?.id),
            date,
            attachment // Save base64
        };

        if (initialData) {
            editTransaction(initialData.id, transactionData);
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
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant={type === 'income' ? 'default' : 'outline'}
                            onClick={() => setType('income')}
                            className="w-full"
                        >
                            Ingreso
                        </Button>
                        <Button
                            type="button"
                            variant={type === 'expense' ? 'destructive' : 'outline'}
                            onClick={() => setType('expense')}
                            className={type === 'expense' ? 'bg-red-600 hover:bg-red-700 text-white' : 'w-full'}
                        >
                            Gasto
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <AccountSelect
                                accounts={accounts}
                                value={accountId}
                                onChange={setAccountId}
                                placeholder="Cuenta"
                            />
                        </div>
                        <div className="space-y-2">
                            <CategorySelect
                                categories={categories.filter(c => c.type === type || c.type === 'both')}
                                value={category}
                                onChange={setCategory}
                                placeholder="Categoría"
                            />
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
                    <div className="space-y-2">
                        {!attachment ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`file-upload-${uniqueId}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button type="button" variant="outline" size="sm" className="w-full text-muted-foreground dashed border-dashed" onClick={() => document.getElementById(`file-upload-${uniqueId}`).click()}>
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
                                            (Ver/Descargar)
                                        </a>
                                    )}
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachment(null)}>
                                    <X size={14} />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full gap-2">
                        <PlusCircle size={16} /> Agregar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
