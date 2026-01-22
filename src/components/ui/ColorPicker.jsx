import React from 'react';

const COLOR_FAMILIES = [
    {
        name: 'Rojos',
        colors: ['#dc2626', '#ef4444', '#f87171', '#fca5a5']
    },
    {
        name: 'Naranjas',
        colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74']
    },
    {
        name: 'Amarillos',
        colors: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d']
    },
    {
        name: 'Limas',
        colors: ['#65a30d', '#84cc16', '#a3e635', '#bef264']
    },
    {
        name: 'Verdes',
        colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac']
    },
    {
        name: 'Esmeraldas',
        colors: ['#059669', '#10b981', '#34d399', '#6ee7b7']
    },
    {
        name: 'Azules Agua',
        colors: ['#0d9488', '#14b8a6', '#06b6d4', '#22d3ee']
    },
    {
        name: 'Azules',
        colors: ['#0284c7', '#0ea5e9', '#2563eb', '#3b82f6']
    },
    {
        name: 'Índigos',
        colors: ['#4f46e5', '#6366f1', '#7c3aed', '#8b5cf6']
    },
    {
        name: 'Púrpuras',
        colors: ['#9333ea', '#a855f7', '#c026d3', '#d946ef']
    },
    {
        name: 'Rosas',
        colors: ['#db2777', '#ec4899', '#e11d48', '#f43f5e']
    },
    {
        name: 'Grises',
        colors: ['#1f2937', '#374151', '#6b7280', '#9ca3af']
    }
];

export const ColorPicker = ({ value, onChange }) => {
    return (
        <div className="max-h-[320px] overflow-y-auto pr-2 -mr-2 scroll-smooth-mobile">
            <div className="space-y-3">
                {COLOR_FAMILIES.map((family, familyIndex) => (
                    <div key={family.name}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-foreground/40 mb-1.5 px-0.5">
                            {family.name}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {family.colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-full aspect-square rounded-xl border-2 transition-all active:scale-95 ${value === color
                                            ? 'border-primary scale-105 shadow-lg ring-2 ring-primary/20'
                                            : 'border-border/30 hover:border-border hover:scale-105 hover:shadow-md'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => onChange(color)}
                                    aria-label={`Select ${family.name} color ${color}`}
                                >
                                    {value === color && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-white drop-shadow-lg"
                                                fill="none"
                                                strokeWidth="3"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        {familyIndex < COLOR_FAMILIES.length - 1 && (
                            <div className="h-px bg-border/20 mt-3" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
