
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming standard Shadcn Label or use html label
import { Select } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/ColorPicker";
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
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Cuenta</label>
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. BBVA Crédito Oro"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Cuenta</label>
                <Select value={type} onChange={e => setType(e.target.value)}>
                    <option value="debit">Efectivo / Débito</option>
                    <option value="credit">Tarjeta de Crédito</option>
                    <option value="cash">Efectivo Físico</option>
                    <option value="investment">Inversión</option>
                </Select>
            </div>
            {type === 'credit' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Límite de Crédito</label>
                            <Input
                                type="number"
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                placeholder="50000"
                            />
                        </div>
                        <div className="space-y-2">
                            {/* Initial Balance for Card usually 0 (no debt) or negative (debt) */}
                            <label className="text-sm font-medium">Deuda Inicial (-)</label>
                            <Input
                                type="number"
                                value={balance}
                                onChange={e => setBalance(e.target.value)}
                                placeholder="-1500"
                            />
                            <p className="text-[10px] text-muted-foreground">Usa negativo para deuda actual.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Día de Corte</label>
                            <Input
                                type="number"
                                min="1" max="31"
                                value={cutOffDay}
                                onChange={e => setCutOffDay(e.target.value)}
                                placeholder="Ej. 5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Día de Pago</label>
                            <Input
                                type="number"
                                min="1" max="31"
                                value={paymentDay}
                                onChange={e => setPaymentDay(e.target.value)}
                                placeholder="Ej. 25"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Saldo Actual</label>
                    <Input
                        type="number"
                        value={balance}
                        onChange={e => setBalance(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium">Color Distintivo</label>
                <ColorPicker value={color} onChange={setColor} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
                {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 hover:bg-accent rounded text-sm">Cancelar</button>}
                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">Guardar</button>
            </div>
        </form>
    );
};
