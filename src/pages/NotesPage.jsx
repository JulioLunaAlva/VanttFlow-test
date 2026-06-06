import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { DatePicker } from '@/components/ui/DatePicker';
import {
    BookOpen, Plus, Handshake, FileText, TrendingUp, TrendingDown, CheckCircle2,
    Clock, AlertCircle, Trash2, Edit2, Pin, Archive, MoreHorizontal, X,
    User, ArrowDownLeft, ArrowUpRight, Banknote, Star, Check
} from 'lucide-react';
import { cn, toLocalDateStr } from '@/lib/utils';
import { format } from 'date-fns';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-rose-500',
];
const NOTE_COLORS = {
    yellow:  { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   dot: 'bg-amber-400',   label: 'Amarillo' },
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    dot: 'bg-blue-400',    label: 'Azul' },
    purple:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  dot: 'bg-violet-400',  label: 'Morado' },
    green:   { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Verde' },
    red:     { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    dot: 'bg-rose-400',    label: 'Rojo' },
};

const getAvatarColor = (name) => {
    if (!name) return AVATAR_COLORS[0];
    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
};

const initials = (name) => (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const fmt = (n, currency = 'MXN') =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(n || 0);

const StatusBadge = ({ status }) => {
    const map = {
        pending:  { label: 'Pendiente',  class: 'text-amber-400  bg-amber-400/10',   icon: Clock },
        partial:  { label: 'Parcial',    class: 'text-blue-400   bg-blue-400/10',    icon: AlertCircle },
        settled:  { label: 'Saldado',    class: 'text-emerald-400 bg-emerald-400/10',icon: CheckCircle2 },
    };
    const s = map[status] || map.pending;
    const Icon = s.icon;
    return (
        <span className={cn('flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', s.class)}>
            <Icon size={10} /> {s.label}
        </span>
    );
};

// ─────────────────────────────────────────────
// IOU Dialog
// ─────────────────────────────────────────────
const IOUDialog = ({ open, onClose, initial }) => {
    const { addIOU, editIOU } = useFinance();
    const [form, setForm] = useState({
        personName: initial?.personName || '',
        type: initial?.type || 'lent',
        amount: initial?.amount || '',
        description: initial?.description || '',
        date: initial?.date || toLocalDateStr(),
    });
    const isEdit = !!initial;

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.personName || !form.amount) return;
        if (isEdit) {
            editIOU(initial.id, form);
        } else {
            addIOU(form);
        }
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/30">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground">
                            <Handshake size={20} className="text-primary" />
                            {isEdit ? 'Editar Deuda' : 'Registrar Deuda'}
                        </DialogTitle>
                    </DialogHeader>
                </div>
                <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
                    {/* Type Toggle */}
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                        <Button type="button" size="sm"
                            className={cn('flex-1 gap-1.5 text-xs', form.type === 'lent' ? 'bg-emerald-600 hover:bg-emerald-700 text-foreground' : '')}
                            variant={form.type === 'lent' ? 'default' : 'ghost'}
                            onClick={() => set('type', 'lent')}>
                            <ArrowUpRight size={14} /> Me deben
                        </Button>
                        <Button type="button" size="sm"
                            className={cn('flex-1 gap-1.5 text-xs', form.type === 'borrowed' ? 'bg-rose-600 hover:bg-rose-700 text-foreground' : '')}
                            variant={form.type === 'borrowed' ? 'default' : 'ghost'}
                            onClick={() => set('type', 'borrowed')}>
                            <ArrowDownLeft size={14} /> Yo debo
                        </Button>
                    </div>
                    <Input
                        placeholder="Nombre de la persona *"
                        value={form.personName}
                        onChange={e => set('personName', e.target.value)}
                        required
                    />
                    <MoneyInput value={form.amount} onChange={v => set('amount', v)} placeholder="Monto *" required />
                    <Input
                        placeholder="Descripción (ej. Transferencia para la cena)"
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                    />
                    <DatePicker value={form.date} onChange={e => set('date', e.target.value)} />
                    <Button type="submit" className="w-full gap-2">
                        <Check size={16} /> {isEdit ? 'Guardar cambios' : 'Registrar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// ─────────────────────────────────────────────
// Settle Dialog
// ─────────────────────────────────────────────
const SettleDialog = ({ open, onClose, iou }) => {
    const { settleIOU } = useFinance();
    const [amount, setAmount] = useState('');
    const [genTx, setGenTx] = useState(true);
    const remaining = iou ? Number(iou.amount) - Number(iou.amountPaid || 0) : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = Math.min(Number(amount), remaining);
        if (!val) return;
        settleIOU(iou.id, val, genTx);
        onClose();
    };

    if (!iou) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/30">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
                            <Banknote size={20} className="text-emerald-400" />
                            Registrar pago
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            {iou.personName} — Pendiente: <span className="font-bold text-foreground">{fmt(remaining)}</span>
                        </p>
                    </DialogHeader>
                </div>
                <div className="px-6 pb-6 pt-4 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <MoneyInput value={amount} onChange={setAmount} placeholder={`Hasta ${fmt(remaining)}`} required />
                        {iou.type === 'lent' && (
                            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                <button type="button"
                                    className={cn('w-9 h-5 rounded-full transition-colors relative', genTx ? 'bg-primary' : 'bg-muted')}
                                    onClick={() => setGenTx(!genTx)}>
                                    <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-card transition-all', genTx ? 'right-0.5' : 'left-0.5')} />
                                </button>
                                <span>Registrar como ingreso en mis cuentas</span>
                            </label>
                        )}
                        <Button type="submit" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 size={16} /> Confirmar Pago
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─────────────────────────────────────────────
// Note Dialog
// ─────────────────────────────────────────────
const NoteDialog = ({ open, onClose, initial }) => {
    const { addNote, editNote } = useFinance();
    const [form, setForm] = useState({
        title: initial?.title || '',
        body: initial?.body || '',
        color: initial?.color || 'yellow',
    });
    const isEdit = !!initial;
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) return;
        if (isEdit) editNote(initial.id, form);
        else addNote(form);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/30">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground">
                            <FileText size={20} className="text-primary" />
                            {isEdit ? 'Editar Nota' : 'Nueva Nota'}
                        </DialogTitle>
                    </DialogHeader>
                </div>
                <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
                    <Input placeholder="Título *" value={form.title} onChange={e => set('title', e.target.value)} required />
                    <textarea
                        className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="Escribe tu nota..."
                        value={form.body}
                        onChange={e => set('body', e.target.value)}
                    />
                    {/* Color Picker */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Color:</span>
                        {Object.entries(NOTE_COLORS).map(([key, val]) => (
                            <button key={key} type="button" onClick={() => set('color', key)}
                                className={cn('w-6 h-6 rounded-full transition-all border-2', val.dot,
                                    form.color === key ? 'border-border scale-125 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100')} />
                        ))}
                    </div>
                    <Button type="submit" className="w-full gap-2">
                        <Check size={16} /> {isEdit ? 'Guardar' : 'Crear Nota'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// ─────────────────────────────────────────────
// IOU Card
// ─────────────────────────────────────────────
const IOUCard = ({ iou, onSettle, onEdit, onDelete }) => {
    const progress = Math.min(100, (Number(iou.amountPaid || 0) / Number(iou.amount)) * 100);
    const isLent = iou.type === 'lent';
    const remaining = Number(iou.amount) - Number(iou.amountPaid || 0);

    return (
        <div className={cn(
            'group relative card-base card-interactive p-4 border transition-all duration-300',
            iou.status === 'settled' ? 'opacity-60' : ''
        )}>
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center text-foreground font-bold text-sm flex-shrink-0', getAvatarColor(iou.personName))}>
                    {initials(iou.personName)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold truncate">{iou.personName}</h3>
                        <StatusBadge status={iou.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{iou.description || '—'}</p>
                </div>
            </div>

            {/* Amount */}
            <div className="mt-3 flex items-end justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{isLent ? 'Me debe' : 'Yo debo'}</p>
                    <p className={cn('text-2xl font-black', isLent ? 'text-emerald-400' : 'text-rose-400')}>
                        {isLent ? '+' : '-'}{fmt(iou.amount)}
                    </p>
                    {Number(iou.amountPaid) > 0 && (
                        <p className="text-xs text-muted-foreground">Pagado: {fmt(iou.amountPaid)} · Resta: {fmt(remaining)}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">{iou.date || '—'}</p>
                    {isLent && iou.type === 'lent' && <ArrowUpRight size={20} className="text-emerald-400/50 ml-auto" />}
                    {!isLent && <ArrowDownLeft size={20} className="text-rose-400/50 ml-auto" />}
                </div>
            </div>

            {/* Progress bar */}
            {Number(iou.amount) > 0 && (
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full transition-all', isLent ? 'bg-emerald-500' : 'bg-rose-500')}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {iou.status !== 'settled' && (
                    <Button size="sm" variant="outline" className="flex-1 text-xs gap-1 h-8" onClick={() => onSettle(iou)}>
                        <Banknote size={12} /> Pago
                    </Button>
                )}
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onEdit(iou)}>
                    <Edit2 size={13} />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300" onClick={() => onDelete(iou.id)}>
                    <Trash2 size={13} />
                </Button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Note Card
// ─────────────────────────────────────────────
const NoteCard = ({ note, onEdit, onDelete, onPin, onArchive }) => {
    const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
    return (
        <div className={cn(
            'group relative rounded-2xl border p-4 transition-all duration-300',
            'hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 card-interactive',
            colors.bg, colors.border,
            note.archived ? 'opacity-50' : ''
        )}>
            {/* Pin badge */}
            {note.pinned && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                    <Pin size={10} />
                </div>
            )}
            <h3 className="font-bold text-sm mb-1 pr-4 line-clamp-1">{note.title}</h3>
            {note.body && <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">{note.body}</p>}
            <p className="text-[10px] text-muted-foreground/60 mt-2">
                {note.createdAt ? format(new Date(note.createdAt), 'dd MMM yyyy') : ''}
            </p>
            {/* Actions */}
            <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onPin(note.id)} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors" title="Fijar">
                    <Pin size={12} className={note.pinned ? 'text-primary' : ''} />
                </button>
                <button onClick={() => onEdit(note)} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors" title="Editar">
                    <Edit2 size={12} />
                </button>
                <button onClick={() => onArchive(note.id)} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors" title="Archivar">
                    <Archive size={12} className={note.archived ? 'text-primary' : ''} />
                </button>
                <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors ml-auto" title="Eliminar">
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export const NotesPage = () => {
    const { ious, deleteIOU, notes, deleteNote, togglePinNote, archiveNote } = useFinance();
    const [activeTab, setActiveTab] = useState('ious');
    const [iouDialog, setIouDialog] = useState({ open: false, initial: null });
    const [settleDialog, setSettleDialog] = useState({ open: false, iou: null });
    const [noteDialog, setNoteDialog] = useState({ open: false, initial: null });
    const [iouFilter, setIouFilter] = useState('all'); // 'all' | 'lent' | 'borrowed' | 'pending' | 'settled'
    const [noteFilter, setNoteFilter] = useState('active'); // 'active' | 'pinned' | 'archived'

    // IOU Summaries
    const totalLent = useMemo(() => ious.filter(i => i.type === 'lent' && i.status !== 'settled').reduce((a, i) => a + (Number(i.amount) - Number(i.amountPaid || 0)), 0), [ious]);
    const totalBorrowed = useMemo(() => ious.filter(i => i.type === 'borrowed' && i.status !== 'settled').reduce((a, i) => a + (Number(i.amount) - Number(i.amountPaid || 0)), 0), [ious]);
    const netBalance = totalLent - totalBorrowed;

    const filteredIOUs = useMemo(() => {
        return ious.filter(i => {
            if (iouFilter === 'lent') return i.type === 'lent';
            if (iouFilter === 'borrowed') return i.type === 'borrowed';
            if (iouFilter === 'pending') return i.status !== 'settled';
            if (iouFilter === 'settled') return i.status === 'settled';
            return true;
        }).sort((a, b) => b.createdAt - a.createdAt);
    }, [ious, iouFilter]);

    const filteredNotes = useMemo(() => {
        return notes.filter(n => {
            if (noteFilter === 'pinned') return n.pinned && !n.archived;
            if (noteFilter === 'archived') return n.archived;
            return !n.archived;
        }).sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.createdAt - a.createdAt;
        });
    }, [notes, noteFilter]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">Cuaderno</h2>
                        <p className="text-caption text-muted-foreground/50 mt-0.5">Deudas pendientes y notas financieras</p>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                    <Button
                        size="sm"
                        className="gap-2 w-full sm:w-auto"
                        onClick={() => activeTab === 'ious'
                            ? setIouDialog({ open: true, initial: null })
                            : setNoteDialog({ open: true, initial: null })
                        }>
                        <Plus size={16} />
                        {activeTab === 'ious' ? 'Nueva Deuda' : 'Nueva Nota'}
                    </Button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
                {[
                    { id: 'ious', label: 'Deudas', icon: Handshake, count: ious.filter(i => i.status !== 'settled').length },
                    { id: 'notes', label: 'Notas', icon: FileText, count: notes.filter(n => !n.archived).length },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                activeTab === tab.id ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                            )}>
                            <Icon size={16} /> {tab.label}
                            {tab.count > 0 && (
                                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                                )}>{tab.count}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ══════════════════════════════════════
                TAB: DEUDAS
            ══════════════════════════════════════ */}
            {activeTab === 'ious' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <ArrowUpRight size={12} /> Me deben
                            </p>
                            <p className="text-2xl font-black text-emerald-400">{fmt(totalLent)}</p>
                        </div>
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                            <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <ArrowDownLeft size={12} /> Yo debo
                            </p>
                            <p className="text-2xl font-black text-rose-400">{fmt(totalBorrowed)}</p>
                        </div>
                        <div className={cn(
                            'rounded-2xl p-4 border',
                            netBalance >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-orange-500/10 border-orange-500/20'
                        )}>
                            <p className={cn('text-xs font-bold uppercase tracking-wider mb-1', netBalance >= 0 ? 'text-blue-400' : 'text-orange-400')}>
                                Saldo Neto
                            </p>
                            <p className={cn('text-2xl font-black', netBalance >= 0 ? 'text-blue-400' : 'text-orange-400')}>
                                {netBalance >= 0 ? '+' : ''}{fmt(netBalance)}
                            </p>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { id: 'all', label: 'Todas' }, { id: 'lent', label: 'Me deben' },
                            { id: 'borrowed', label: 'Yo debo' }, { id: 'pending', label: 'Pendientes' },
                            { id: 'settled', label: 'Saldadas' },
                        ].map(f => (
                            <button key={f.id} onClick={() => setIouFilter(f.id)}
                                className={cn(
                                    'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                                    iouFilter === f.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                                )}>{f.label}</button>
                        ))}
                    </div>

                    {/* IOU List */}
                    {filteredIOUs.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Handshake size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-semibold">Sin deudas registradas</p>
                            <p className="text-sm mt-1">Registra cuando alguien te deba dinero o tú le debas a alguien.</p>
                            <Button className="mt-6 gap-2" onClick={() => setIouDialog({ open: true, initial: null })}>
                                <Plus size={16} /> Registrar primera deuda
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredIOUs.map(iou => (
                                <IOUCard key={iou.id} iou={iou}
                                    onSettle={(i) => setSettleDialog({ open: true, iou: i })}
                                    onEdit={(i) => setIouDialog({ open: true, initial: i })}
                                    onDelete={(id) => deleteIOU(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════
                TAB: NOTAS
            ══════════════════════════════════════ */}
            {activeTab === 'notes' && (
                <div className="space-y-6">
                    {/* Filter Chips */}
                    <div className="flex gap-2">
                        {[
                            { id: 'active', label: 'Activas' },
                            { id: 'pinned', label: '📌 Fijadas' },
                            { id: 'archived', label: 'Archivadas' },
                        ].map(f => (
                            <button key={f.id} onClick={() => setNoteFilter(f.id)}
                                className={cn(
                                    'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                                    noteFilter === f.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                                )}>{f.label}</button>
                        ))}
                    </div>

                    {/* Notes Grid */}
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-semibold">Sin notas {noteFilter === 'archived' ? 'archivadas' : noteFilter === 'pinned' ? 'fijadas' : 'todavía'}</p>
                            <p className="text-sm mt-1">Guarda ideas, recordatorios o cualquier anotación financiera.</p>
                            {noteFilter === 'active' && (
                                <Button className="mt-6 gap-2" onClick={() => setNoteDialog({ open: true, initial: null })}>
                                    <Plus size={16} /> Crear primera nota
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                            {filteredNotes.map(note => (
                                <div key={note.id} className="break-inside-avoid mb-4">
                                    <NoteCard note={note}
                                        onEdit={(n) => setNoteDialog({ open: true, initial: n })}
                                        onDelete={(id) => deleteNote(id)}
                                        onPin={(id) => togglePinNote(id)}
                                        onArchive={(id) => archiveNote(id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Dialogs */}
            <IOUDialog
                open={iouDialog.open}
                onClose={() => setIouDialog({ open: false, initial: null })}
                initial={iouDialog.initial}
            />
            <SettleDialog
                open={settleDialog.open}
                onClose={() => setSettleDialog({ open: false, iou: null })}
                iou={settleDialog.iou}
            />
            <NoteDialog
                open={noteDialog.open}
                onClose={() => setNoteDialog({ open: false, initial: null })}
                initial={noteDialog.initial}
            />
        </div>
    );
};
