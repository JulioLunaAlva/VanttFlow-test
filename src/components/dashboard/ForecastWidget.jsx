import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { TrendingDown, TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export const ForecastWidget = () => {
    const { getForecast } = useFinance();
    const forecast = getForecast();

    // Safety levels:
    // Green: Forecast > 20% of current balance (plenty buffer)
    // Yellow: Forecast > 0 but < 20% (tight)
    // Red: Forecast < 0 (Danger)

    // Fallback for divide by zero
    const bufferRatio = forecast.currentBalance > 0
        ? (forecast.forecastBalance / forecast.currentBalance)
        : (forecast.forecastBalance > 0 ? 1 : 0);

    const statusColor = forecast.forecastBalance < 0
        ? "text-red-500"
        : (bufferRatio < 0.2 ? "text-yellow-500" : "text-emerald-500");

    const bgColor = forecast.forecastBalance < 0
        ? "bg-red-50 dark:bg-red-900/20"
        : (bufferRatio < 0.2 ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-emerald-50 dark:bg-emerald-900/20");

    const borderColor = forecast.forecastBalance < 0
        ? "border-red-200 dark:border-red-900/50"
        : (bufferRatio < 0.2 ? "border-yellow-200 dark:border-yellow-900/50" : "border-emerald-200 dark:border-emerald-900/50");

    return (
        <Card className={`h-full border-2 ${borderColor} ${bgColor} transition-colors duration-500`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Proyección Fin de Mes
                </CardTitle>
                {forecast.forecastBalance < 0 ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className={`text-2xl font-bold ${statusColor}`}>
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(forecast.forecastBalance)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Saldo real disponible
                        </p>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Saldo actual total:</span>
                            <span className="font-medium">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(forecast.currentBalance)}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                            <span className="flex items-center gap-1"><TrendingDown size={12} /> Pagos pendientes ({forecast.pendingCount}):</span>
                            <span className="font-medium">-{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(forecast.pendingExpenses)}</span>
                        </div>
                        {forecast.pendingIncome > 0 && (
                            <div className="flex justify-between items-center text-emerald-500">
                                <span className="flex items-center gap-1"><TrendingUp size={12} /> Ingresos esperados:</span>
                                <span className="font-medium">+{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(forecast.pendingIncome)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
