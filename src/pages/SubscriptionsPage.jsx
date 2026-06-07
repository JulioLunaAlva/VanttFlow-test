import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/FinanceContext";
import { Plus, Calendar, Power, Trash2, Zap, AlertCircle, RefreshCw, Sparkles, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { AccountSelect } from "@/components/ui/AccountSelect";
import { useTranslation } from 'react-i18next';
import { useIdentity } from "@/context/IdentityContext";
import { motion, AnimatePresence } from 'framer-motion';

// ─── Catálogo de suscripciones populares ───────────────────────────────────
const POPULAR_SUBSCRIPTIONS = [
    { name: 'Netflix',           domain: 'netflix.com',       price: 219,  color: '#E50914', category: 'Entretenimiento' },
    { name: 'Spotify',           domain: 'spotify.com',       price: 99,   color: '#1DB954', category: 'Música' },
    { name: 'HBO Max',           domain: 'max.com',           price: 149,  color: '#5822B4', category: 'Entretenimiento' },
    { name: 'Disney+',           domain: 'disneyplus.com',    price: 109,  color: '#0063E5', category: 'Entretenimiento' },
    { name: 'YouTube Premium',   domain: 'youtube.com',       price: 99,   color: '#FF0000', category: 'Entretenimiento' },
    { name: 'Apple TV+',         domain: 'apple.com',         price: 59,   color: '#555555', category: 'Entretenimiento' },
    { name: 'Amazon Prime',      domain: 'amazon.com',        price: 99,   color: '#FF9900', category: 'Entretenimiento' },
    { name: 'iCloud+',           domain: 'icloud.com',        price: 25,   color: '#3A82F7', category: 'Almacenamiento' },
    { name: 'ChatGPT Plus',      domain: 'openai.com',        price: 230,  color: '#10A37F', category: 'Productividad' },
    { name: 'Claude Pro',        domain: 'claude.ai',         price: 400,  color: '#D97757', category: 'Productividad' },
    { name: 'Xbox Game Pass',    domain: 'xbox.com',          price: 249,  color: '#107C10', category: 'Gaming' },
    { name: 'Canva Pro',         domain: 'canva.com',         price: 199,  color: '#7D2AE8', category: 'Diseño' },
    { name: 'Adobe Creative',    domain: 'adobe.com',         price: 299,  color: '#FF0000', category: 'Diseño' },
    { name: 'Crunchyroll',       domain: 'crunchyroll.com',   price: 79,   color: '#F47521', category: 'Entretenimiento' },
    { name: 'Paramount+',        domain: 'paramountplus.com', price: 99,   color: '#0064FF', category: 'Entretenimiento' },
    { name: 'Duolingo Plus',     domain: 'duolingo.com',      price: 119,  color: '#58CC02', category: 'Educación' },
    { name: 'DAZN',              domain: 'dazn.com',          price: 279,  color: '#000000', category: 'Deportes' },
];

// Logo via Clearbit + fallback a inicial con color de marca
const ServiceLogo = ({ domain, name, color, size = 'md' }) => {
    const [imgError, setImgError] = useState(false);
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg';

    if (imgError) {
        return (
            <div
                className={cn("rounded-xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md", sizeClass)}
                style={{ backgroundColor: color }}
            >
                {name.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <img
            src={`https://logo.clearbit.com/${domain}`}
            alt={name}
            className={cn("rounded-xl object-contain bg-white shadow-lg flex-shrink-0", sizeClass)}
            onError={() => setImgError(true)}
        />
    );
};

export const SubscriptionsPage = () => {
    const { t, i18n } = useTranslation();
    const { scheduledPayments, addScheduledPayment, toggleScheduledStatus, deleteScheduledPayment, updateScheduledPayment, categories, accounts } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showCatalog, setShowCatalog] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState(1);

    // Estado para edición
    const [editingPayment, setEditingPayment] = useState(null);
    const [editName, setEditName] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDayOfMonth, setEditDayOfMonth] = useState(1);
    const [editType, setEditType] = useState('expense');
    const [editCategoryId, setEditCategoryId] = useState('');
    const [editAccountId, setEditAccountId] = useState('');

    const openEditDialog = (payment) => {
        setEditingPayment(payment);
        setEditName(payment.name);
        setEditAmount(payment.amount.toString());
        setEditDayOfMonth(payment.dayOfMonth || 1);
        setEditType(payment.type || 'expense');
        setEditCategoryId(payment.categoryId || '');
        setEditAccountId(payment.accountId || '');
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingPayment) return;
        updateScheduledPayment(editingPayment.id, {
            name: editName,
            amount: parseFloat(editAmount),
            type: editType,
            categoryId: editCategoryId,
            accountId: editAccountId,
            dayOfMonth: parseInt(editDayOfMonth),
        });
        setEditingPayment(null);
    };

    const openEmpty = () => {
        setName(''); setAmount(''); setCategoryId(''); setDayOfMonth(1);
        setType('expense');
        setIsDialogOpen(true);
    };

    const openWithPreset = (preset) => {
        setName(preset.name);
        setAmount(preset.price.toString());
        setType('expense');
        setCategoryId('');
        setDayOfMonth(1);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addScheduledPayment({
            name,
            amount: parseFloat(amount),
            type,
            categoryId,
            accountId,
            frequency: 'monthly',
            dayOfMonth: parseInt(dayOfMonth),
            descDate: null,
            endDate: null,
        });
        setIsDialogOpen(false);
        setName(''); setAmount(''); setCategoryId('');
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat(i18n.language, { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

    const totalMonthlyFixed = scheduledPayments
        .filter(p => p.status === 'active' && p.frequency === 'monthly' && p.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const activeSubscriptions = scheduledPayments.filter(p => p.status === 'active').length;

    // Detect which popular services the user already has
    const existingNames = new Set(scheduledPayments.map(p => p.name.toLowerCase()));

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-0 pt-4 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">{t('subscriptions.title')}</h2>
                        <p className="text-caption text-muted-foreground/50 mt-0.5">{t('subscriptions.subtitle')}</p>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button onClick={openEmpty} size="sm" className="w-full sm:w-auto gap-2">
                        <Plus size={16} /> 
                        {t('subscriptions.new_subscription')}
                    </Button>
                </div>
            </div>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="card-base p-6 flex flex-col justify-between">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                        {t('subscriptions.projected_monthly_fixed')}
                    </p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black tracking-tighter text-foreground">
                            {formatCurrency(totalMonthlyFixed)}
                        </h3>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <RefreshCw size={20} />
                        </div>
                    </div>
                </div>

                <div className="card-base p-6 flex flex-col justify-between">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        {t('subscriptions.active_subscriptions')}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-black tracking-tighter text-foreground">{activeSubscriptions}</span>
                        <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                            <Zap size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Catálogo Popular ─────────────────────────────────────── */}
            <div className="glass-premium rounded-[2rem] border-border/30 overflow-hidden">
                {/* Header del catálogo */}
                <button
                    onClick={() => setShowCatalog(!showCatalog)}
                    className="w-full flex items-center justify-between px-6 py-5 md:px-8 group hover:bg-foreground/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Sparkles size={16} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="font-black text-base tracking-tight">Agregar rápido</p>
                            <p className="text-xs text-muted-foreground/60 font-bold">Servicios populares preconfigurados</p>
                        </div>
                    </div>
                    <div className="text-muted-foreground/50">
                        {showCatalog ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                <AnimatePresence>
                    {showCatalog && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-5 md:px-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {POPULAR_SUBSCRIPTIONS.map((svc) => {
                                        const alreadyAdded = existingNames.has(svc.name.toLowerCase());
                                        return (
                                            <button
                                                key={svc.name}
                                                onClick={() => !alreadyAdded && openWithPreset(svc)}
                                                disabled={alreadyAdded}
                                                className={cn(
                                                    "card-interactive relative flex flex-col items-center gap-3 p-4 border text-center transition-all duration-300 rounded-2xl",
                                                    alreadyAdded
                                                        ? "border-primary/30 bg-primary/5 opacity-60 cursor-default pointer-events-none"
                                                        : "cursor-pointer"
                                                )}
                                            >
                                                {alreadyAdded && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                        <span className="text-[10px] text-primary-foreground font-black">✓</span>
                                                    </div>
                                                )}
                                                <ServiceLogo domain={svc.domain} name={svc.name} color={svc.color} size="md" />
                                                <div>
                                                    <p className="font-black text-xs tracking-tight leading-tight line-clamp-2">{svc.name}</p>
                                                    <p className="text-[11px] font-bold text-primary mt-1">{formatCurrency(svc.price)}/mes</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-center text-[11px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-4">
                                    Toca un servicio para preconfigurar · Los precios son sugeridos y editables
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Lista de suscripciones del usuario ───────────────────── */}
            {scheduledPayments.length > 0 && (
                <div className="flex items-center gap-3 px-1 pt-2">
                    <div className="h-px flex-1 bg-border/40" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Mis suscripciones</span>
                    <div className="h-px flex-1 bg-border/40" />
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scheduledPayments.map(payment => {
                    const account = accounts.find(c => c.id === payment.accountId);
                    // Buscar si el nombre coincide con algún servicio popular (para mostrar el logo)
                    const popularMatch = POPULAR_SUBSCRIPTIONS.find(
                        s => s.name.toLowerCase() === payment.name.toLowerCase()
                    );

                    return (
                        <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "card-base p-0 group flex flex-col overflow-hidden",
                                payment.status === 'paused' && "opacity-50 grayscale"
                            )}
                        >
                            <div className="p-5 border-b border-border/30 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-0">
                                    {popularMatch ? (
                                        <ServiceLogo domain={popularMatch.domain} name={popularMatch.name} color={popularMatch.color} size="sm" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Zap size={18} className="text-primary" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="text-base font-bold text-foreground truncate">{payment.name}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">mensual</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border flex-shrink-0",
                                    payment.status === 'active'
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        : "bg-foreground/5 text-foreground/30 border-border/30"
                                )}>
                                    {payment.status === 'active' ? 'Activo' : 'Pausado'}
                                </div>
                            </div>

                            <div className="p-5 relative z-10">
                                <div className="text-2xl md:text-3xl font-black tracking-tighter text-foreground mb-4">
                                    {formatCurrency(payment.amount)}
                                    <span className="text-sm font-bold text-muted-foreground/40 ml-1">/mes</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-muted-foreground/40" />
                                            <p className="text-xs font-black text-muted-foreground/50 uppercase tracking-wider">
                                                Día {payment.dayOfMonth} de cada mes
                                            </p>
                                        </div>
                                        {account && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                                <p className="text-xs font-black text-primary/60 uppercase tracking-wider truncate max-w-[130px]">
                                                    {account.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20"
                                            onClick={() => openEditDialog(payment)}
                                            title="Editar"
                                        >
                                            <Edit2 size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 glass-premium bg-foreground/5 hover:bg-foreground/10 rounded-xl border border-border/30"
                                            onClick={() => toggleScheduledStatus(payment.id)}
                                            title={payment.status === 'active' ? 'Pausar' : 'Activar'}
                                        >
                                            <Power size={14} className={payment.status === 'active' ? "text-orange-500" : "text-emerald-500"} />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/20"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar suscripción?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción cancelará la programación de "{payment.name}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteScheduledPayment(payment.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {scheduledPayments.length === 0 && (
                    <div className="col-span-full py-20 card-base border-dashed text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-border/30 text-muted-foreground/20">
                            <Zap size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tighter text-foreground">{t('subscriptions.no_subscriptions')}</p>
                            <p className="text-xs text-muted-foreground/60 font-medium px-4 mt-1">
                                Usa el catálogo de arriba para agregar tus servicios favoritos con un solo toque
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Dialog del formulario ────────────────────────────────── */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl max-w-md">
                    {/* Header del dialog */}
                    <div className="px-6 pt-6 pb-5 border-b border-border/30 bg-gradient-to-br from-primary/5 to-transparent">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                {name ? (
                                    (() => {
                                        const match = POPULAR_SUBSCRIPTIONS.find(s => s.name === name);
                                        return match ? (
                                            <>
                                                <ServiceLogo domain={match.domain} name={match.name} color={match.color} size="sm" />
                                                {name}
                                            </>
                                        ) : (
                                            <><Zap size={22} className="text-primary" />{name || t('subscriptions.new_subscription_dialog')}</>
                                        );
                                    })()
                                ) : (
                                    <><Zap size={22} className="text-primary" />{t('subscriptions.new_subscription_dialog')}</>
                                )}
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest mt-1">
                                Configura los detalles de tu suscripción
                            </p>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                        {/* Tipo: Ingreso / Gasto */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                className={cn(
                                    "py-3 rounded-2xl font-black text-sm border-2 transition-all duration-200",
                                    type === 'income'
                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
                                        : "border-border/30 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-500"
                                )}
                            >
                                💰 {t('subscriptions.recurring_income')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                className={cn(
                                    "py-3 rounded-2xl font-black text-sm border-2 transition-all duration-200",
                                    type === 'expense'
                                        ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25"
                                        : "border-border/30 text-muted-foreground hover:border-rose-500/30 hover:text-rose-500"
                                )}
                            >
                                💸 {t('subscriptions.fixed_expense')}
                            </button>
                        </div>

                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Nombre del servicio</label>
                            <Input
                                placeholder={t('subscriptions.name_placeholder')}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="h-12 rounded-xl font-bold"
                            />
                        </div>

                        {/* Monto + Día */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Monto mensual</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                    className="h-12 rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Día de cobro</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={dayOfMonth}
                                    onChange={e => setDayOfMonth(e.target.value)}
                                    required
                                    className="h-12 rounded-xl font-bold"
                                />
                            </div>
                        </div>

                        {/* Categoría */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Categoría (opcional)</label>
                            <CategorySelect
                                categories={categories.filter(c => c.type === type || c.type === 'both')}
                                value={categoryId}
                                onChange={setCategoryId}
                                placeholder={t('subscriptions.category_placeholder')}
                            />
                        </div>

                        {/* Cuenta */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Cuenta (opcional)</label>
                            <AccountSelect
                                accounts={accounts}
                                value={accountId}
                                onChange={setAccountId}
                                placeholder={t('subscriptions.account_placeholder')}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-13 rounded-2xl font-black text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-95 mt-2"
                        >
                            {t('subscriptions.save_btn')} ✓
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Dialog de Edición ────────────────────────────────────── */}
            <Dialog open={!!editingPayment} onOpenChange={(v) => !v && setEditingPayment(null)}>
                <DialogContent className="p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl max-w-md">
                    <div className="px-6 pt-6 pb-5 border-b border-border/30 bg-gradient-to-br from-primary/5 to-transparent">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                <Edit2 size={22} className="text-primary" />
                                Editar suscripción
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest mt-1">
                                {editingPayment?.name}
                            </p>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-5">
                        {/* Tipo */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setEditType('income')} className={cn("py-3 rounded-2xl font-black text-sm border-2 transition-all", editType === 'income' ? "bg-emerald-500 text-white border-emerald-500" : "border-border/30 text-muted-foreground")}>
                                💰 Ingreso recurrente
                            </button>
                            <button type="button" onClick={() => setEditType('expense')} className={cn("py-3 rounded-2xl font-black text-sm border-2 transition-all", editType === 'expense' ? "bg-rose-500 text-white border-rose-500" : "border-border/30 text-muted-foreground")}>
                                💸 Gasto fijo
                            </button>
                        </div>
                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Nombre</label>
                            <Input value={editName} onChange={e => setEditName(e.target.value)} required className="h-12 rounded-xl font-bold" />
                        </div>
                        {/* Monto + Día */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Monto mensual</label>
                                <Input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} required className="h-12 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Día de cobro</label>
                                <Input type="number" min="1" max="31" value={editDayOfMonth} onChange={e => setEditDayOfMonth(e.target.value)} required className="h-12 rounded-xl font-bold" />
                            </div>
                        </div>
                        {/* Categoría */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Categoría (opcional)</label>
                            <CategorySelect categories={categories.filter(c => c.type === editType || c.type === 'both')} value={editCategoryId} onChange={setEditCategoryId} placeholder="Categoría" />
                        </div>
                        {/* Cuenta */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Cuenta (opcional)</label>
                            <AccountSelect accounts={accounts} value={editAccountId} onChange={setEditAccountId} placeholder="Cuenta de cargo" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setEditingPayment(null)} className="flex-1 h-12 rounded-2xl">Cancelar</Button>
                            <Button type="submit" className="flex-1 h-12 rounded-2xl font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">Guardar cambios ✓</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
