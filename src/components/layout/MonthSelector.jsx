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

    return (
        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-md border shadow-sm">
            <Button variant="ghost" size="icon" onClick={handlePrevious} className="h-8 w-8">
                <ChevronLeft size={16} />
            </Button>
            <span className="min-w-[120px] text-center font-medium capitalize">
                {format(selectedMonth, 'MMMM yyyy', { locale: es })}
            </span>
            <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                <ChevronRight size={16} />
            </Button>
        </div>
    );
};
