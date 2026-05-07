import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw, Lightbulb, TrendingDown, Wallet } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { getAIBudgetAdvice } from '@/utils/gemini';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export const AIAdviceWidget = () => {
    const { summary } = useFinance();
    const [advice, setAdvice] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasKey, setHasKey] = useState(!!import.meta.env.VITE_GEMINI_API_KEY);

    useEffect(() => {
        // Double check key availability on mount
        setHasKey(!!import.meta.env.VITE_GEMINI_API_KEY);
    }, []);

    const fetchAdvice = async () => {
        setIsLoading(true);
        try {
            const data = await getAIBudgetAdvice(summary);
            if (data && data.error) {
                setAdvice([`API Error: ${data.error}`]);
            } else if (data && Array.isArray(data)) {
                setAdvice(data);
            } else {
                setAdvice(["No se pudo obtener asesoramiento en este momento."]);
            }
        } catch (err) {
            setAdvice(["Error al conectar con VanttAI."]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch advice only if we have some data
        if (summary.income > 0 || summary.expense > 0) {
            fetchAdvice();
        }
    }, []);

    return (
        <div className="h-full flex flex-col relative group overflow-hidden">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="p-6 border-b border-border/30 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className={cn(
                        "p-2 rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-110",
                        hasKey ? "bg-primary/10 text-primary animate-pulse" : "bg-muted/10 text-muted-foreground"
                    )}>
                        <Sparkles size={20} />
                    </span>
                    <span className="flex items-center gap-2">
                        VanttAI Advisor
                        {!hasKey && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-red-500/20">Offline</span>}
                    </span>
                </h3>
                <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-10 w-10 rounded-2xl bg-foreground/5 border border-border/30 hover:bg-primary/20 hover:text-primary transition-all active:scale-95" 
                    onClick={fetchAdvice}
                    disabled={isLoading}
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                </Button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 py-4"
                            >
                                <div className="h-6 bg-foreground/5 animate-pulse rounded-2xl w-3/4 border border-border/30" />
                                <div className="h-6 bg-foreground/5 animate-pulse rounded-2xl w-5/6 border border-border/30" />
                                <div className="h-6 bg-foreground/5 animate-pulse rounded-2xl w-2/3 border border-border/30" />
                            </motion.div>
                        ) : advice.length > 0 ? (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                {advice.map((item, index) => (
                                    <div key={index} className="group/item flex gap-4 items-start p-4 rounded-[2rem] bg-foreground/5 border border-border/30 hover:border-primary/20 hover:bg-foreground/10 transition-all duration-300">
                                        <div className={cn(
                                            "p-3 rounded-2xl shadow-lg transition-transform duration-500 group-hover/item:scale-110",
                                            index === 0 ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                        )}>
                                            {index === 0 ? <Lightbulb size={20} /> : <TrendingDown size={20} />}
                                        </div>
                                        <p className="text-xs font-bold leading-relaxed italic opacity-80 group-hover/item:opacity-100 transition-opacity">
                                            "{item}"
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto border border-border/30 relative">
                                    <Wallet className="text-muted-foreground/30" size={32} />
                                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-[20px] -z-10" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 max-w-[180px] mx-auto leading-relaxed">
                                    Registra más movimientos para recibir consejos personalizados
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="mt-8 pt-4 border-t border-border/30">
                    <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mt-3 text-center">
                        Intelligence Core: Gemini 1.5 Flash
                    </p>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        </div>
    );
};
