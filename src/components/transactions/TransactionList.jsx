import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { ArrowUpRight, ArrowDownLeft, Trash2, ArrowRightLeft, Image as ImageIcon, Edit2, Search, X, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EditTransactionDialog } from './EditTransactionDialog';
import { CategorySelect } from "@/components/ui/CategorySelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { TransactionImageViewer } from './TransactionImageViewer';
import * as Icons from 'lucide-react';

export const TransactionList = () => {
    const { filteredTransactions, deleteTransaction, accounts, categories } = useFinance();
    const [editingTransaction, setEditingTransaction] = React.useState(null);

    // Filtros
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterCategory, setFilterCategory] = React.useState('');
    const [filterDate, setFilterDate] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    const getAccountName = (id) => accounts.find(a => a.id === id)?.name || 'Desconocida';

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
            deleteTransaction(id);
        }
    };

    // Filter Logic
    const displayedTransactions = filteredTransactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? t.category === filterCategory : true;
        const matchesDate = filterDate ? format(new Date(t.date), 'yyyy-MM-dd') === filterDate : true;
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
                        <p className="text-center text-muted-foreground py-8">
                            {filteredTransactions.length === 0 ? "No hay transacciones este mes." : "No se encontraron resultados con los filtros actuales."}
                        </p>
                    ) : (
                        displayedTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' :
                                        t.type === 'expense' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {t.type === 'income' ? <ArrowUpRight size={20} /> :
                                            t.type === 'expense' ? <ArrowDownLeft size={20} /> :
                                                <ArrowRightLeft size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{t.description}</p>
                                        <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                                            <span>{format(new Date(t.date), 'dd MMM', { locale: es })}</span>
                                            <span>•</span>
                                            {t.type === 'transfer' ? (
                                                <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                                                    {getAccountName(t.accountId)} <ArrowRightLeft size={10} /> {getAccountName(t.targetAccountId)}
                                                </span>
                                            ) : (
                                                <span>{getAccountName(t.accountId)}</span>
                                            )}
                                            {t.attachment && (
                                                <TransactionImageViewer
                                                    attachment={t.attachment}
                                                    trigger={
                                                        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer ml-2 active:scale-95">
                                                            <ImageIcon size={14} />
                                                        </button>
                                                    }
                                                />
                                            )}
                                            {t.category && (
                                                <span
                                                    className="text-[10px] px-2 py-0.5 rounded-full text-white ml-1 flex items-center gap-1"
                                                    style={{ backgroundColor: t.category === 'transfer' ? '#2563eb' : (categories.find(c => c.id === t.category)?.color || '#94a3b8') }}
                                                >
                                                    {(() => {
                                                        if (t.category === 'transfer') return <ArrowRightLeft size={10} />;
                                                        const cat = categories.find(c => c.id === t.category);
                                                        const Icon = Icons[cat?.icon] || Icons.HelpCircle;
                                                        return <Icon size={10} />;
                                                    })()}
                                                    {t.category === 'transfer' ? 'Transferencia' : (categories.find(c => c.id === t.category)?.name || 'Otros')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold ${t.type === 'income' ? 'text-green-600' :
                                        t.type === 'expense' ? 'text-red-600' :
                                            'text-blue-600'
                                        }`}>
                                        {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}{formatCurrency(t.amount)}
                                    </span>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground"
                                            onClick={() => setEditingTransaction(t)}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
