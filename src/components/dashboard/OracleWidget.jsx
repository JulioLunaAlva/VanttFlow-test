import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, ThumbsUp, ThumbsDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OracleWidget = () => {
    const { t } = useTranslation();
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
        <div className="h-full flex flex-col relative overflow-hidden group">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all duration-700" />
            
            <div className="p-6 border-b border-border/30 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <BrainCircuit size={20} />
                    </span>
                    {t('dashboard.oracle.title')}
                </h3>
            </div>
            
            <div className="p-6 flex-1 relative z-10">
                {!result ? (
                    <form onSubmit={handleConsult} className="space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed">
                            {t('dashboard.oracle.analysis')}
                        </p>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Input
                                    type="number"
                                    placeholder={t('dashboard.oracle.ask_placeholder')}
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="h-12 bg-foreground/5 border-border/30 rounded-2xl pl-4 pr-10 font-bold focus:ring-indigo-500/50"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-foreground/20 uppercase tracking-widest pointer-events-none">
                                    MXN
                                </div>
                            </div>
                            <Button 
                                size="icon" 
                                type="submit" 
                                className="h-12 w-12 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] rounded-2xl transition-all hover:scale-105 active:scale-95"
                            >
                                <ArrowRight size={20} />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className={`p-5 rounded-[2rem] border relative overflow-hidden ${
                            result.status === 'safe' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' :
                            result.status === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' :
                            'bg-rose-500/5 border-rose-500/20 text-rose-500'
                        }`}>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={`p-3 rounded-2xl shadow-lg border ${
                                    result.status === 'safe' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                    result.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                                    'bg-rose-500/10 border-rose-500/20'
                                }`}>
                                    {result.status === 'safe' ? <ThumbsUp size={24} /> :
                                        result.status === 'warning' ? <AlertTriangle size={24} /> :
                                            <ThumbsDown size={24} />}
                                </div>
                                <div className="space-y-1 pt-1">
                                    <h4 className="font-black text-lg tracking-tight uppercase">
                                        {result.status === 'safe' ? t('dashboard.oracle.verdict_safe') :
                                            result.status === 'warning' ? t('dashboard.oracle.verdict_warn') :
                                                t('dashboard.oracle.verdict_danger')}
                                    </h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                                        {t(result.messageKey)}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Inner glow */}
                            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-20 ${
                                result.status === 'safe' ? 'bg-emerald-500' :
                                result.status === 'warning' ? 'bg-amber-500' :
                                'bg-rose-500'
                            }`} />
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full h-12 rounded-2xl bg-foreground/5 border-border/30 font-bold text-[10px] uppercase tracking-widest hover:bg-foreground/10"
                            onClick={() => {
                                setResult(null);
                                setAmount('');
                            }}
                        >
                            {t('common.back')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
