import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const TOUR_STEPS = [
    {
        target: 'tour-balance',
        title: 'Tu Salud Financiera',
        content: 'Aquí puedes ver tu balance total consolidado de todas tus cuentas en tiempo real.',
        position: 'bottom'
    },
    {
        target: 'tour-add',
        title: 'Acción Rápida',
        content: 'Este es el corazón de VanttFlow. Úsalo para registrar tus gastos e ingresos al instante.',
        position: 'top'
    },
    {
        target: 'tour-goals',
        title: 'Tus Sueños',
        content: 'Lleva el control de tus metas de ahorro. Cada moneda cuenta para llegar a tu objetivo.',
        position: 'top'
    },
    {
        target: 'tour-analytics',
        title: 'Análisis Inteligente',
        content: 'Visualiza en qué gastas más y toma mejores decisiones con estas gráficas dinámicas.',
        position: 'top'
    }
];

export const AppTour = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [coords, setCoords] = useState(null);

    const updateCoords = useCallback(() => {
        const step = TOUR_STEPS[currentStep];
        const element = document.getElementById(step.target);
        if (element) {
            const rect = element.getBoundingClientRect();
            setCoords({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            });
        }
    }, [currentStep]);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('vanttflow_tour_completed');
        if (!hasSeenTour) {
            // Delay start slightly for layout to settle
            const timer = setTimeout(() => {
                setIsVisible(true);
                updateCoords();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [updateCoords]);

    useEffect(() => {
        if (isVisible) {
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords);
            updateCoords();
        }
        return () => {
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords);
        };
    }, [isVisible, updateCoords]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const completeTour = () => {
        setIsVisible(false);
        localStorage.setItem('vanttflow_tour_completed', 'true');
    };

    if (!isVisible || !coords) return null;

    const step = TOUR_STEPS[currentStep];

    // Calculate tooltip position
    const tooltipStyle = {};
    if (step.position === 'bottom') {
        tooltipStyle.top = coords.top + coords.height + 20;
        tooltipStyle.left = Math.max(10, Math.min(coords.left + coords.width / 2 - 140, window.innerWidth - 290));
    } else {
        tooltipStyle.bottom = (window.innerHeight - coords.top) + 20;
        tooltipStyle.left = Math.max(10, Math.min(coords.left + coords.width / 2 - 140, window.innerWidth - 290));
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Darkened Backdrop with Spotlight */}
            <div
                className="absolute inset-0 bg-black/70 transition-all duration-500 pointer-events-auto"
                style={{
                    clipPath: `polygon(
                        0% 0%, 
                        0% 100%, 
                        ${coords.left}px 100%, 
                        ${coords.left}px ${coords.top}px, 
                        ${coords.left + coords.width}px ${coords.top}px, 
                        ${coords.left + coords.width}px ${coords.top + coords.height}px, 
                        ${coords.left}px ${coords.top + coords.height}px, 
                        ${coords.left}px 100%, 
                        100% 100%, 
                        100% 0%
                    )`
                }}
                onClick={completeTour}
            />

            {/* Highlight Border/Glow */}
            <div
                className="absolute border-2 border-primary rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500"
                style={{
                    top: coords.top - 4,
                    left: coords.left - 4,
                    width: coords.width + 8,
                    height: coords.height + 8
                }}
            />

            {/* Tooltip Card */}
            <div
                className="absolute w-[280px] bg-card border border-slate-700 rounded-2xl p-5 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
                style={tooltipStyle}
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                        <Sparkles size={16} />
                    </div>
                    <h4 className="font-bold text-sm">{step.title}</h4>
                    <button
                        onClick={completeTour}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {step.content}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {TOUR_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all ${i === currentStep ? 'w-4 bg-primary' : 'w-1.5 bg-slate-800'}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <Button variant="ghost" size="sm" onClick={handlePrev}>
                                <ChevronLeft size={16} />
                            </Button>
                        )}
                        <Button size="sm" onClick={handleNext} className="gap-1">
                            {currentStep === TOUR_STEPS.length - 1 ? 'Listo' : 'Sig'}
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
