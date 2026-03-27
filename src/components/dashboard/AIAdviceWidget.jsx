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
            if (data && Array.isArray(data)) {
                setAdvice(data);
            }
        } catch (error) {
            console.error("Error fetching AI advice:", error);
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
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5 backdrop-blur-xl group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className={cn(hasKey ? "text-primary animate-pulse" : "text-muted-foreground")} size={16} />
                    VanttAI Advisor
                    {!hasKey && <span className="text-[10px] text-red-500 font-bold ml-2">Offline</span>}
                </CardTitle>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-primary/10" 
                    onClick={fetchAdvice}
                    disabled={isLoading}
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3 py-4"
                        >
                            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                        </motion.div>
                    ) : advice.length > 0 ? (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                        >
                            {advice.map((item, index) => (
                                <div key={index} className="flex gap-3 items-start p-3 rounded-2xl bg-background/50 border border-border/40 hover:border-primary/30 transition-colors">
                                    <div className={`p-2 rounded-xl ${index === 0 ? "bg-amber-500/10" : "bg-blue-500/10"}`}>
                                        {index === 0 ? <Lightbulb size={16} className="text-amber-500" /> : <TrendingDown size={16} className="text-blue-500" />}
                                    </div>
                                    <p className="text-xs font-medium leading-relaxed italic">
                                        "{item}"
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-8 text-center space-y-2 opacity-50">
                            <Wallet className="mx-auto h-8 w-8 mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                Registra más movimientos para recibir consejos
                            </p>
                        </div>
                    )}
                </AnimatePresence>
                
                <div className="pt-2">
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 10, repeat: Infinity }}
                        />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mt-2 text-right">
                        Powered by Gemini 1.5 Flash
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
