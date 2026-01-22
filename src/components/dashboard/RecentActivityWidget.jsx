import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
export const RecentActivityWidget = () => {
    const { filteredTransactions, categories } = useFinance();
    const navigate = useNavigate();
    // Get last 5 transactions (assuming filteredTransactions is sorted desc, which it usually is from context/backend, if not we sort)
    // Actually FinanceContext sorts them? Let's assume yes or sort here.
    const recent = [...filteredTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Actividad Reciente</CardTitle>
                <Button variant="link" className="text-xs h-auto p-0" onClick={() => navigate('/transactions')}>
                    Ver todo
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {recent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-40">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                                <ArrowUpRight size={20} className="rotate-45" />
                            </div>
                            <p className="text-sm font-medium">Sin actividad este mes</p>
                            <p className="text-xs text-muted-foreground">Tus últimas 5 transacciones aparecerán aquí.</p>
                        </div>
                    ) : (
                        recent.map(t => (
                            <div key={t.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' :
                                        t.type === 'expense' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {t.type === 'income' ? <ArrowUpRight size={14} /> :
                                            t.type === 'expense' ? <ArrowDownLeft size={14} /> :
                                                <ArrowRightLeft size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium line-clamp-1">{t.description}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            {format(new Date(t.date), 'dd MMM', { locale: es })}
                                            {t.category && (
                                                <span
                                                    className="w-2 h-2 rounded-full inline-block ml-1"
                                                    style={{ backgroundColor: categories.find(c => c.id === t.category)?.color || '#ccc' }}
                                                />
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' :
                                    t.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                                    {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};