import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { TrendingDown, TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ForecastWidget = () => {
    const { t } = useTranslation();
    const { getForecast } = useFinance();
    const { user } = useIdentity();
    const forecast = getForecast();
    const currency = user?.currency || 'MXN';

    // Safety levels:
    // Green: Forecast > 20% of current balance (plenty buffer)
    // Yellow: Forecast > 0 but < 20% (tight)
    // Red: Forecast < 0 (Danger)

    // Fallback for divide by zero
    const bufferRatio = forecast.currentBalance > 0
        ? (forecast.forecastBalance / forecast.currentBalance)
        : (forecast.forecastBalance > 0 ? 1 : 0);

    const statusColor = forecast.forecastBalance < 0
        ? "text-red-600 dark:text-red-400"
        : (bufferRatio < 0.2 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400");

    // Instead of full background color, we use subtle borders and a very light tint that respects the theme
    // We use 'bg-card' as base to ensure it matches the theme (dark/light/pink/gamer)
    // We add a colored border-l-4 (left border) to indicate status clearly without overwhelming the card

    const borderClass = forecast.forecastBalance < 0
        ? "border-l-red-500"
        : (bufferRatio < 0.2 ? "border-l-amber-500" : "border-l-emerald-500");

    const tintClass = forecast.forecastBalance < 0
        ? "bg-red-50/50 dark:bg-red-900/10"
        : (bufferRatio < 0.2 ? "bg-amber-50/50 dark:bg-amber-900/10" : "bg-emerald-50/50 dark:bg-emerald-900/10");

    return (
        <Card className={`h-full border-l-[6px] shadow-sm ${borderClass} ${tintClass}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('dashboard.forecast_widget.title')}
                </CardTitle>
                {forecast.forecastBalance < 0 ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <CheckCircle className={`h-4 w-4 ${statusColor}`} />}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className={`text-2xl font-bold ${statusColor}`}>
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: currency }).format(forecast.forecastBalance)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('dashboard.forecast_widget.real_available')}
                        </p>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>{t('dashboard.forecast_widget.current')}</span>
                            <span className="font-medium">{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.currentBalance)}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                            <span className="flex items-center gap-1"><TrendingDown size={12} /> {t('dashboard.forecast_widget.pending_payments')} ({forecast.pendingCount}):</span>
                            <span className="font-medium">-{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.pendingExpenses)}</span>
                        </div>
                        {forecast.pendingIncome > 0 && (
                            <div className="flex justify-between items-center text-emerald-500">
                                <span className="flex items-center gap-1"><TrendingUp size={12} /> {t('dashboard.forecast_widget.expected_income')}</span>
                                <span className="font-medium">+{new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(forecast.pendingIncome)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
