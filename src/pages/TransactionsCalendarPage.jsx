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
    eachDayOfInterval
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

    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    const calendarDays = useMemo(() => {
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [startTime, endTime]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between glass-premium p-10 rounded-[3rem] border-border/50 mb-8 group relative overflow-hidden active:scale-95 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter capitalize text-foreground drop-shadow-2xl">
                    {format(currentMonth, 'MMMM yyyy', { locale })}
                </h2>
                <div className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                    {t('common.calendar_view') || 'Vista de Calendario'}
                </div>
            </div>
            <div className="flex items-center gap-4 mt-6 md:mt-0 relative z-10">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={prevMonth} 
                    className="glass-premium border-border/50 hover:border-primary/50 bg-foreground/5 text-foreground h-14 w-14 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all duration-500 group/btn"
                >
                    <ChevronLeft size={24} className="group-hover/btn:-translate-x-1 transition-transform" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={nextMonth} 
                    className="glass-premium border-border/50 hover:border-primary/50 bg-foreground/5 text-foreground h-14 w-14 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all duration-500 group/btn"
                >
                    <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
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
                <div key={i} className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40 py-4 drop-shadow-sm">
                    {format(addDays(date, i), 'eee', { locale })}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-4 px-2">{days}</div>;
    };

    // Calendar grid
    const renderCells = () => {
        return (
            <div className="glass-premium rounded-[3rem] overflow-hidden border-border/50 mb-10 shadow-3xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />
                <div className="grid grid-cols-7 relative z-10">
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
                                "relative min-h-[100px] xs:min-h-[120px] p-4 bg-foreground/[0.02] transition-all duration-500 cursor-pointer select-none group border-r border-b border-border/10 last:border-r-0 hover:bg-foreground/[0.05]",
                                !isCurrentMonth && "bg-foreground/[0.05] opacity-30 hover:opacity-50",
                                isSelected && "bg-primary/10 !opacity-100 z-10 shadow-[inset_0_0_20px_rgba(var(--primary),0.2)]",
                                isToday && !isSelected && "bg-foreground/[0.08]"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-black tracking-tighter drop-shadow-md transition-all duration-500 text-foreground",
                                isToday && "text-primary px-2.5 py-1 rounded-xl bg-primary/10 shadow-glow",
                                !isCurrentMonth && "opacity-50",
                                isSelected && "scale-125 inline-block"
                            )}>
                                {format(day, 'd')}
                            </span>

                            {dayData && (
                                <div className="mt-4 flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-1">
                                        {dayData.income > 0 && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow animate-pulse" />
                                        )}
                                        {dayData.expense > 0 && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-glow" />
                                        )}
                                        {dayData.transfer > 0 && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shadow-glow" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 mt-auto">
                                        {dayData.income > 0 && (
                                            <span className="text-[9px] font-black text-emerald-500/80 tracking-tighter hidden sm:inline truncate">
                                                +{formatCurrency(dayData.income, { compact: true })}
                                            </span>
                                        )}
                                        {dayData.expense > 0 && (
                                            <span className="text-[9px] font-black text-rose-500/80 tracking-tighter hidden sm:inline truncate">
                                                -{formatCurrency(dayData.expense, { compact: true })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Active indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                            )}
                            
                            {/* Hover effect light */}
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                        </div>
                    );
                })}
            </div>
        </div>
        );
    };

    return (
        <div className="space-y-6 pb-24 md:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4">
            {renderHeader()}
            
            <div className="bg-transparent">
                <div className="p-0">
                    {renderDaysOfWeek()}
                    {renderCells()}
                </div>
            </div>

            {/* Selected Day Details */}
            <div className="space-y-6 pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <h3 className="text-3xl font-black tracking-tighter capitalize text-foreground drop-shadow-lg">
                        {isSameDay(selectedDate, new Date()) ? t('common.today') : format(selectedDate, 'eeee d MMMM', { locale })}
                    </h3>
                    <div className="flex gap-4">
                        {selectedDaySummary.income > 0 && (
                            <div className="glass-premium bg-emerald-500/10 border-emerald-500/20 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-glow">
                                <ArrowUpCircle size={18} className="text-emerald-500" />
                                <span className="text-sm font-black text-emerald-500 tracking-tighter">{formatCurrency(selectedDaySummary.income)}</span>
                            </div>
                        )}
                        {selectedDaySummary.expense > 0 && (
                            <div className="glass-premium bg-rose-500/10 border-rose-500/20 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-glow">
                                <ArrowDownCircle size={18} className="text-rose-500" />
                                <span className="text-sm font-black text-rose-500 tracking-tighter">{formatCurrency(selectedDaySummary.expense)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 px-2">
                    {selectedDateTransactions.length > 0 ? (
                        selectedDateTransactions.map(tx => (
                            <TransactionItem 
                                key={tx.id} 
                                transaction={tx} 
                                onEdit={(t) => setEditingTransaction(t)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 glass-premium rounded-[3rem] border-2 border-dashed border-border/30 mt-4 active:scale-98 transition-all duration-500 flex flex-col items-center justify-center group overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="glass-premium p-10 rounded-[2.5rem] mb-8 shadow-2xl border-border/50 animate-bounce-slow inline-block bg-primary/5 relative z-10">
                                <CalendarIcon className="mx-auto h-16 w-16 text-foreground/20 drop-shadow-glow" />
                            </div>
                            <div className="text-center max-w-sm relative z-10 px-6">
                                <h3 className="text-2xl font-black tracking-tighter text-foreground/60 mb-2 drop-shadow-2xl">{t('transactions.no_movements') || 'Sin movimientos este día'}</h3>
                                <p className="text-foreground/40 font-black uppercase tracking-[0.2em] text-[10px]">
                                    Selecciona otro día para ver su actividad
                                </p>
                            </div>
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
