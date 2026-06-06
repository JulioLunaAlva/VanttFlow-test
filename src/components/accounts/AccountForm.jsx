
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming standard Shadcn Label or use html label
import { Select } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
export const AccountForm = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = React.useState(initialData?.name || '');
    const [balance, setBalance] = React.useState(initialData?.initialBalance || ''); // For credit, this might be 0 start
    const [type, setType] = React.useState(initialData?.type || 'debit');
    const [limit, setLimit] = React.useState(initialData?.limit || '');
    const [cutOffDay, setCutOffDay] = React.useState(initialData?.cutOffDay || '');
    const [paymentDay, setPaymentDay] = React.useState(initialData?.paymentDay || '');
    const [color, setColor] = React.useState(initialData?.color || '#000000');
    React.useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setBalance(initialData.initialBalance || 0);
            setType(initialData.type || 'debit');
            setLimit(initialData.limit || 0);
            setCutOffDay(initialData.cutOffDay || 1);
            setPaymentDay(initialData.paymentDay || 1);
            setColor(initialData.color || '#000000');
        } else {
            // Reset to defaults if needed or keep blank
            setName('');
            setBalance(0);
            setType('debit');
            setLimit(0);
            setCutOffDay(1);
            setPaymentDay(1);
            setColor('#000000');
        }
    }, [initialData]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            initialBalance: parseFloat(balance) || 0,
            type,
            limit: parseFloat(limit) || 0,
            cutOffDay: parseInt(cutOffDay) || 1,
            paymentDay: parseInt(paymentDay) || 1,
            color
        });
    };
    const { t } = useTranslation();

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
                <div className="space-y-2 group">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {t('accounts.account_name') || 'Nombre de la Cuenta'}
                    </label>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej. BBVA Crédito Oro"
                        required
                        className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {t('accounts.account_type') || 'Tipo de Cuenta'}
                    </label>
                    <Select value={type} onChange={e => setType(e.target.value)} className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold">
                        <option value="debit">{t('accounts.debit_option') || 'Efectivo / Débito'}</option>
                        <option value="credit">{t('accounts.credit_option') || 'Tarjeta de Crédito'}</option>
                        <option value="cash">{t('accounts.cash_option') || 'Efectivo Físico'}</option>
                        <option value="investment">{t('accounts.investment_option') || 'Inversión'}</option>
                    </Select>
                </div>

                {type === 'credit' ? (
                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 group/field">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    {t('accounts.credit_limit') || 'Límite de Crédito'}
                                </label>
                                <Input
                                    type="number"
                                    value={limit}
                                    onChange={e => setLimit(e.target.value)}
                                    placeholder="50000"
                                    className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                                />
                            </div>
                            <div className="space-y-2 group/field">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    {t('accounts.initial_debt') || 'Deuda Inicial (-)'}
                                </label>
                                <Input
                                    type="number"
                                    value={balance}
                                    onChange={e => setBalance(e.target.value)}
                                    placeholder="-1500"
                                    className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 group/field">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    {t('accounts.cutoff_day') || 'Día de Corte'}
                                </label>
                                <Input
                                    type="number"
                                    min="1" max="31"
                                    value={cutOffDay}
                                    onChange={e => setCutOffDay(e.target.value)}
                                    placeholder="Ej. 5"
                                    className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                                />
                            </div>
                            <div className="space-y-2 group/field">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    {t('accounts.payment_day') || 'Día de Pago'}
                                </label>
                                <Input
                                    type="number"
                                    min="1" max="31"
                                    value={paymentDay}
                                    onChange={e => setPaymentDay(e.target.value)}
                                    placeholder="Ej. 25"
                                    className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 group pt-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            {t('accounts.current_balance') || 'Saldo Actual'}
                        </label>
                        <Input
                            type="number"
                            value={balance}
                            onChange={e => setBalance(e.target.value)}
                            placeholder="0.00"
                            className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                        />
                    </div>
                )}

                <div className="space-y-2 group pt-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {t('accounts.distinctive_color') || 'Color Distintivo'}
                    </label>
                    <div className="card-base p-4 rounded-xl border-border/50">
                        <ColorPicker value={color} onChange={setColor} />
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-border/50">
                {onCancel && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={onCancel} 
                    >
                        {t('common.cancel') || 'Cancelar'}
                    </Button>
                )}
                <Button 
                    type="submit" 
                >
                    {t('common.save') || 'Guardar'}
                </Button>
            </div>
        </form>
    );
};
