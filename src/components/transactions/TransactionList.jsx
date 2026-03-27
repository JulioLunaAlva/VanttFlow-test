import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { ArrowUpRight, ArrowDownLeft, Trash2, ArrowRightLeft, Image as ImageIcon, Edit2, Search, X, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn, parseLocalDateStr } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EditTransactionDialog } from './EditTransactionDialog';
import { CategorySelect } from "@/components/ui/CategorySelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { TransactionImageViewer } from './TransactionImageViewer';
import * as Icons from 'lucide-react';

import { TransactionItem } from './TransactionItem';

export const TransactionList = () => {
    const { filteredTransactions, accounts, categories, formatCurrency } = useFinance();
    const [editingTransaction, setEditingTransaction] = React.useState(null);

    // Filtros
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterCategory, setFilterCategory] = React.useState('');
    const [filterDate, setFilterDate] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);

    const getAccountName = (id) => accounts.find(a => a.id === id)?.name || 'Desconocida';

    // Filter Logic
    const displayedTransactions = filteredTransactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? t.category === filterCategory : true;
        const matchesDate = filterDate ? format(parseLocalDateStr(t.date), 'yyyy-MM-dd') === filterDate : true;
        return matchesSearch && matchesCategory && matchesDate;
    });

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle>Historial del Mes</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={showFilters ? "bg-accent text-accent-foreground" : ""}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} className="mr-2" />
                        Filtros
                    </Button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 animate-in slide-in-from-top-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-8 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="h-9">
                            <CategorySelect
                                categories={categories}
                                value={filterCategory}
                                onChange={setFilterCategory}
                                placeholder="Todas las categorías"
                            />
                        </div>
                        <div className="relative flex gap-2">
                            <DatePicker
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="h-9"
                                placeholder="Fecha exacta"
                            />
                            {(searchTerm || filterCategory || filterDate) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 shrink-0"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterCategory('');
                                        setFilterDate('');
                                    }}
                                    title="Limpiar filtros"
                                >
                                    <X size={16} />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayedTransactions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8 font-bold text-sm">
                            {filteredTransactions.length === 0 ? "No hay transacciones este mes." : "No se encontraron resultados con los filtros actuales."}
                        </p>
                    ) : (
                        displayedTransactions.map((t) => (
                            <TransactionItem 
                                key={t.id} 
                                transaction={t} 
                                onEdit={(tx) => setEditingTransaction(tx)}
                            />
                        ))
                    )}
                </div>
            </CardContent>

            {editingTransaction && (
                <EditTransactionDialog
                    transaction={editingTransaction}
                    open={!!editingTransaction}
                    onOpenChange={(open) => !open && setEditingTransaction(null)}
                />
            )}
        </Card>
    );
};
