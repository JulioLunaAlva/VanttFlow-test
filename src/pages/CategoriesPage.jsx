import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Search, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { IconPicker } from "@/components/ui/IconPicker";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import * as Icons from 'lucide-react';

export const CategoriesPage = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
    const [filterType, setFilterType] = useState('all'); // all, income, expense
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        color: '#000000',
        icon: 'Circle'
    });

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'expense',
            color: '#000000',
            icon: 'Circle'
        });
        setEditingCategory(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name) return toast.error('El nombre es requerido');

        if (editingCategory) {
            updateCategory(editingCategory.id, formData);
        } else {
            addCategory(formData);
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            deleteCategory(id);
        }
    };

    const filteredCategories = categories.filter(c => {
        const matchesType = filterType === 'all' || c.type === filterType || c.type === 'both';
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Helper to render icon dynamically
    const renderIcon = (iconName, color) => {
        const Icon = Icons[iconName] || Icons.HelpCircle;
        return <Icon size={24} style={{ color }} />;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
                    <p className="text-muted-foreground">Administra cómo clasificas tus transacciones.</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus size={16} /> Nueva Categoría
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex bg-muted p-1 rounded-lg w-full sm:w-auto">
                    <button
                        onClick={() => setFilterType('all')}
                        className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", filterType === 'all' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilterType('income')}
                        className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", filterType === 'income' ? "bg-background shadow-sm text-emerald-600" : "text-muted-foreground hover:text-foreground")}
                    >
                        Ingresos
                    </button>
                    <button
                        onClick={() => setFilterType('expense')}
                        className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", filterType === 'expense' ? "bg-background shadow-sm text-red-600" : "text-muted-foreground hover:text-foreground")}
                    >
                        Gastos
                    </button>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar categoría..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCategories.map(category => (
                    <Card key={category.id} className="group hover:border-primary/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-muted/50" style={{ backgroundColor: `${category.color}20` }}>
                                    {renderIcon(category.icon, category.color)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{category.name}</h3>
                                    <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize",
                                        category.type === 'income' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                            category.type === 'expense' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    )}>
                                        {category.type === 'income' ? 'Ingreso' : category.type === 'expense' ? 'Gasto' : 'Ambos'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(category)}>
                                    <Edit2 size={14} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(category.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
                        <DialogDescription>Define el nombre, color e icono para identificar tus movimientos.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nombre</Label>
                            <Input
                                placeholder="Ej: Videojuegos, Cripto..."
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Tipo</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.type === 'income' ? 'default' : 'outline'}
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                    className={cn(
                                        "flex-1 gap-2",
                                        formData.type === 'income' && "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    )}
                                >
                                    <ArrowUpCircle size={16} /> Ingreso
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                    className={cn(
                                        "flex-1 gap-2",
                                        formData.type === 'expense' && "bg-red-600 hover:bg-red-700 text-white"
                                    )}
                                >
                                    <ArrowDownCircle size={16} /> Gasto
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <ColorPicker
                                    color={formData.color}
                                    onChange={color => setFormData({ ...formData, color })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Icono</Label>
                                <IconPicker
                                    value={formData.icon}
                                    onChange={icon => setFormData({ ...formData, icon })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
