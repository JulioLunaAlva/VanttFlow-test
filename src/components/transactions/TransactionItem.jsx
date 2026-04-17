import React from 'react';
import { useFinance } from "@/context/FinanceContext";
import { ArrowUpRight, ArrowDownLeft, Trash2, ArrowRightLeft, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn, parseLocalDateStr } from '@/lib/utils';
import { TransactionImageViewer } from './TransactionImageViewer';
import * as Icons from 'lucide-react';

export const TransactionItem = ({ transaction, onEdit }) => {
    const { deleteTransaction, accounts, categories, formatCurrency } = useFinance();

    const t = transaction;
    const getAccountName = (id) => accounts.find(a => a.id === id)?.name || 'Desconocida';

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
            deleteTransaction(id);
        }
    };

    return (
        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                    t.type === 'income' 
                        ? 'bg-primary/10 text-primary' 
                        : t.type === 'expense' 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-blue-500/10 text-blue-500'
                }`}>
                    {t.type === 'income' ? <ArrowUpRight size={20} /> :
                        t.type === 'expense' ? <ArrowDownLeft size={20} /> :
                            <ArrowRightLeft size={20} />}
                </div>
                <div>
                    <p className="font-bold text-sm tracking-tight">{t.description}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground font-medium">
                        <span>{format(parseLocalDateStr(t.date), 'dd MMM', { locale: es })}</span>
                        <span>•</span>
                        {t.type === 'transfer' ? (
                            <span className="flex items-center gap-1 font-bold text-blue-500">
                                {getAccountName(t.accountId)} <ArrowRightLeft size={10} /> {getAccountName(t.targetAccountId)}
                            </span>
                        ) : (
                            <span>{getAccountName(t.accountId)}</span>
                        )}
                        {t.attachment && (
                            <TransactionImageViewer
                                attachment={t.attachment}
                                trigger={
                                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer ml-1 active:scale-95">
                                        <ImageIcon size={14} />
                                    </button>
                                }
                            />
                        )}
                        {t.category && (
                            <span
                                className="text-[10px] px-2 py-0.5 rounded-full text-white ml-1 flex items-center gap-1 font-black"
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
            <div className="flex items-center gap-3">
                <span className={`font-black text-sm ${
                    t.type === 'income' 
                        ? 'text-primary' 
                        : t.type === 'expense' 
                            ? 'text-destructive' 
                            : 'text-blue-500'
                }`}>
                    {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}{formatCurrency(t.amount)}
                </span>
                <div className="flex gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onEdit && onEdit(t)}
                    >
                        <Edit2 size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(t.id)}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
