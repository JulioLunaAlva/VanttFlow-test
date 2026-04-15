
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
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover:text-primary transition-colors block ml-2">
                        {t('accounts.account_name') || 'Nombre de la Cuenta'}
                    </label>
                    <div className="relative">
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ej. BBVA Crédito Oro"
                            required
                            className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight focus:ring-primary/20 transition-all placeholder:text-white/10"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20 blur-[4px] group-hover:bg-primary transition-all shadow-glow" />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover:text-primary transition-colors block ml-2">
                        {t('accounts.account_type') || 'Tipo de Cuenta'}
                    </label>
                    <div className="relative">
                        <Select value={type} onChange={e => setType(e.target.value)} className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight transition-all">
                            <option value="debit">{t('accounts.debit_option') || 'Efectivo / Débito'}</option>
                            <option value="credit">{t('accounts.credit_option') || 'Tarjeta de Crédito'}</option>
                            <option value="cash">{t('accounts.cash_option') || 'Efectivo Físico'}</option>
                            <option value="investment">{t('accounts.investment_option') || 'Inversión'}</option>
                        </Select>
                    </div>
                </div>

                {type === 'credit' ? (
                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 group/field">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover/field:text-primary transition-colors block ml-2">
                                    {t('accounts.credit_limit') || 'Límite de Crédito'}
                                </label>
                                <Input
                                    type="number"
                                    value={limit}
                                    onChange={e => setLimit(e.target.value)}
                                    placeholder="50000"
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-2 group/field">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover/field:text-rose-400 transition-colors block ml-2">
                                    {t('accounts.initial_debt') || 'Deuda Inicial (-)'}
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={balance}
                                        onChange={e => setBalance(e.target.value)}
                                        placeholder="-1500"
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight focus:ring-rose-400/20 transition-all border-rose-500/10"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500/20 blur-[4px]" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 group/field">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover/field:text-primary transition-colors block ml-2">
                                    {t('accounts.cutoff_day') || 'Día de Corte'}
                                </label>
                                <Input
                                    type="number"
                                    min="1" max="31"
                                    value={cutOffDay}
                                    onChange={e => setCutOffDay(e.target.value)}
                                    placeholder="Ej. 5"
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-2 group/field">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover/field:text-primary transition-colors block ml-2">
                                    {t('accounts.payment_day') || 'Día de Pago'}
                                </label>
                                <Input
                                    type="number"
                                    min="1" max="31"
                                    value={paymentDay}
                                    onChange={e => setPaymentDay(e.target.value)}
                                    placeholder="Ej. 25"
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 group pt-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover:text-emerald-400 transition-colors block ml-2">
                            {t('accounts.current_balance') || 'Saldo Actual'}
                        </label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={balance}
                                onChange={e => setBalance(e.target.value)}
                                placeholder="0.00"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black tracking-tight focus:ring-emerald-400/20 transition-all border-emerald-500/10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500/20 blur-[4px] shadow-glow" />
                        </div>
                    </div>
                )}

                <div className="space-y-2 group pt-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 group-hover:text-primary transition-colors block ml-2">
                        {t('accounts.distinctive_color') || 'Color Distintivo'}
                    </label>
                    <div className="glass-premium p-4 rounded-3xl border-white/5 bg-white/5 overflow-hidden">
                        <ColorPicker value={color} onChange={setColor} />
                    </div>
                </div>
            </div>

            <div className="pt-8 flex justify-end gap-4 border-t border-white/5">
                {onCancel && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={onCancel} 
                        className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 text-muted-foreground transition-all"
                    >
                        <X size={16} className="mr-2" />
                        {t('common.cancel') || 'Cancelar'}
                    </Button>
                )}
                <Button 
                    type="submit" 
                    className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] shadow-glow transition-all active:scale-95 group"
                >
                    <Check size={16} className="mr-2 group-hover:scale-125 transition-transform" />
                    {t('common.save') || 'Guardar'}
                </Button>
            </div>
        </form>
    );
};
