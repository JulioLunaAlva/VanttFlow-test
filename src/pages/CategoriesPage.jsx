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
import { useTranslation } from 'react-i18next';

export const CategoriesPage = () => {
    const { t } = useTranslation();
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
        if (!formData.name) return toast.error(t('categories.error_name'));

        if (editingCategory) {
            updateCategory(editingCategory.id, formData);
        } else {
            addCategory(formData);
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = (id) => {
        if (confirm(t('categories.delete_confirm'))) {
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
        <div className="space-y-8 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 md:pb-8">
            {/* Header Compacto */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div>
                    <h2 className="text-title font-black text-foreground">{t('categories.title')}</h2>
                    <p className="text-caption text-muted-foreground/50 mt-0.5">{t('categories.subtitle')}</p>
                </div>

                <div className="mt-4 sm:mt-0">
                    <Button onClick={handleOpenCreate} size="sm" className="w-full sm:w-auto gap-2">
                        <Plus size={16} /> 
                        {t('categories.new_category')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                <div className="flex bg-foreground/5 p-1 rounded-xl w-full lg:w-auto border border-border/30">
                    <button
                        onClick={() => setFilterType('all')}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-lg transition-colors flex-1 lg:flex-none", 
                            filterType === 'all' 
                                ? "bg-background text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                        )}
                    >
                        {t('categories.all')}
                    </button>
                    <button
                        onClick={() => setFilterType('income')}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none", 
                            filterType === 'income' 
                                ? "bg-background text-emerald-500 shadow-sm" 
                                : "text-muted-foreground hover:text-emerald-500 hover:bg-foreground/5"
                        )}
                    >
                        <ArrowUpCircle size={14} /> {t('categories.income')}
                    </button>
                    <button
                        onClick={() => setFilterType('expense')}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none", 
                            filterType === 'expense' 
                                ? "bg-background text-rose-500 shadow-sm" 
                                : "text-muted-foreground hover:text-rose-500 hover:bg-foreground/5"
                        )}
                    >
                        <ArrowDownCircle size={14} /> {t('categories.expense')}
                    </button>
                </div>
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('categories.search_placeholder')}
                        className="pl-9 h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary/50 text-sm font-medium"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
                {filteredCategories.map(category => (
                    <div key={category.id} className="card-interactive p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center border border-border/30 group-hover:scale-105 transition-transform flex-shrink-0" style={{ backgroundColor: `${category.color}15` }}>
                                <div className="transform transition-transform duration-500 group-hover:rotate-[360deg]">
                                    {renderIcon(category.icon, category.color)}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-base text-foreground truncate mb-1">{category.name}</h3>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                    category.type === 'income' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        category.type === 'expense' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                            "bg-primary/10 text-primary border-primary/20"
                                )}>
                                    {category.type === 'income' ? t('categories.income_single') : category.type === 'expense' ? t('categories.expense_single') : t('categories.both')}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-foreground/5 rounded-lg" onClick={() => handleOpenEdit(category)}>
                                <Edit2 size={14} className="text-muted-foreground group-hover:text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-500/10 rounded-lg text-rose-500" onClick={() => handleDelete(category.id)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? t('categories.edit_category') : t('categories.new_category')}</DialogTitle>
                        <DialogDescription>{t('categories.dialog_desc')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>{t('categories.name_label')}</Label>
                            <Input
                                placeholder={t('categories.name_placeholder')}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('categories.type_label')}</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.type === 'income' ? 'default' : 'outline'}
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                    className={cn(
                                        "flex-1 gap-2",
                                        formData.type === 'income' && "bg-emerald-600 hover:bg-emerald-700 text-foreground"
                                    )}
                                >
                                    <ArrowUpCircle size={16} /> {t('categories.income_single')}
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                    className={cn(
                                        "flex-1 gap-2",
                                        formData.type === 'expense' && "bg-red-600 hover:bg-red-700 text-foreground"
                                    )}
                                >
                                    <ArrowDownCircle size={16} /> {t('categories.expense_single')}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('categories.color_label')}</Label>
                                <ColorPicker
                                    color={formData.color}
                                    onChange={color => setFormData({ ...formData, color })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('categories.icon_label')}</Label>
                                <IconPicker
                                    value={formData.icon}
                                    onChange={icon => setFormData({ ...formData, icon })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                        <Button onClick={handleSave}>{editingCategory ? t('categories.save_changes') : t('categories.create_category')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
