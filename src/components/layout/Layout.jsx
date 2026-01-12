import React from 'react';
import { LayoutDashboard, Receipt, Wallet, Menu, CalendarClock, PieChart, Target, Download, BarChart3, Tags, CreditCard, Zap, Upload, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MonthSelector } from './MonthSelector';
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useFinance } from "@/context/FinanceContext";

const Sidebar = ({ className }) => {
    const { exportData } = useFinance();

    return (
        <div className={`w-64 bg-card border-r h-full flex flex-col ${className}`}>
            <div className="p-6 flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">VanttFlow</h1>
                <div className="ml-auto">
                    <ModeToggle />
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2 flex flex-col">
                <NavLink
                    to="/"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/transactions"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <Receipt size={20} />
                    Transacciones
                </NavLink>
                <NavLink
                    to="/scheduled"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <CalendarClock size={20} />
                    Pagos Programados
                </NavLink>
                <NavLink
                    to="/budget"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <PieChart size={20} />
                    Presupuestos
                </NavLink>
                <NavLink
                    to="/cards"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <CreditCard size={20} />
                    Tarjetas
                </NavLink>
                <NavLink
                    to="/subscriptions"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <Zap size={20} />
                    Suscripciones
                </NavLink>
                <NavLink
                    to="/analytics"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <BarChart3 size={20} />
                    Analíticas
                </NavLink>
                <NavLink
                    to="/goals"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <Target size={20} />
                    Metas
                </NavLink>
                <NavLink
                    to="/reports"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <BarChart3 size={20} />
                    Reportes
                </NavLink>
                <NavLink
                    to="/categories"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <Tags size={20} />
                    Categorías
                </NavLink>
                <NavLink
                    to="/import"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <Upload size={20} />
                    Importar
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <Settings size={20} />
                    Configuración
                </NavLink>

                <div className="pt-4 mt-auto">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={exportData}
                    >
                        <Download size={20} />
                        Exportar CSV
                    </Button>
                </div>
            </nav>
        </div>
    );
};

import { MobileNav } from './MobileNav';
import { AppTour } from '@/components/onboarding/AppTour';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex">
            <AppTour />
            <Sidebar className="hidden md:flex" />

            <div className="flex-1 flex flex-col pb-20 md:pb-0"> {/* Padding bottom for Mobile Nav */}
                <header className="pt-safe border-b bg-card/50 backdrop-blur px-4 flex items-center justify-between md:hidden sticky top-0 z-40 bg-[#050A1F]/80">
                    <div className="flex items-center gap-2 h-14">
                        <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-md" />
                        <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">VanttFlow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                    </div>
                </header>

                <div className="hidden md:flex h-16 border-b bg-card/50 backdrop-blur px-6 items-center justify-between">
                    <h2 className="font-semibold text-lg">VanttFlow</h2>
                    <MonthSelector />
                </div>

                <div className="md:hidden p-4 pb-0">
                    <MonthSelector />
                </div>

                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    {children}
                </main>

                <MobileNav />
            </div>
        </div>
    );
};
