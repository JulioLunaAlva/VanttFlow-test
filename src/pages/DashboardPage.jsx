import React, { useState, useEffect } from 'react';
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { BalanceBarChart } from "@/components/dashboard/BalanceBarChart";
import { PendingPaymentsWidget } from '@/components/dashboard/PendingPaymentsWidget';
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget';
import { GoalsSummaryWidget } from '@/components/dashboard/GoalsSummaryWidget';
import { Button } from "@/components/ui/button";
import { RotateCcw, GripHorizontal, Check, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFinance } from '@/context/FinanceContext';

const WelcomeHeader = () => (
    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 rounded-3xl backdrop-blur-xl animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-4xl">🚀</span>
            </div>
            <div className="text-center md:text-left space-y-2">
                <h3 className="text-2xl font-bold">¡Bienvenido a VanttFlow!</h3>
                <p className="text-slate-400 max-w-lg">
                    Tu camino hacia la libertad financiera comienza hoy. Empieza registrando un gasto o ingreso para ver cómo cobran vida tus gráficas.
                </p>
            </div>
        </div>
    </div>
);

const WIDGETS_CONFIG = [
    { id: 'balance', component: BalanceBarChart, label: 'Balance General', className: 'lg:col-span-4 md:col-span-2 h-[350px]' },
    { id: 'goals', component: GoalsSummaryWidget, label: 'Progreso de Metas', className: 'lg:col-span-3 md:col-span-2 h-[350px]' },
    { id: 'activity', component: RecentActivityWidget, label: 'Actividad Reciente', className: 'lg:col-span-3 md:col-span-2 h-[350px]' },
    { id: 'expenses', component: ExpensePieChart, label: 'Gastos por Categoría', className: 'lg:col-span-4 md:col-span-2 h-[350px]' },
    { id: 'pending', component: PendingPaymentsWidget, label: 'Pagos Pendientes', className: 'lg:col-span-7 md:col-span-2' }
];

export const DashboardPage = () => {
    const { transactions } = useFinance();
    const isNewUser = transactions.length === 0;
    const [order, setOrder] = useState(() => {
        const saved = localStorage.getItem('dashboard_layout');
        return saved ? JSON.parse(saved) : WIDGETS_CONFIG.map(w => w.id);
    });

    // Validar si hay nuevos widgets que no estan en el orden guardado
    useEffect(() => {
        const currentIds = new Set(WIDGETS_CONFIG.map(w => w.id));
        const savedIds = new Set(order);

        // Si hay discrepancia (nuevos widgets), resetear/mezclar
        if (order.length !== WIDGETS_CONFIG.length || !order.every(id => currentIds.has(id))) {
            const validSaved = order.filter(id => currentIds.has(id));
            const newItems = WIDGETS_CONFIG.filter(w => !savedIds.has(w.id)).map(w => w.id);
            setOrder([...validSaved, ...newItems]);
        }
    }, []);

    const saveOrder = (newOrder) => {
        setOrder(newOrder);
        localStorage.setItem('dashboard_layout', JSON.stringify(newOrder));
    };

    const resetLayout = () => {
        const defaultOrder = WIDGETS_CONFIG.map(w => w.id);
        saveOrder(defaultOrder);
        toast.info("Diseño restablecido a valores por defecto");
    };

    const [isEditMode, setIsEditMode] = useState(false);

    // Drag & Drop Handlers
    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, index) => {
        if (!isEditMode) {
            e.preventDefault();
            return;
        }
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = "move";
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        if (draggedItem === null) return;
        if (draggedItem === index) return;

        // Reorder on hover logic for smoother feel
        const newOrder = [...order];
        const item = newOrder[draggedItem];
        newOrder.splice(draggedItem, 1);
        newOrder.splice(index, 0, item);

        setDraggedItem(index);
        saveOrder(newOrder);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0">
            <div className="flex justify-between items-center bg-card/50 p-4 rounded-xl border backdrop-blur">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isEditMode ? "Arrastra los cuadros para reordenar" : "Resumen de tu actividad financiera"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isEditMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsEditMode(!isEditMode)}
                        className="gap-2"
                    >
                        {isEditMode ? <Check size={16} /> : <Settings2 size={16} />}
                        {isEditMode ? "Terminar Edición" : "Personalizar"}
                    </Button>
                    {isEditMode && (
                        <Button variant="ghost" size="icon" onClick={resetLayout} title="Restablecer original">
                            <RotateCcw size={16} />
                        </Button>
                    )}
                </div>
            </div>

            {isNewUser && <WelcomeHeader />}

            <SummaryCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {order.map((widgetId, index) => {
                    const widgetConfig = WIDGETS_CONFIG.find(w => w.id === widgetId);
                    if (!widgetConfig) return null;
                    const WidgetComponent = widgetConfig.component;

                    return (
                        <div
                            key={widgetId}
                            draggable={isEditMode}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            id={widgetId === 'goals' ? 'tour-goals' : widgetId === 'balance' ? 'tour-analytics' : undefined}
                            className={`
                                ${widgetConfig.className} 
                                relative group transition-all duration-200 ease-in-out rounded-xl
                                ${isEditMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-primary ring-offset-2 bg-card z-10' : ''}
                                ${draggedItem === index ? 'opacity-50' : ''}
                            `}
                        >
                            {/* Edit Overlay / Handle - Visible only in Edit Mode */}
                            {isEditMode && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-50 border-2 border-dashed border-primary/50 pointer-events-none">
                                    <div className="bg-background shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium animate-in fade-in zoom-in">
                                        <GripHorizontal size={16} />
                                        Mover {widgetConfig.label}
                                    </div>
                                </div>
                            )}

                            {/* Block interaction with charts while editing to prevent conflicts */}
                            <div className={isEditMode ? "opacity-40 blur-sm scale-95 transition-all" : "h-full"}>
                                <WidgetComponent />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
