import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const PET_CONFIGS = {
    fox: {
        name: 'Zorrito',
        emoji: '🦊',
        color: 'from-orange-400 to-red-500',
        messages: {
            happy: '¡Todo bajo control! Estamos ahorrando de maravilla.',
            neutral: 'Cuidado con esos antojos, nos acercamos al límite.',
            sad: '¡Auxilio! El presupuesto está en llamas. 🔥'
        }
    },
    dog: {
        name: 'Puggy',
        emoji: '🐶',
        color: 'from-yellow-400 to-amber-600',
        messages: {
            happy: '¡Eres el mejor dueño! Todo está en orden.',
            neutral: 'Guau... ¿Seguro que necesitamos esto?',
            sad: '¡Tengo hambre y los números están en rojo! 🦴'
        }
    },
    shinobi: {
        name: 'Shinobi',
        emoji: '🥷',
        color: 'from-slate-700 to-slate-900',
        messages: {
            happy: 'Disciplina perfecta. Tu camino financiero es honorable.',
            neutral: 'Mantén la guardia alta, se avecinan gastos.',
            sad: '¡Nuestra defensa presupuestaria ha caído!'
        }
    },
    chief: {
        name: 'Master Chief',
        emoji: '🛡️',
        color: 'from-green-600 to-emerald-900',
        messages: {
            happy: 'Misión cumplida. Reservas al máximo.',
            neutral: 'Cortana, detecto anomalías en el presupuesto.',
            sad: '¡Escudos caídos! Necesitamos reabastecimiento urgente.'
        }
    },
    kitty: {
        name: 'Luna',
        emoji: '✨',
        color: 'from-pink-400 to-fuchsia-600',
        messages: {
            happy: '¡Qué brillo! Estás manejando todo súper bien.',
            neutral: 'Uy, un poco menos de brillo por aquí...',
            sad: '¡Aah! Todo está un poco oscuro con estos gastos.'
        }
    },
    pocket: {
        name: 'Pika-Finanzas',
        emoji: '⚡',
        color: 'from-yellow-300 to-yellow-500',
        messages: {
            happy: '¡Pika-Pika! (¡Estamos ahorrando mucha energía!)',
            neutral: 'Pika... (Siento una descarga de gastos)',
            sad: '¡PIKAAAAA! (¡Sobrecarga de presupuesto!)'
        }
    },
    maiden: {
        name: 'Dama Mágica',
        emoji: '👸',
        color: 'from-purple-400 to-indigo-600',
        messages: {
            happy: 'La magia del ahorro está con nosotros.',
            neutral: 'Siento una perturbación en tu flujo de dinero.',
            sad: '¡Oh no! El hechizo del ahorro se ha roto.'
        }
    }
};

export const SpiritPet = ({ size = 'md', showBubble = true, className }) => {
    const { t } = useTranslation();
    const { selectedPet, isEnabled } = useGamification();
    const { budgets, transactions, summary: financeSummary } = useFinance();

    if (!isEnabled) return null;

    const pet = PET_CONFIGS[selectedPet] || PET_CONFIGS.fox;

    // Calculate budget health
    const status = useMemo(() => {
        if (!budgets || budgets.length === 0) return 'happy';
        if (!transactions) return 'happy';

        const summary = financeSummary || { expense: 0 };
        const overBudget = budgets.some(b => {
            const budgetTransactions = transactions.filter(t =>
                t.type === 'expense' && String(t.category) === String(b.categoryId)
            );
            const totalSpent = budgetTransactions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            return totalSpent > Number(b.amount || 0);
        });

        if (overBudget) return 'sad';

        const totalLimit = budgets.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        if (summary.expense > totalLimit * 0.9) return 'neutral';

        return 'happy';
    }, [budgets, transactions, financeSummary]);

    const sizeClasses = {
        sm: 'w-10 h-10 text-xl',
        md: 'w-20 h-20 text-4xl',
        lg: 'w-32 h-32 text-6xl'
    };

    return (
        <div className={cn("relative flex items-center gap-4", className)}>
            <div className="relative group/pet">
                {/* Visual Aura */}
                <div className={cn(
                    "absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-all duration-700 animate-pulse bg-gradient-to-br",
                    pet.color
                )} />

                {/* Floating Container */}
                <div className={cn(
                    "relative flex items-center justify-center rounded-full bg-card border-2 border-border shadow-2xl transition-all duration-500 animate-float",
                    sizeClasses[size],
                    status === 'sad' && 'grayscale brightness-75'
                )}>
                    <span className={cn(
                        "transition-transform duration-500 group-hover/pet:scale-125",
                        status === 'happy' && 'animate-bounce',
                        status === 'neutral' && 'animate-pulse'
                    )}>
                        {pet.emoji}
                    </span>

                    {/* Shadow underneath */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 blur-sm rounded-full" />
                </div>
            </div>

            {showBubble && (
                <div className="relative animate-in fade-in slide-in-from-left-2 duration-500 z-50">
                    <div className="bg-card/95 backdrop-blur-xl border border-border p-3 rounded-2xl rounded-tl-none shadow-xl max-w-[200px]">
                        <p className="text-xs font-medium text-foreground leading-relaxed italic">
                            "{t(`dashboard.pets.${selectedPet}.${status}`)}"
                        </p>
                    </div>
                    {/* Speech bubble tail */}
                    <div className="absolute top-0 -left-2 w-2 h-2 bg-card border-l border-t border-border" />
                </div>
            )}
        </div>
    );
};
