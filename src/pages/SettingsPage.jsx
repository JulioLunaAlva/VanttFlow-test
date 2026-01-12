import React, { useState } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { User, Mail, Lock, LogOut, Trash2, Save, Globe, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage = () => {
    const { user, updateProfile, logout } = useIdentity();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        pin: user?.pin || '',
        currency: user?.currency || 'MXN'
    });

    const handleSave = () => {
        if (!formData.name) return toast.error('El nombre es requerido');
        if (formData.pin.length < 4) return toast.error('El PIN debe tener 4 dígitos');

        updateProfile({
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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Perfil e Identidad
                    </CardTitle>
                    <CardDescription>Gestiona tu información personal y de seguridad.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                className="pl-9"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electrónico (Opcional)</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-9"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pin">PIN de Seguridad (4 dígitos)</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="pin"
                                type="password"
                                className="pl-9 font-mono tracking-widest"
                                maxLength={4}
                                value={formData.pin}
                                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={handleSave} className="gap-2">
                        <Save size={16} /> Guardar Cambios
                    </Button>
                </CardFooter>
            </Card>

            {/* Preferences Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Preferencias Regionales
                    </CardTitle>
                    <CardDescription>Ajusta la moneda y formatos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Moneda Principal</Label>
                        <select
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        >
                            <option value="MXN">Peso Mexicano (MXN)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="COP">Peso Colombiano (COP)</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Nota: Cambiar la moneda no convierte los montos existentes, solo cambia el símbolo visual.
                        </p>
                    </div>
                    <Separator />

                    <div className="pt-2">
                        <Label>Ayuda y Guía</Label>
                        <div className="mt-2 text-center p-6 border-2 border-dashed rounded-xl bg-muted/20">
                            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground mb-4">¿Quieres volver a ver la guía interactiva de bienvenida?</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    localStorage.removeItem('vanttflow_tour_completed');
                                    toast.success("Tour reiniciado. Ve al Dashboard para comenzar.");
                                }}
                            >
                                Reiniciar Tour de Bienvenida
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Session & Danger Zone */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Zona de Peligro
                        </CardTitle>
                        <CardDescription>Acciones destructivas e irreversibles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="w-full" onClick={handleResetData}>
                            Borrar todos los datos
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogOut className="h-5 w-5" />
                            Sesión
                        </CardTitle>
                        <CardDescription>Cierra tu sesión de forma segura.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" onClick={logout}>
                            Cerrar Sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-8">
                VanttFlow v1.1.0 • Build 2024
            </div>
        </div>
    );
};
