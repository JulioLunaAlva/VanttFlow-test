import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, ThumbsUp, ThumbsDown, AlertTriangle, ArrowRight } from 'lucide-react';

export const OracleWidget = () => {
    const { simulatePurchase } = useFinance();
    const [amount, setAmount] = useState('');
    const [result, setResult] = useState(null);

    const handleConsult = (e) => {
        e.preventDefault();
        if (!amount) return;
        const simulation = simulatePurchase(amount);
        setResult(simulation);
    };

    return (
        <Card className="h-full border-2 border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-900/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-indigo-500" />
                    El Oráculo
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!result ? (
                    <form onSubmit={handleConsult} className="space-y-4">
                        <p className="text-xs text-muted-foreground">
                            ¿Planeas una compra grande? Pregúntale al Oráculo si te alcanza.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Monto (ej. $3,500)"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="h-9 text-xs"
                            />
                            <Button size="sm" type="submit" className="h-9 bg-indigo-600 hover:bg-indigo-700">
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                        <div className={`p-3 rounded-lg flex items-start gap-3 ${result.status === 'safe' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200' :
                                result.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            }`}>
                            {result.status === 'safe' ? <ThumbsUp className="mt-0.5 shrink-0" size={18} /> :
                                result.status === 'warning' ? <AlertTriangle className="mt-0.5 shrink-0" size={18} /> :
                                    <ThumbsDown className="mt-0.5 shrink-0" size={18} />}

                            <div className="space-y-1">
                                <p className="text-xs font-bold leading-none">
                                    {result.status === 'safe' ? 'APROBADO' :
                                        result.status === 'warning' ? 'CON CUIDADO' :
                                            'DENEGADO'}
                                </p>
                                <p className="text-[10px] leading-tight opacity-90">
                                    {result.message}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setResult(null);
                                setAmount('');
                            }}
                        >
                            Consultar otra vez
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
