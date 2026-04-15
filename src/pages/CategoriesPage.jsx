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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-premium p-10 rounded-[3rem] border-white/10 mb-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <h2 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">{t('categories.title')}</h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                        {t('categories.subtitle')}
                    </p>
                </div>
                <Button 
                    onClick={handleOpenCreate} 
                    className="glass-premium border-white/20 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-white shadow-2xl gap-3 rounded-2xl h-14 font-black px-10 group transition-all duration-500 hover:scale-105 active:scale-95 mt-6 md:mt-0"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500 text-primary shadow-glow" /> 
                    <span className="tracking-tight">{t('categories.new_category')}</span>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between glass-premium p-6 rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-3xl">
                <div className="flex bg-black/20 p-1.5 rounded-2xl w-full lg:w-auto border border-white/5 shadow-inner">
                    <button
                        onClick={() => setFilterType('all')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500", 
                            filterType === 'all' 
                                ? "glass-premium bg-primary/20 text-primary shadow-glow" 
                                : "text-white/20 hover:text-white/40 hover:bg-white/5"
                        )}
                    >
                        {t('categories.all')}
                    </button>
                    <button
                        onClick={() => setFilterType('income')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center gap-3", 
                            filterType === 'income' 
                                ? "glass-premium bg-emerald-500/20 text-emerald-500 shadow-glow" 
                                : "text-white/20 hover:text-emerald-500/60 hover:bg-white/5"
                        )}
                    >
                        <ArrowUpCircle size={14} className={cn(filterType === 'income' && "shadow-glow")} /> {t('categories.income')}
                    </button>
                    <button
                        onClick={() => setFilterType('expense')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center gap-3", 
                            filterType === 'expense' 
                                ? "glass-premium bg-rose-500/20 text-rose-500 shadow-glow" 
                                : "text-white/20 hover:text-rose-500/60 hover:bg-white/5"
                        )}
                    >
                        <ArrowDownCircle size={14} /> {t('categories.expense')}
                    </button>
                </div>
                <div className="relative w-full lg:w-96 group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder={t('categories.search_placeholder')}
                        className="pl-14 h-14 rounded-2xl bg-black/20 border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary/50 text-sm font-black tracking-tight text-white placeholder:text-white/10 border-white/5 shadow-inner"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
                {filteredCategories.map(category => (
                    <div key={category.id} className="glass-premium rounded-[2.5rem] border-white/10 group active:scale-95 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="p-8 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center glass-premium border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${category.color}15` }}>
                                    <div className="transform transition-transform duration-700 group-hover:rotate-[360deg] drop-shadow-glow">
                                        {renderIcon(category.icon, category.color)}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-lg tracking-tighter text-white truncate mb-1 drop-shadow-md">{category.name}</h3>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border shadow-glow",
                                        category.type === 'income' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            category.type === 'expense' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                "bg-primary/10 text-primary border-primary/20"
                                    )}>
                                        {category.type === 'income' ? t('categories.income_single') : category.type === 'expense' ? t('categories.expense_single') : t('categories.both')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 rounded-xl glass-premium border-white/5" onClick={() => handleOpenEdit(category)}>
                                    <Edit2 size={16} className="text-white/40 group-hover:text-primary transition-colors" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 rounded-xl glass-premium border-white/5" onClick={() => handleDelete(category.id)}>
                                    <Trash2 size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
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
