import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { useTranslation } from 'react-i18next';

export const GoalForm = ({ onSubmit, initialData, onCancel }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData?.name || '');
    const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount || '');
    const [currentSaved, setCurrentSaved] = useState(initialData?.currentSaved || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            targetAmount: parseFloat(targetAmount) || 0,
            currentSaved: parseFloat(currentSaved) || 0
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('goals.goal_name')}</label>
                <Input
                    placeholder={t('goals.goal_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 rounded-2xl"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('goals.target_amount')}</label>
                <MoneyInput
                    value={targetAmount}
                    onChange={setTargetAmount}
                    required
                    className="h-11 rounded-2xl"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('goals.current_saved')}</label>
                <MoneyInput
                    value={currentSaved}
                    onChange={setCurrentSaved}
                    className="h-11 rounded-2xl"
                />
            </div>
            <div className="flex gap-3 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" className="flex-1 h-11 rounded-2xl" onClick={onCancel}>
                        {t('common.cancel')}
                    </Button>
                )}
                <Button type="submit" className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-primary to-blue-600">
                    {t('goals.save_goal')}
                </Button>
            </div>
        </form>
    );
};
