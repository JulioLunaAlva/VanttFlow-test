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
        <div className="group relative flex items-center justify-between p-4 rounded-[1.5rem] bg-foreground/5 border border-border/30 hover:border-border/50 hover:bg-muted/10 transition-all duration-300">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={cn(
                    "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110",
                    t.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : t.type === 'expense' 
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                )}>
                    {t.type === 'income' ? <ArrowUpRight size={24} /> :
                        t.type === 'expense' ? <ArrowDownLeft size={24} /> :
                            <ArrowRightLeft size={24} />}
                </div>
                <div className="min-w-0">
                    <p className="font-black text-lg tracking-tight leading-none group-hover:text-primary transition-colors truncate">{t.description}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-2 opacity-60">
                        <span className="shrink-0">{format(parseLocalDateStr(t.date), 'dd MMM', { locale: es })}</span>
                        <span className="shrink-0">•</span>
                        {t.type === 'transfer' ? (
                            <span className="flex items-center gap-1 font-bold text-blue-500 truncate">
                                <span className="truncate">{getAccountName(t.accountId)}</span> <ArrowRightLeft size={10} className="shrink-0" /> <span className="truncate">{getAccountName(t.targetAccountId)}</span>
                            </span>
                        ) : (
                            <span className="truncate">{getAccountName(t.accountId)}</span>
                        )}
                        {t.attachment && (
                            <TransactionImageViewer
                                attachment={t.attachment}
                                trigger={
                                    <button className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer shrink-0 active:scale-95 ml-1">
                                        <ImageIcon size={12} />
                                    </button>
                                }
                            />
                        )}
                        {t.category && (
                            <span
                                className="px-2 py-0.5 rounded-full text-foreground flex items-center gap-1 font-black shrink-0 truncate max-w-[120px]"
                                style={{ backgroundColor: t.category === 'transfer' ? '#3b82f6' : (categories.find(c => c.id === t.category)?.color || '#64748b') }}
                            >
                                {(() => {
                                    if (t.category === 'transfer') return <ArrowRightLeft size={10} className="shrink-0" />;
                                    const cat = categories.find(c => c.id === t.category);
                                    const Icon = Icons[cat?.icon] || Icons.HelpCircle;
                                    return <Icon size={10} className="shrink-0" />;
                                })()}
                                <span className="truncate">{t.category === 'transfer' ? 'Transferencia' : (categories.find(c => c.id === t.category)?.name || 'Otros')}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
                <div className="text-right">
                    <span className={cn(
                        "font-black text-xl tracking-tighter block",
                        t.type === 'income' ? 'text-emerald-500' : t.type === 'expense' ? 'text-foreground' : 'text-blue-500'
                    )}>
                        {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}{formatCurrency(t.amount)}
                    </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                        onClick={() => onEdit && onEdit(t)}
                    >
                        <Edit2 size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
                        onClick={() => handleDelete(t.id)}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
