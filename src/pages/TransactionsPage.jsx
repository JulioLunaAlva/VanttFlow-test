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
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center glass-card p-6 border-white/10 mb-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground">{t('common.transactions')}</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">
                        {t('transactions.manage_desc') || 'Historial y registro de movimientos'}
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 md:pb-8">
                <div className={cn(
                    "lg:col-span-4 transition-all duration-1000",
                    new URLSearchParams(location.search).get('action') === 'new' && "ring-4 ring-primary ring-offset-4 rounded-[2rem] animate-pulse shadow-[0_0_50px_rgba(var(--primary),0.3)]"
                )} ref={formRef}>
                    <div className="glass-card card-glow h-full">
                        <TransactionForm />
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="glass-card card-glow h-full">
                        <TransactionList />
                    </div>
                </div>
            </div>
        </div>
    );
};
