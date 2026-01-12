import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, CreditCard, Menu, Plus, Zap, BarChart3, Target, CalendarClock, Upload, Tags, PieChart, Settings } from 'lucide-react';
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

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur border-t flex items-center justify-between px-6 z-50 pb-safe">
            {/* Left Side */}
            <NavLink
                to="/"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <LayoutDashboard size={28} strokeWidth={2} />
                <span className="text-[11px] mt-1 font-semibold">Inicio</span>
            </NavLink>

            <NavLink
                to="/transactions"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <Receipt size={28} strokeWidth={2} />
                <span className="text-[11px] mt-1 font-semibold">Movs</span>
            </NavLink>

            {/* Center Action Button */}
            <div id="tour-add" className="relative -top-6">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-background"
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
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <CreditCard size={28} strokeWidth={2} />
                <span className="text-[11px] mt-1 font-semibold">Cuentas</span>
            </NavLink>

            {/* More Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex flex-col items-center justify-center w-14 h-full transition-colors",
                            "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Menu size={28} strokeWidth={2} />
                        <span className="text-[11px] mt-1 font-semibold">Más</span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mb-2">
                    <DropdownMenuLabel>Herramientas Finanzas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/analytics" className="cursor-pointer gap-2"><BarChart3 size={16} /> Analíticas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/subscriptions" className="cursor-pointer gap-2"><Zap size={16} /> Suscripciones</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/budget" className="cursor-pointer gap-2"><PieChart size={16} /> Presupuestos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/goals" className="cursor-pointer gap-2"><Target size={16} /> Metas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link to="/scheduled" className="cursor-pointer gap-2"><CalendarClock size={16} /> Programados</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/import" className="cursor-pointer gap-2"><Upload size={16} /> Importar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/categories" className="cursor-pointer gap-2"><Tags size={16} /> Categorías</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/settings" className="cursor-pointer gap-2"><Settings size={16} /> Configuración</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
