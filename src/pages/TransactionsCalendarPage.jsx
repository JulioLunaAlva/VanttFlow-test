import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isSameDay, 
    addDays, 
    eachDayOfInterval,
    parseISO,
    isEqual
} from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    ChevronLeft, 
    ChevronRight, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    Calendar as CalendarIcon,
    Plus
} from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { cn, parseLocalDateStr } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { EditTransactionDialog } from '@/components/transactions/EditTransactionDialog';

export const TransactionsCalendarPage = () => {
    const { t, i18n } = useTranslation();
    const { transactions, formatCurrency } = useFinance();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingTransaction, setEditingTransaction] = useState(null);

    const locale = i18n.language === 'es' ? es : undefined;

    // Navigation
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Calendar logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = useMemo(() => {
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [startDate, endDate]);

    // Group transactions by date for the calendar view
    const transactionsByDate = useMemo(() => {
        const grouped = {};
        transactions.forEach(tx => {
            if (!tx.date) return;
            const dateStr = format(parseLocalDateStr(tx.date), 'yyyy-MM-dd');
            if (!grouped[dateStr]) grouped[dateStr] = { income: 0, expense: 0, transfer: 0, items: [] };
            
            if (tx.type === 'income') {
                grouped[dateStr].income += Number(tx.amount);
            } else if (tx.type === 'expense') {
                grouped[dateStr].expense += Number(tx.amount);
            } else if (tx.type === 'transfer') {
                grouped[dateStr].transfer += Number(tx.amount);
            }
            grouped[tx.date.includes('T') ? format(parseLocalDateStr(tx.date), 'yyyy-MM-dd') : tx.date].items.push(tx);
        });
        return grouped;
    }, [transactions]);

    const selectedDateTransactions = useMemo(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        return transactionsByDate[dateStr]?.items || [];
    }, [selectedDate, transactionsByDate]);

    const selectedDaySummary = useMemo(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        return transactionsByDate[dateStr] || { income: 0, expense: 0 };
    }, [selectedDate, transactionsByDate]);

    // Header component
    const renderHeader = () => (
        <div className="flex items-center justify-between glass-card p-6 border-white/10 mb-8">
            <div className="flex flex-col">
                <h2 className="text-4xl font-black tracking-tighter capitalize text-foreground">
                    {format(currentMonth, 'MMMM yyyy', { locale })}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">
                    {t('common.calendar_view') || 'Vista de Calendario'}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-2xl h-11 w-11 shadow-lg shadow-black/5 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <ChevronLeft size={22} />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-2xl h-11 w-11 shadow-lg shadow-black/5 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <ChevronRight size={22} />
                </Button>
            </div>
        </div>
    );

    // Days of week header
    const renderDaysOfWeek = () => {
        const days = [];
        const date = startOfWeek(new Date());
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 py-2">
                    {format(addDays(date, i), 'eee', { locale })}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    // Calendar grid
    const renderCells = () => {
        return (
            <div className="glass-premium rounded-[2rem] overflow-hidden border-white/10 mb-8 shadow-2xl card-glow">
                <div className="grid grid-cols-7">
                    {calendarDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayData = transactionsByDate[dateStr];
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            className={cn(
                                "relative min-h-[80px] xs:min-h-[100px] p-2 bg-background/40 transition-all cursor-pointer select-none group border-r border-b border-border/10 last:border-r-0",
                                !isCurrentMonth && "bg-muted/5 opacity-10",
                                isSelected && "bg-primary/10 ring-2 ring-inset ring-primary/40 rounded-xl z-10",
                                isToday && !isSelected && "bg-accent/10"
                            )}
                        >
                            <span className={cn(
                                "text-xs font-bold",
                                isToday && "text-primary px-1.5 py-0.5 rounded-full bg-primary/10",
                                !isCurrentMonth && "text-muted-foreground"
                            )}>
                                {format(day, 'd')}
                            </span>

                            {dayData && (
                                <div className="mt-auto flex flex-col gap-1">
                                    <div className="flex flex-wrap gap-0.5">
                                        {dayData.income > 0 && (
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                                        )}
                                        {dayData.expense > 0 && (
                                            <div className="w-1 h-1 rounded-full bg-destructive shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
                                        )}
                                        {dayData.transfer > 0 && (
                                            <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        {dayData.income > 0 && (
                                            <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 hidden xs:inline">
                                                +{formatCurrency(dayData.income, { compact: true })}
                                            </span>
                                        )}
                                        {dayData.expense > 0 && (
                                            <span className="text-[8px] font-black text-destructive hidden xs:inline">
                                                -{formatCurrency(dayData.expense, { compact: true })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Active indicator */}
                            {isSelected && (
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-24 md:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4">
            {renderHeader()}
            
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                    {renderDaysOfWeek()}
                    {renderCells()}
                </CardContent>
            </Card>

            {/* Selected Day Details */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-black tracking-tight capitalize">
                        {isSameDay(selectedDate, new Date()) ? t('common.today') : format(selectedDate, 'eeee d MMMM', { locale })}
                    </h3>
                    <div className="flex gap-4">
                        {selectedDaySummary.income > 0 && (
                            <div className="flex items-center gap-1.5">
                                <ArrowUpCircle size={14} className="text-emerald-500" />
                                <span className="text-xs font-black text-emerald-600">{formatCurrency(selectedDaySummary.income)}</span>
                            </div>
                        )}
                        {selectedDaySummary.expense > 0 && (
                            <div className="flex items-center gap-1.5">
                                <ArrowDownCircle size={14} className="text-destructive" />
                                <span className="text-xs font-black text-destructive">{formatCurrency(selectedDaySummary.expense)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {selectedDateTransactions.length > 0 ? (
                        selectedDateTransactions.map(tx => (
                            <TransactionItem 
                                key={tx.id} 
                                transaction={tx} 
                                onEdit={(t) => setEditingTransaction(t)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-[2rem] border border-dashed border-border/60">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <CalendarIcon className="text-muted-foreground/40" size={24} />
                            </div>
                            <p className="text-sm font-bold text-muted-foreground/60">{t('transactions.no_movements') || 'Sin movimientos este día'}</p>
                        </div>
                    )}
                </div>
            </div>

            {editingTransaction && (
                <EditTransactionDialog
                    transaction={editingTransaction}
                    open={!!editingTransaction}
                    onOpenChange={(open) => !open && setEditingTransaction(null)}
                />
            )}
        </div>
    );
};
