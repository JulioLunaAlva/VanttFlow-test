<<<<<<< HEAD
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";

export const EditTransactionDialog = ({ transaction, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                {/* We pass specific props to adjust form for editing context */}
                <div className="pt-4">
                    <TransactionForm
                        initialData={transaction}
                        onSuccess={() => onOpenChange(false)}
                        submitLabel="Guardar Cambios"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
=======
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";

export const EditTransactionDialog = ({ transaction, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                {/* We pass specific props to adjust form for editing context */}
                <div className="pt-4">
                    <TransactionForm
                        initialData={transaction}
                        onSuccess={() => onOpenChange(false)}
                        submitLabel="Guardar Cambios"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
