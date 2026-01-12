import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, CreditCard, Menu, Plus, Zap, BarChart3, Target, CalendarClock, Upload, Tags, PieChart, Settings, CandlestickChart } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/TransactionForm';

export const MobileNav = () => {
    const location = useLocation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const closeMore = () => setIsMoreOpen(false);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur border-t flex items-center justify-between px-6 z-50 pb-safe">
            {/* Left Side */}
            <NavLink
                to="/"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {({ isActive }) => (
                    <>
                        <LayoutDashboard size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">Inicio</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/transactions"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {({ isActive }) => (
                    <>
                        <Receipt size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">Movs</span>
                    </>
                )}
            </NavLink>

            {/* Center Action Button */}
            <div id="tour-add" className="relative -top-6">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-background active:scale-95 transition-transform"
                        >
                            <Plus size={36} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Nueva Transacción</h2>
                        <TransactionForm onSuccess={() => setIsAddOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Right Side */}
            <NavLink
                to="/cards"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {({ isActive }) => (
                    <>
                        <CreditCard size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">Cuentas</span>
                    </>
                )}
            </NavLink>

            {/* More Menu */}
            <DropdownMenu open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex flex-col items-center justify-center w-14 h-full transition-colors outline-none",
                            isMoreOpen ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Menu size={28} strokeWidth={isMoreOpen ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">Más</span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-64 mb-4 bg-card/90 backdrop-blur-xl border-slate-700/50 shadow-2xl p-2 rounded-2xl animate-in slide-in-from-bottom-2 duration-200"
                >
                    <div className="px-2 py-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">Herramientas Finanzas</span>
                    </div>

                    <div className="grid gap-1">
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform"><BarChart3 size={18} /></div>
                                <span className="font-medium">Analíticas</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/market" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform"><CandlestickChart size={18} /></div>
                                <span className="font-medium">Mercado</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/subscriptions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform"><Zap size={18} /></div>
                                <span className="font-medium">Suscripciones</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/budget" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform"><PieChart size={18} /></div>
                                <span className="font-medium">Presupuestos</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/goals" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500 group-hover:scale-110 transition-transform"><Target size={18} /></div>
                                <span className="font-medium">Metas</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-slate-700/30" />

                    <div className="px-2 py-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">Gestión</span>
                    </div>

                    <div className="grid gap-1">
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/scheduled" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform"><CalendarClock size={18} /></div>
                                <span className="font-medium">Pagos Programados</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/import" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform"><Upload size={18} /></div>
                                <span className="font-medium">Importar</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild onClick={closeMore}>
                            <Link to="/categories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform"><Tags size={18} /></div>
                                <span className="font-medium">Categorías</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-slate-700/30" />

                    <DropdownMenuItem asChild onClick={closeMore}>
                        <Link to="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors group">
                            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400 group-hover:scale-110 transition-transform"><Settings size={18} /></div>
                            <span className="font-medium">Configuración</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
