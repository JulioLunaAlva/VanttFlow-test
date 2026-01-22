<<<<<<< HEAD
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { format, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

export const PendingPaymentsWidget = () => {
    const { getScheduledForMonth, selectedMonth, processScheduledPayment } = useFinance();
    const scheduledItems = getScheduledForMonth(selectedMonth);

    // Filter pending/active items for this month summary
    const pendingItems = scheduledItems.filter(i => i.state === 'pending' && i.status === 'active').sort((a, b) => a.dayOfMonth - b.dayOfMonth);

    if (scheduledItems.length === 0) return null;

    return (
        <Card className="col-span-full lg:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Pagos Programados ({format(selectedMonth, 'MMMM')})</span>
                    <span className="text-xs font-normal bg-muted px-2 py-1 rounded-full">{pendingItems.length} pendientes</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {pendingItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-green-600">
                            <Check className="h-8 w-8 mb-2 opacity-50" />
                            <p>¡Todo al día este mes!</p>
                        </div>
                    )}
                    {pendingItems.slice(0, 5).map(item => {
                        const isLate = isPast(item.currentMonthDate) && !isToday(item.currentMonthDate);

                        return (
                            <div key={item.id} className="flex items-center justify-between p-2 border rounded-md bg-card shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${isLate ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {isLate ? <AlertCircle size={16} /> : <Clock size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(item.currentMonthDate, 'd MMM', { locale: es })} • {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        title="Marcar Pagado"
                                        onClick={() => processScheduledPayment(item, 'pay')}
                                    >
                                        <Check size={14} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-muted-foreground hover:text-slate-600"
                                        title="Omitir este mes"
                                        onClick={() => processScheduledPayment(item, 'skip')}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
=======
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { format, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

export const PendingPaymentsWidget = () => {
    const { getScheduledForMonth, selectedMonth, processScheduledPayment } = useFinance();
    const scheduledItems = getScheduledForMonth(selectedMonth);

    // Filter pending/active items for this month summary
    const pendingItems = scheduledItems.filter(i => i.state === 'pending' && i.status === 'active').sort((a, b) => a.dayOfMonth - b.dayOfMonth);

    if (scheduledItems.length === 0) return null;

    return (
        <Card className="col-span-full lg:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Pagos Programados ({format(selectedMonth, 'MMMM')})</span>
                    <span className="text-xs font-normal bg-muted px-2 py-1 rounded-full">{pendingItems.length} pendientes</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {pendingItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-green-600">
                            <Check className="h-8 w-8 mb-2 opacity-50" />
                            <p>¡Todo al día este mes!</p>
                        </div>
                    )}
                    {pendingItems.slice(0, 5).map(item => {
                        const isLate = isPast(item.currentMonthDate) && !isToday(item.currentMonthDate);

                        return (
                            <div key={item.id} className="flex items-center justify-between p-2 border rounded-md bg-card shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${isLate ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {isLate ? <AlertCircle size={16} /> : <Clock size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(item.currentMonthDate, 'd MMM', { locale: es })} • {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        title="Marcar Pagado"
                                        onClick={() => processScheduledPayment(item, 'pay')}
                                    >
                                        <Check size={14} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-muted-foreground hover:text-slate-600"
                                        title="Omitir este mes"
                                        onClick={() => processScheduledPayment(item, 'skip')}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
