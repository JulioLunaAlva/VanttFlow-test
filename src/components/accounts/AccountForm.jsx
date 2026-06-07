
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AccountForm = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = React.useState(initialData?.name || '');
    const [balance, setBalance] = React.useState(initialData?.initialBalance || '');
    const [type, setType] = React.useState(initialData?.type || 'debit');
    const [limit, setLimit] = React.useState(initialData?.limit || '');
    const [cutOffDay, setCutOffDay] = React.useState(initialData?.cutOffDay || '');
    const [paymentDay, setPaymentDay] = React.useState(initialData?.paymentDay || '');
    const [color, setColor] = React.useState(initialData?.color || '#000000');
    const { t } = useTranslation();

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
        const parsedBalance = parseFloat(balance) || 0;
        // Para tarjetas de crédito, la deuda inicial SIEMPRE debe ser negativa
        const initialBalance = type === 'credit'
            ? (parsedBalance > 0 ? -parsedBalance : parsedBalance)
            : parsedBalance;
        onSubmit({
            name,
            initialBalance,
            type,
            limit: parseFloat(limit) || 0,
            cutOffDay: parseInt(cutOffDay) || 1,
            paymentDay: parseInt(paymentDay) || 1,
            color
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            {/* ── Scrollable fields ── */}
            <div className="space-y-5 pb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Account Name */}
                <div className="space-y-2">
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

                {/* Account Type */}
                <div className="space-y-2">
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

                {/* Credit-specific fields */}
                {type === 'credit' ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    {t('accounts.initial_debt') || 'Deuda Actual'}
                                </label>
                                <Input
                                    type="number"
                                    value={balance}
                                    onChange={e => setBalance(e.target.value)}
                                    placeholder="1500"
                                    min="0"
                                    className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                                />
                                <p className="text-[10px] text-muted-foreground/50 ml-1">
                                    {t('accounts.initial_debt_hint') || 'Monto de deuda actual (positivo)'}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
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
                            <div className="space-y-2">
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
                    <div className="space-y-2">
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

                {/* Color Picker */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {t('accounts.distinctive_color') || 'Color Distintivo'}
                    </label>
                    <div className="card-base p-4 rounded-xl border-border/50">
                        <ColorPicker value={color} onChange={setColor} />
                    </div>
                </div>
            </div>

            {/* ── Sticky Save/Cancel bar — ALWAYS VISIBLE ── */}
            <div className="sticky bottom-0 pt-4 pb-4 bg-card border-t border-border/40 flex gap-3 mt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-xl font-bold border border-border/50"
                    >
                        <X size={16} className="mr-2" />
                        {t('common.cancel') || 'Cancelar'}
                    </Button>
                )}
                <Button
                    type="submit"
                    className="flex-1 h-12 rounded-xl font-black bg-primary text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                    <Save size={16} className="mr-2" />
                    {t('common.save') || 'Guardar'}
                </Button>
            </div>
        </form>
    );
};
