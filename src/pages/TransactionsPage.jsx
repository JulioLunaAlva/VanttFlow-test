import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const TransactionsPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const formRef = useRef(null);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'new' && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    return (
        <div className="space-y-8 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-premium p-10 rounded-[3rem] border-border/50 mb-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">{t('common.transactions')}</h2>
                    <div className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                        {t('transactions.manage_desc') || 'Historial y registro de movimientos'}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-24 md:pb-8">
                <div className={cn(
                    "lg:col-span-4 transition-all duration-1000 relative group",
                    new URLSearchParams(location.search).get('action') === 'new' && "animate-pulse"
                )} ref={formRef}>
                    {new URLSearchParams(location.search).get('action') === 'new' && (
                        <div className="absolute -inset-1 bg-primary/20 blur-2xl rounded-[3rem] -z-10 animate-pulse" />
                    )}
                    <div className="glass-premium h-full rounded-[3rem] border-border/50 overflow-hidden active:scale-98 transition-transform duration-500">
                        <TransactionForm />
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="glass-premium h-full rounded-[3.5rem] border-border/50 overflow-hidden">
                        <TransactionList />
                    </div>
                </div>
            </div>
        </div>
    );
};
