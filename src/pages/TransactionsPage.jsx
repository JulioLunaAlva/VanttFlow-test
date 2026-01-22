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
            // Add a brief glow or pulse to the form if possible
        }
    }, [location]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t('common.transactions')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={cn(
                    "lg:col-span-1 transition-all duration-1000",
                    new URLSearchParams(location.search).get('action') === 'new' && "ring-4 ring-primary/20 rounded-xl animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                )} ref={formRef}>
                    <TransactionForm />
                </div>
                <div className="lg:col-span-2">
                    <TransactionList />
                </div>
            </div>
        </div>
    );
};
