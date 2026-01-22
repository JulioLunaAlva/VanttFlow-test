<<<<<<< HEAD
import React from 'react';
import { LayoutDashboard, Receipt, Wallet, Menu, CalendarClock, PieChart, Target, Download, BarChart3, Tags, CreditCard, Zap, Upload, Settings, ChevronRight, CandlestickChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MonthSelector } from './MonthSelector';
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useFinance } from "@/context/FinanceContext";
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { SpiritPet } from '@/components/gamification/SpiritPet';
import { MobileNav } from './MobileNav';
import { AppTour } from '@/components/onboarding/AppTour';

import { useIdentity } from "@/context/IdentityContext";

const Sidebar = ({ className }) => {
    const { exportData } = useFinance();
    const { user } = useIdentity();

    return (
        <div className={cn(
            "w-72 bg-card border-r h-full flex flex-col relative overflow-hidden transition-all duration-300",
            className
        )}>
            {/* Premium Sidebar Background - Subtle Gradient Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-40 -right-20 w-48 h-48 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="p-8 pb-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group/logo">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl relative z-10 shadow-lg border border-white/10" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                            VanttFlow
                        </h1>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 -mt-1">Financial Spirit</span>
                    </div>
                </div>
                <ModeToggle id="tour-theme-toggle-desktop" />
            </div>

            {/* Quick User Intro */}
            <div className="px-8 pb-6 relative z-10">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-black text-primary uppercase">
                            {user?.name?.charAt(0) || 'V'}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-foreground truncate">Hola, {user?.name?.split(' ')[0] || 'Usuario'}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Miembro Pro</p>
                    </div>
                </div>
            </div>

            {/* Premium Gamification Section in Sidebar */}
            <div className="px-6 mb-8 relative z-10">
                <div className="p-5 rounded-3xl bg-muted/30 border border-border/40 backdrop-blur-sm group hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
                            <SpiritPet size="sm" showBubble={false} className="scale-90 relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Compañero Activo</span>
                            <span className="text-xs font-black text-foreground">Sincronizado</span>
                        </div>
                    </div>
                    <LevelProgress />
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Principal</p>
                <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
                <SidebarLink to="/transactions" icon={Receipt} label="Transacciones" id="tour-transactions-nav" />
                <SidebarLink to="/analytics" icon={BarChart3} label="Analíticas" />
                <SidebarLink to="/market" icon={CandlestickChart} label="Mercado" />

                <div className="h-px bg-border/40 mx-4 my-4" />

                <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Herramientas</p>
                <SidebarLink to="/budget" icon={PieChart} label="Presupuestos" />
                <SidebarLink to="/goals" icon={Target} label="Metas" />
                <SidebarLink to="/scheduled" icon={CalendarClock} label="Pagos Programados" />
                <SidebarLink to="/cards" icon={CreditCard} label="Tarjetas" />
                <SidebarLink to="/subscriptions" icon={Zap} label="Suscripciones" />

                <div className="h-px bg-border/40 mx-4 my-4" />

                <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Sistema</p>
                <SidebarLink to="/categories" icon={Tags} label="Categorías" />
                <SidebarLink to="/import" icon={Upload} label="Importar" />
                <SidebarLink to="/settings" icon={Settings} label="Configuración" />

                <div className="mt-8 mb-6 px-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-300 group/export"
                        onClick={exportData}
                    >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover/export:bg-primary/20 transition-colors">
                            <Download size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Exportar CSV</span>
                    </Button>
                </div>
            </nav>

            <div className="p-6 border-t border-border/40 relative z-10 flex items-center justify-between text-muted-foreground/40">
                <span className="text-[10px] font-black uppercase tracking-widest">VanttFlow v1.2</span>
                <span className="text-[10px] font-black uppercase tracking-widest italic">Beta</span>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon: Icon, label, id }) => (
    <NavLink
        to={to}
        id={id}
        className={({ isActive }) => cn(
            "flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
            isActive
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(var(--primary),0.3)] scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
    >
        <div className="flex items-center gap-3">
            <Icon size={18} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                "group-[.active]:text-primary-foreground"
            )} />
            <span className="tracking-tight">{label}</span>
        </div>
        {/* Subtle indicator for active state */}
        <div className={cn(
            "h-1.5 w-1.5 rounded-full bg-white transition-all duration-500",
            "group-[.active]:opacity-100 opacity-0 group-[.active]:translate-x-0 translate-x-4"
        )} />
    </NavLink>
);

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex font-sans antialiased text-foreground">
            <AppTour />
            <Sidebar className="hidden xl:flex" />

            <div className="flex-1 flex flex-col pb-20 md:pb-0 min-w-0"> {/* Padding bottom for Mobile Nav */}
                <header className="pt-safe border-b bg-card/70 backdrop-blur-xl px-5 flex items-center justify-between xl:hidden sticky top-0 z-40">
                    <div className="flex items-center gap-2 h-16">
                        <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-lg shadow-sm" />
                        <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            VanttFlow
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <LevelProgress variant="compact" className="w-32" />
                        <div className="h-8 w-[1.5px] bg-border/40 mx-1 hidden xs:block rotate-[15deg]" />
                        <ModeToggle id="tour-theme-toggle-mobile" />
                    </div>
                </header>

                <div className="hidden xl:flex h-20 px-8 items-center justify-between border-b border-border/40">
                    <div className="flex flex-col">
                        <h2 className="font-black text-2xl tracking-tighter">Panel de Control</h2>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest -mt-1 opacity-60">Gestión de Finanzas Personales</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <MonthSelector />
                    </div>
                </div>

                {/* Mobile Tablet Header Sub-Nav */}
                <div className="xl:hidden p-4 pb-2 border-b border-border/20 bg-muted/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-sm">Resumen Mensual</h2>
                            <p className="text-[10px] text-muted-foreground">Enero 2026</p>
                        </div>
                        <MonthSelector />
                    </div>
                </div>

                <main className="flex-1 p-4 lg:p-10 overflow-auto bg-muted/5">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <MobileNav />
            </div>
        </div>
    );
};
=======
import React from 'react';
import { LayoutDashboard, Receipt, Wallet, Menu, CalendarClock, PieChart, Target, Download, BarChart3, Tags, CreditCard, Zap, Upload, Settings, ChevronRight, CandlestickChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MonthSelector } from './MonthSelector';
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useFinance } from "@/context/FinanceContext";
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { SpiritPet } from '@/components/gamification/SpiritPet';
import { MobileNav } from './MobileNav';
import { AppTour } from '@/components/onboarding/AppTour';

import { useIdentity } from "@/context/IdentityContext";

const Sidebar = ({ className }) => {
    const { exportData } = useFinance();
    const { user } = useIdentity();

    return (
        <div className={cn(
            "w-72 bg-card border-r h-full flex flex-col relative overflow-hidden transition-all duration-300",
            className
        )}>
            {/* Premium Sidebar Background - Subtle Gradient Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-40 -right-20 w-48 h-48 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="p-8 pb-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group/logo">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl relative z-10 shadow-lg border border-white/10" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                            VanttFlow
                        </h1>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 -mt-1">Financial Spirit</span>
                    </div>
                </div>
                <ModeToggle id="tour-theme-toggle-desktop" />
            </div>

            {/* Quick User Intro */}
            <div className="px-8 pb-6 relative z-10">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-black text-primary uppercase">
                            {user?.name?.charAt(0) || 'V'}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-foreground truncate">Hola, {user?.name?.split(' ')[0] || 'Usuario'}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Miembro Pro</p>
                    </div>
                </div>
            </div>

            {/* Premium Gamification Section in Sidebar */}
            <div className="px-6 mb-8 relative z-10">
                <div className="p-5 rounded-3xl bg-muted/30 border border-border/40 backdrop-blur-sm group hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
                            <SpiritPet size="sm" showBubble={false} className="scale-90 relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Compañero Activo</span>
                            <span className="text-xs font-black text-foreground">Sincronizado</span>
                        </div>
                    </div>
                    <LevelProgress />
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Principal</p>
                <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
                <SidebarLink to="/transactions" icon={Receipt} label="Transacciones" id="tour-transactions-nav" />
                <SidebarLink to="/analytics" icon={BarChart3} label="Analíticas" />
                <SidebarLink to="/market" icon={CandlestickChart} label="Mercado" />

                <div className="h-px bg-border/40 mx-4 my-4" />

                <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Herramientas</p>
                <SidebarLink to="/budget" icon={PieChart} label="Presupuestos" />
                <SidebarLink to="/goals" icon={Target} label="Metas" />
                <SidebarLink to="/scheduled" icon={CalendarClock} label="Pagos Programados" />
                <SidebarLink to="/cards" icon={CreditCard} label="Tarjetas" />
                <SidebarLink to="/subscriptions" icon={Zap} label="Suscripciones" />

                <div className="h-px bg-border/40 mx-4 my-4" />

                <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Sistema</p>
                <SidebarLink to="/categories" icon={Tags} label="Categorías" />
                <SidebarLink to="/import" icon={Upload} label="Importar" />
                <SidebarLink to="/settings" icon={Settings} label="Configuración" />

                <div className="mt-8 mb-6 px-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-300 group/export"
                        onClick={exportData}
                    >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover/export:bg-primary/20 transition-colors">
                            <Download size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Exportar CSV</span>
                    </Button>
                </div>
            </nav>

            <div className="p-6 border-t border-border/40 relative z-10 flex items-center justify-between text-muted-foreground/40">
                <span className="text-[10px] font-black uppercase tracking-widest">VanttFlow v1.2</span>
                <span className="text-[10px] font-black uppercase tracking-widest italic">Beta</span>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon: Icon, label, id }) => (
    <NavLink
        to={to}
        id={id}
        className={({ isActive }) => cn(
            "flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
            isActive
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(var(--primary),0.3)] scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
    >
        <div className="flex items-center gap-3">
            <Icon size={18} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                "group-[.active]:text-primary-foreground"
            )} />
            <span className="tracking-tight">{label}</span>
        </div>
        {/* Subtle indicator for active state */}
        <div className={cn(
            "h-1.5 w-1.5 rounded-full bg-white transition-all duration-500",
            "group-[.active]:opacity-100 opacity-0 group-[.active]:translate-x-0 translate-x-4"
        )} />
    </NavLink>
);

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex font-sans antialiased text-foreground">
            <AppTour />
            <Sidebar className="hidden xl:flex" />

            <div className="flex-1 flex flex-col pb-20 md:pb-0 min-w-0"> {/* Padding bottom for Mobile Nav */}
                <header className="pt-safe border-b bg-card/70 backdrop-blur-xl px-5 flex items-center justify-between xl:hidden sticky top-0 z-40">
                    <div className="flex items-center gap-2 h-16">
                        <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-lg shadow-sm" />
                        <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            VanttFlow
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <LevelProgress variant="compact" className="w-32" />
                        <div className="h-8 w-[1.5px] bg-border/40 mx-1 hidden xs:block rotate-[15deg]" />
                        <ModeToggle id="tour-theme-toggle-mobile" />
                    </div>
                </header>

                <div className="hidden xl:flex h-20 px-8 items-center justify-between border-b border-border/40">
                    <div className="flex flex-col">
                        <h2 className="font-black text-2xl tracking-tighter">Panel de Control</h2>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest -mt-1 opacity-60">Gestión de Finanzas Personales</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <MonthSelector />
                    </div>
                </div>

                {/* Mobile Tablet Header Sub-Nav */}
                <div className="xl:hidden p-4 pb-2 border-b border-border/20 bg-muted/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-sm">Resumen Mensual</h2>
                            <p className="text-[10px] text-muted-foreground">Enero 2026</p>
                        </div>
                        <MonthSelector />
                    </div>
                </div>

                <main className="flex-1 p-4 lg:p-10 overflow-auto bg-muted/5">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <MobileNav />
            </div>
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
