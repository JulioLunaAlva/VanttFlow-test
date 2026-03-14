import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";

export const MonthSelector = () => {
    const { selectedMonth, setSelectedMonth } = useFinance();

    const handlePrevious = () => setSelectedMonth(prev => subMonths(prev, 1));
    const handleNext = () => setSelectedMonth(prev => addMonths(prev, 1));
    const handleToday = () => setSelectedMonth(new Date());

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-card/40 backdrop-blur-xl p-1 rounded-xl border border-border shadow-xl ring-1 ring-black/5 dark:ring-black/20">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    className="h-9 w-9 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
                >
                    <ChevronLeft size={18} />
                </Button>

                <div className="px-4 min-w-[140px] text-center">
                    <span className="text-sm font-semibold tracking-wide capitalize text-foreground/90">
                        {format(selectedMonth, 'MMMM yyyy', { locale: es })}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="h-9 w-9 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
                >
                    <ChevronRight size={18} />
                </Button>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="h-10 px-4 rounded-xl bg-card/40 backdrop-blur-xl border-border hover:bg-accent active:scale-95 transition-all gap-2 text-xs font-bold uppercase tracking-tighter"
            >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                Hoy
            </Button>
        </div>
    );
};
