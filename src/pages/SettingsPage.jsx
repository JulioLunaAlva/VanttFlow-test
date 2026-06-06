import React, { useState } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { User, Mail, Lock, LogOut, Trash2, Save, Globe, Sparkles, Sword, Timer, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGamification } from '@/context/GamificationContext';
import { useFinance } from '@/context/FinanceContext';
import { useNotifications } from '@/context/NotificationContext';
import { useSync } from '@/context/SyncContext';
import { db } from '@/lib/db';
import { Download, Upload, Bell, Zap, Cloud, CloudOff, CloudUpload } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const SettingsPage = () => {
    const { user, updateProfile, logout, autoLockMinutes, setAutoLockMinutes } = useIdentity();
    const { isEnabled, setIsEnabled, selectedPet, setSelectedPet } = useGamification();
    const { state: _financeState, dispatch: _dispatch } = useFinance(); // Removed unused as per lint, but keeping destructuring logic structure if needed later
    const { permission, requestPermission, sendNotification, triggerMotivation } = useNotifications();
    const { firebaseUser, isSyncing, lastSyncTime, loginWithGoogle, logoutGoogle, backupToCloud } = useSync();
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef(null);

    const PET_OPTIONS = [
        { id: 'fox', emoji: '🦊', name: 'Zorro' },
        { id: 'dog', emoji: '🐶', name: 'Perro' },
        { id: 'shinobi', emoji: '🥷', name: 'Shinobi' },
        { id: 'chief', emoji: '🛡️', name: 'Spartan' },
        { id: 'kitty', emoji: '🐱', name: 'Gatito' },
        { id: 'pocket', emoji: '⚡', name: 'Pocket' },
        { id: 'maiden', emoji: '👸', name: 'Dama' }
    ];

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        pin: user?.pin || '',
        currency: user?.currency || 'MXN'
    });

    const handleSave = async () => {
        if (!formData.name) return toast.error('El nombre es requerido');
        if (formData.pin.length < 4) return toast.error('El PIN debe tener 4 dígitos');

        await updateProfile({
            name: formData.name,
            email: formData.email,
            pin: formData.pin,
            currency: formData.currency
        });
    };

    const handleResetData = () => {
        if (confirm('¿ESTÁS SEGURO? Esto borrará TODAS tus transacciones, cuentas y metas. Esta acción no se puede deshacer.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleExport = async () => {
        const toastId = toast.loading('Generando respaldo...');
        try {
            const data = {
                version: '1.2',
                exportedAt: new Date().toISOString(),
                // Finance Keys (from Dexie)
                transactions: await db.transactions.toArray(),
                categories: await db.categories.toArray(),
                accounts: await db.accounts.toArray(),
                scheduledPayments: await db.scheduledPayments.toArray(),
                paymentInstances: await db.paymentInstances.toArray(),
                budgets: await db.budgets.toArray(),
                goals: await db.goals.toArray(),
                notes: await db.notes.toArray(),
                ious: await db.ious.toArray(),
            // Identity Keys
            identity: JSON.parse(localStorage.getItem('vantt_identity')),
            privacyMode: JSON.parse(localStorage.getItem('vantt_privacy_mode') || 'false'),
            // Gamification Keys
            gamification: {
                enabled: JSON.parse(localStorage.getItem('gamification_enabled') || 'true'),
                pet: JSON.parse(localStorage.getItem('gamification_selected_pet') || '"fox"'),
                xp: JSON.parse(localStorage.getItem('gamification_xp') || '0'),
                achievements: JSON.parse(localStorage.getItem('gamification_achievements') || '[]'),
                lastLogin: JSON.parse(localStorage.getItem('gamification_last_login')),
                streak: JSON.parse(localStorage.getItem('gamification_streak') || '0'),
                missions: JSON.parse(localStorage.getItem('gamification_daily_missions') || '[]'),
                missionsDate: JSON.parse(localStorage.getItem('gamification_missions_date'))
            },
            // Market
            market: JSON.parse(localStorage.getItem('market_data_real'))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vanttflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t('settings.export_success'), { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Error al generar respaldo', { id: toastId });
        }
    };

    const validateBackupData = (data) => {
        if (!data || typeof data !== 'object') return { valid: false, reason: 'El archivo no es un JSON válido' };
        // Accept either 'transactions' (v1.2) or 'finance_data' (older backup.js format)
        const hasTransactions = Array.isArray(data.transactions) || Array.isArray(data.finance_data);
        if (!hasTransactions) return { valid: false, reason: 'No se encontraron transacciones en el archivo' };
        if (!Array.isArray(data.categories)) return { valid: false, reason: 'No se encontraron categorías' };
        if (!Array.isArray(data.accounts)) return { valid: false, reason: 'No se encontraron cuentas' };
        // Identity is optional for partial backups, but if present, must have at least a name
        if (data.identity && typeof data.identity !== 'object') return { valid: false, reason: 'Campo de identidad inválido' };
        return { valid: true };
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const toastId = toast.loading('Restaurando respaldo...');
            try {
                const data = JSON.parse(event.target.result);

                const { valid, reason } = validateBackupData(data);
                if (!valid) {
                    toast.error(`${t('settings.import_invalid_format') || 'Formato de archivo inválido'}: ${reason}`, { id: toastId });
                    return;
                }

                if (confirm(t('settings.import_confirm'))) {
                    // Restore Dexie
                    await db.transaction('rw', db.transactions, db.categories, db.accounts, db.scheduledPayments, db.paymentInstances, db.budgets, db.goals, db.notes, db.ious, async () => {
                        await db.transactions.clear();
                        if (data.transactions && data.transactions.length) await db.transactions.bulkAdd(data.transactions);
                        
                        await db.categories.clear();
                        if (data.categories && data.categories.length) await db.categories.bulkAdd(data.categories);

                        await db.accounts.clear();
                        if (data.accounts && data.accounts.length) await db.accounts.bulkAdd(data.accounts);

                        await db.scheduledPayments.clear();
                        if (data.scheduledPayments && data.scheduledPayments.length) await db.scheduledPayments.bulkAdd(data.scheduledPayments);

                        await db.paymentInstances.clear();
                        if (data.paymentInstances && data.paymentInstances.length) await db.paymentInstances.bulkAdd(data.paymentInstances);

                        await db.budgets.clear();
                        if (data.budgets && data.budgets.length) await db.budgets.bulkAdd(data.budgets);

                        await db.goals.clear();
                        if (data.goals && data.goals.length) await db.goals.bulkAdd(data.goals);

                        await db.notes.clear();
                        if (data.notes && data.notes.length) await db.notes.bulkAdd(data.notes);

                        await db.ious.clear();
                        if (data.ious && data.ious.length) await db.ious.bulkAdd(data.ious);
                    });

                    // Restore LocalStorage
                    if (data.identity && data.identity.name) {
                        localStorage.setItem('vantt_identity', JSON.stringify(data.identity));
                    }
                    if (data.privacyMode !== undefined) {
                        localStorage.setItem('vantt_privacy_mode', JSON.stringify(data.privacyMode));
                    }
                    if (data.market) {
                        localStorage.setItem('market_data_real', JSON.stringify(data.market));
                    }
                    if (data.gamification) {
                        localStorage.setItem('gamification_enabled', JSON.stringify(data.gamification.enabled ?? true));
                        localStorage.setItem('gamification_selected_pet', JSON.stringify(data.gamification.pet || "fox"));
                        localStorage.setItem('gamification_xp', JSON.stringify(data.gamification.xp || 0));
                        localStorage.setItem('gamification_achievements', JSON.stringify(data.gamification.achievements || []));
                        localStorage.setItem('gamification_last_login', JSON.stringify(data.gamification.lastLogin));
                        localStorage.setItem('gamification_streak', JSON.stringify(data.gamification.streak || 0));
                        localStorage.setItem('gamification_daily_missions', JSON.stringify(data.gamification.missions || []));
                        localStorage.setItem('gamification_missions_date', JSON.stringify(data.gamification.missionsDate));
                    }

                    toast.success(`${t('settings.import_success')} — ${data.transactions?.length || 0} transacciones restauradas`, { id: toastId });
                    setTimeout(() => window.location.reload(), 1500);
                }
            } catch (error) {
                console.error('Import error:', error);
                toast.error(`${t('settings.import_error')}: ${error.message}`, { id: toastId });
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <div className="space-y-6 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">{t('settings.title')}</h2>
                        <p className="text-caption text-muted-foreground/50">{t('settings.title_desc') || 'Configuración y Personalización'}</p>
                    </div>
                </div>
                <div className="mt-3 sm:mt-0">
                    <span className="badge-primary">V1.2 BETA</span>
                </div>
            </div>

            {/* Profile Section */}
            <div className="card-base overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                            <User size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-foreground">{t('settings.profile')}</h3>
                            <p className="text-caption text-muted-foreground/50">{t('settings.profile_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="name" className="text-caption text-muted-foreground/60">{t('settings.name_label')}</Label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/30" />
                            <Input
                                id="name"
                                className="pl-10"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-caption text-muted-foreground/60">{t('settings.email_label')}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/30" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-10"
                                placeholder={t('settings.email_placeholder')}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="pin" className="text-caption text-muted-foreground/60">{t('settings.pin_label_setting')}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/30" />
                            <Input
                                id="pin"
                                type="password"
                                className="pl-10 font-mono tracking-[0.5em]"
                                maxLength={4}
                                value={formData.pin}
                                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-5 pb-5 border-t border-border/40 pt-4 flex justify-end">
                    <Button onClick={handleSave} size="lg" className="gap-2">
                        <Save size={16} /> {t('settings.save_changes_btn')}
                    </Button>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="card-base overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                            <Globe size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-foreground">{t('settings.appearance') || 'Preferencias'}</h3>
                            <p className="text-caption text-muted-foreground/50">{t('settings.appearance_desc') || 'Configuración regional'}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 space-y-6">
                    <div className="grid gap-1.5">
                        <Label className="text-caption text-muted-foreground/60">{t('settings.currency_label') || 'Moneda Principal'}</Label>
                        <Select
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                        >
                            <option value="MXN">Peso Mexicano (MXN)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="COP">Peso Colombiano (COP)</option>
                        </Select>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                            {t('settings.currency_note') || '* La moneda solo afecta la visualización'}
                        </p>
                    </div>

                    <div className="h-px bg-border/40" />

                    <div className="pt-2">
                        <Label className="text-caption text-muted-foreground/60">{t('settings.tour_label') || 'Tour de la App'}</Label>
                        <div className="mt-4 text-center p-6 border border-dashed border-border/50 rounded-2xl bg-muted/20">
                            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 opacity-50" />
                            <p className="text-xs font-bold text-muted-foreground mb-4">{t('settings.tour_desc') || '¿Quieres volver a ver el tutorial inicial?'}</p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    localStorage.removeItem('vanttflow_tour_completed');
                                    toast.success(t('settings.tour_success') || 'Tour reiniciado');
                                }}
                                className="w-full"
                            >
                                {t('settings.tour_restart') || 'Reiniciar Tutorial'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Settings */}
            <div className="card-base overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                            <Languages size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-foreground">{t('settings.language') || 'Idioma'}</h3>
                            <p className="text-caption text-muted-foreground/50">{t('settings.select_language') || 'Elige tu idioma'}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid gap-1.5">
                        <Label className="text-caption text-muted-foreground/60">{t('settings.language') || 'Idioma'}</Label>
                        <Select
                            value={i18n.language}
                            onChange={e => i18n.changeLanguage(e.target.value)}
                            className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                        >
                            <option value="es">Español 🇪🇸</option>
                            <option value="en">English 🇺🇸</option>
                            <option value="pt">Português 🇧🇷</option>
                            <option value="fr">Français 🇫🇷</option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Cloud Sync Section */}
            <div className="card-base overflow-hidden border-blue-500/20 bg-blue-500/5">
                <div className="px-5 py-4 border-b border-blue-500/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-500">
                            {firebaseUser ? <Cloud size={18} /> : <CloudOff size={18} />}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-black tracking-tight text-blue-500">Sincronización en la Nube</h3>
                            <p className="text-caption text-blue-500/60">
                                {firebaseUser ? `Conectado como ${firebaseUser.displayName || firebaseUser.email}` : 'Respalda tus datos de forma segura'}
                            </p>
                        </div>
                        {firebaseUser && (
                            <Button variant="ghost" size="sm" onClick={logoutGoogle} className="text-blue-500 hover:bg-blue-500/20">
                                Desconectar
                            </Button>
                        )}
                    </div>
                </div>
                <div className="p-5">
                    {firebaseUser ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">Última sincronización:</p>
                                <p className="text-xs text-muted-foreground">
                                    {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Nunca'}
                                </p>
                            </div>
                            <Button 
                                onClick={() => backupToCloud()} 
                                disabled={isSyncing}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                            >
                                {isSyncing ? (
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2" />
                                ) : (
                                    <CloudUpload size={16} className="mr-2" />
                                )}
                                {isSyncing ? 'Subiendo...' : 'Sincronizar Ahora'}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">Inicia sesión con Google para respaldar tus datos en la nube y no perderlos al cambiar de dispositivo.</p>
                            <Button 
                                onClick={loginWithGoogle} 
                                variant="outline"
                                className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Conectar Google
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Data Management Section */}
            <div className="card-base overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500">
                            <Download size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-foreground">{t('settings.data') || 'Datos y Respaldo'}</h3>
                            <p className="text-caption text-muted-foreground/50">{t('settings.data_desc') || 'Exporta e importa tu información'}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="flex-1 gap-2 h-12" onClick={handleExport}>
                            <Download size={16} className="text-purple-500" />
                            {t('settings.export_btn') || 'Exportar Datos'}
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 h-12" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={16} className="text-emerald-500" />
                            {t('settings.import_btn') || 'Importar Datos'}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            className="hidden"
                            accept=".json"
                        />
                    </div>
                </div>
            </div>

            {/* Gamification Settings */}
            <div className="card-base overflow-hidden border-primary/20 bg-primary/5">
                <div className="px-5 py-4 border-b border-primary/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary">
                            <Sword size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-primary">{t('settings.spirit_title') || 'Spirit Companion'}</h3>
                            <p className="text-caption text-primary/60">{t('settings.spirit_desc') || 'Tu compañero financiero'}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50">
                        <div>
                            <Label className="text-sm font-bold">{t('settings.spirit_enable') || 'Habilitar Gamificación'}</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">{t('dashboard.gamification_desc') || 'Gana XP por tus buenos hábitos'}</p>
                        </div>
                        <Button
                            variant={isEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsEnabled(!isEnabled)}
                        >
                            {isEnabled ? (t('settings.spirit_on') || 'Activado') : (t('settings.spirit_off') || 'Desactivado')}
                        </Button>
                    </div>

                    {isEnabled && (
                        <div className="pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-4">
                            <Label className="text-caption text-muted-foreground/60 mb-4 block">{t('settings.spirit_pet_label') || 'Elige a tu compañero'}</Label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                {PET_OPTIONS.map(pet => (
                                    <button
                                        key={pet.id}
                                        onClick={() => {
                                            setSelectedPet(pet.id);
                                            toast.success(t('settings.spirit_change_success', { name: pet.name }) || `Mascota cambiada a ${pet.name}`);
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                                            selectedPet === pet.id
                                                ? "border-primary bg-primary/10 scale-105"
                                                : "border-transparent bg-muted/50 grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
                                        )}
                                    >
                                        <span className="text-3xl mb-1.5">{pet.emoji}</span>
                                        <span className="text-[9px] font-bold uppercase truncate w-full text-center text-foreground/60">{pet.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Settings (PWA) */}
            <div className="card-base overflow-hidden border-indigo-500/20 bg-indigo-500/5">
                <div className="px-5 py-4 border-b border-indigo-500/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                            <Bell size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-indigo-500">{t('settings.notifications') || 'Notificaciones'}</h3>
                            <p className="text-caption text-indigo-500/60">{t('settings.notifications_desc') || 'Avisos y recordatorios'}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-background border border-border/50 gap-4">
                        <div>
                            <Label className="text-sm font-bold text-foreground">
                                {t('settings.notif_status') || 'Estado'}: {permission === 'granted' ? (t('settings.notif_status_on') || 'Activas') : permission === 'denied' ? (t('settings.notif_status_blocked') || 'Bloqueadas') : (t('settings.notif_status_off') || 'Desactivadas')}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {permission === 'granted'
                                    ? (t('settings.notif_on_desc') || 'Las notificaciones están funcionando')
                                    : (t('settings.notif_off_desc') || 'Permite las notificaciones en tu navegador')}
                            </p>
                        </div>
                        {permission !== 'granted' ? (
                            <Button size="sm" onClick={requestPermission} className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white">
                                {t('settings.notif_activate_btn') || 'Activar'}
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => sendNotification("Test", "The notification system works!")} className="text-indigo-500 hover:text-indigo-600">
                                    {t('settings.notif_test_btn') || 'Probar'}
                                </Button>
                                <Button variant="outline" size="icon" onClick={triggerMotivation} title="Surprise Message" className="text-amber-500 hover:text-amber-600">
                                    <Zap size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground italic px-2">
                        {t('settings.notif_ios_note') || '* En iOS debes añadir la app a la pantalla de inicio primero.'}
                    </p>
                </div>
            </div>

            {/* Session & Danger Zone */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="card-base overflow-hidden border-rose-500/30">
                    <div className="px-5 py-4 border-b border-rose-500/10 bg-rose-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                                <Trash2 size={18} />
                            </div>
                            <div>
                                <h3 className="text-base font-black tracking-tight text-rose-500">{t('settings.danger_title') || 'Zona Peligrosa'}</h3>
                                <p className="text-caption text-rose-500/60">{t('settings.danger_desc') || 'Acciones irreversibles'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <Button variant="destructive" className="w-full h-12" onClick={handleResetData}>
                            {t('settings.danger_btn') || 'Borrar todos mis datos'}
                        </Button>
                    </div>
                </div>

                <div className="card-base overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/40">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-muted border border-border/50 text-foreground">
                                <LogOut size={18} />
                            </div>
                            <div>
                                <h3 className="text-base font-black tracking-tight text-foreground">{t('settings.session_title') || 'Sesión'}</h3>
                                <p className="text-caption text-muted-foreground/50">{t('settings.session_desc') || 'Seguridad de la cuenta'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid gap-1.5">
                            <Label className="flex items-center gap-2 text-caption text-muted-foreground/60"><Timer size={14} /> {t('settings.autolock_label') || 'Bloqueo Automático'}</Label>
                            <Select
                                value={autoLockMinutes}
                                onChange={e => setAutoLockMinutes(Number(e.target.value))}
                                className="h-12 bg-background border-border/50 rounded-xl px-4 font-bold"
                            >
                                <option value={0}>{t('settings.autolock_never') || 'Nunca'}</option>
                                <option value={1}>{t('settings.autolock_min') || '1 minuto'}</option>
                                <option value={2}>{t('settings.autolock_mins', { count: 2 }) || '2 minutos'}</option>
                                <option value={5}>{t('settings.autolock_mins', { count: 5 }) || '5 minutos'}</option>
                                <option value={15}>{t('settings.autolock_mins', { count: 15 }) || '15 minutos'}</option>
                                <option value={30}>{t('settings.autolock_mins', { count: 30 }) || '30 minutos'}</option>
                            </Select>
                        </div>
                        <div className="h-px bg-border/40" />
                        <Button variant="outline" className="w-full h-12" onClick={logout}>
                            {t('settings.logout_btn') || 'Cerrar Sesión'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="text-center text-[10px] text-foreground/10 pt-10 font-black uppercase tracking-[0.5em]">
                VanttFlow v1.2 Beta • Build 2026
            </div>
        </div>
    );
};
