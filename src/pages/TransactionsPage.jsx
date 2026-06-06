import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Receipt } from "lucide-react";

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
        <div className="space-y-6 pt-4 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-premium px-6 py-5 md:px-10 md:py-8 rounded-[2rem] border-border/50 group relative overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Receipt size={22} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">{t('common.transactions')}</h2>
                        <div className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 mt-1 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {t('transactions.manage_desc') || 'Historial y registro de movimientos'}
                        </div>
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
