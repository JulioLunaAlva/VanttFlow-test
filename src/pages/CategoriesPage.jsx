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
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-6 border-white/10 mb-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground">{t('categories.title')}</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">{t('categories.subtitle')}</p>
                </div>
                <Button onClick={handleOpenCreate} className="shadow-2xl gap-2 rounded-2xl h-12 font-black px-8 group transition-all duration-500 scale-100 hover:scale-105 active:scale-95 shadow-primary/20">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> {t('categories.new_category')}
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between glass-card p-4 border-white/5">
                <div className="flex bg-white/5 p-1 rounded-2xl w-full lg:w-auto border border-white/5">
                    <button
                        onClick={() => setFilterType('all')}
                        className={cn("px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", filterType === 'all' ? "glass-premium shadow-xl text-primary" : "text-muted-foreground/40 hover:text-foreground hover:bg-white/5")}
                    >
                        {t('categories.all')}
                    </button>
                    <button
                        onClick={() => setFilterType('income')}
                        className={cn("px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2", filterType === 'income' ? "glass-premium shadow-xl text-emerald-500" : "text-muted-foreground/40 hover:text-emerald-500/60 hover:bg-white/5")}
                    >
                        <ArrowUpCircle size={14} /> {t('categories.income')}
                    </button>
                    <button
                        onClick={() => setFilterType('expense')}
                        className={cn("px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2", filterType === 'expense' ? "glass-premium shadow-xl text-rose-500" : "text-muted-foreground/40 hover:text-rose-500/60 hover:bg-white/5")}
                    >
                        <ArrowDownCircle size={14} /> {t('categories.expense')}
                    </button>
                </div>
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input
                        placeholder={t('categories.search_placeholder')}
                        className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-primary focus-visible:border-primary/50 text-sm font-medium"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCategories.map(category => (
                    <div key={category.id} className="glass-card card-glow group relative border-white/10 transition-all duration-500 hover:scale-[1.03]">
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center glass-premium border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${category.color}20` }}>
                                    {renderIcon(category.icon, category.color)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-sm tracking-tight truncate mb-1">{category.name}</h3>
                                    <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full",
                                        category.type === 'income' ? "bg-emerald-500/10 text-emerald-500" :
                                            category.type === 'expense' ? "bg-rose-500/10 text-rose-500" :
                                                "bg-primary/10 text-primary"
                                    )}>
                                        {category.type === 'income' ? t('categories.income_single') : category.type === 'expense' ? t('categories.expense_single') : t('categories.both')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 rounded-lg" onClick={() => handleOpenEdit(category)}>
                                    <Edit2 size={14} className="opacity-50" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-500/5 rounded-lg" onClick={() => handleDelete(category.id)}>
                                    <Trash2 size={14} className="opacity-50" />
                                </Button>
                            </div>
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
                                        formData.type === 'income' && "bg-emerald-600 hover:bg-emerald-700 text-white"
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
                                        formData.type === 'expense' && "bg-red-600 hover:bg-red-700 text-white"
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
