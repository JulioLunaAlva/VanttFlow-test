import React from 'react';
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";

export const TransactionsPage = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Transacciones</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <TransactionForm />
                </div>
                <div className="lg:col-span-2">
                    <TransactionList />
                </div>
            </div>
        </div>
    );
};
