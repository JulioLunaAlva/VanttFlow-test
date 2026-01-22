import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, X, Bot, User, ArrowRight, Wallet, History, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseAISuggestion } from '@/utils/aiParser';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/utils/haptic';

export const VanttAIChat = () => {
    const { t } = useTranslation();
    const { categories, addTransaction, getAIRecommendations } = useFinance();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: t('ai.welcome_msg', { defaultValue: '¡Hola! Soy VanttAI. ¿En qué puedo ayudarte hoy?' }) }
    ]);
    const [suggestedTransaction, setSuggestedTransaction] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const processInput = (text) => {
        if (!text.trim()) return;

        triggerHaptic('light');
        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);

        // 1. Check for advice intent
        const lowerInput = text.toLowerCase();
        const adviceKeywords = ['consejo', 'tip', 'ayuda', 'cómo voy', 'como voy', 'advice', 'how am i', 'health', 'salud', 'status'];

        if (adviceKeywords.some(kw => lowerInput.includes(kw))) {
            const recommendations = getAIRecommendations();
            if (recommendations.length > 0) {
                // Return each recommendation as a separate bubble or a single block
                const formattedRecommendations = recommendations.map(rec => {
                    const title = t(rec.title_key);
                    const desc = t(rec.desc_key, rec.params || {});
                    return `### ${title}\n${desc}`;
                }).join('\n\n---\n\n');

                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: formattedRecommendations
                }]);
                return;
            }
        }

        // 2. Process for transaction logging
        const suggestion = parseAISuggestion(text, categories);

        if (suggestion && suggestion.amount) {
            setSuggestedTransaction(suggestion);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: t('ai.suggestion_msg', { defaultValue: 'He detectado una transacción. ¿Quieres registrarla?' })
            }]);
        } else {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: t('ai.dont_understand', { defaultValue: 'No estoy seguro de haber entendido. Intenta algo como "Gasté 50 en comida".' })
            }]);
        }
    };

    const handleSend = () => {
        processInput(input);
        setInput('');
    };

    const confirmTransaction = () => {
        if (!suggestedTransaction) return;

        addTransaction(suggestedTransaction);
        triggerHaptic('medium');

        setMessages(prev => [...prev, {
            role: 'ai',
            content: t('ai.transaction_logged', { defaultValue: '¡Listo! Transacción registrada correctamente.' })
        }]);
        setSuggestedTransaction(null);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.div
                className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl transition-all duration-500",
                        isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-to-tr from-primary via-blue-600 to-purple-600"
                    )}
                >
                    {isOpen ? <X size={24} /> : <div className="relative"><Bot size={28} /><Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" size={14} /></div>}
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
                        className="fixed bottom-36 right-4 z-50 w-[90vw] md:w-[400px] md:bottom-28 md:right-8"
                    >
                        <Card className="border-border/40 bg-card/60 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-primary/20 to-purple-600/20 border-b border-border/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Bot size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black tracking-tighter uppercase">VanttAI</h3>
                                        <div className="flex items-center gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] text-muted-foreground font-bold">{t('ai.online', { defaultValue: 'SISTEMA ACTIVO' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                                        Beta
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-0">
                                <div
                                    ref={scrollRef}
                                    className="h-[350px] overflow-y-auto p-4 space-y-4 scroll-smooth"
                                >
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                msg.role === 'user' ? "ml-auto flex flex-row-reverse items-start gap-2 max-w-[85%]" : "flex items-start gap-2 max-w-[85%]"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line",
                                                msg.role === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted/50 backdrop-blur-md rounded-tl-none border border-border/20"
                                            )}>
                                                {msg.content.split('\n').map((line, idx) => (
                                                    <React.Fragment key={idx}>
                                                        {line.startsWith('###') ? (
                                                            <span className="font-black uppercase text-[10px] tracking-widest text-primary block mt-2 mb-1">
                                                                {line.replace('###', '').trim()}
                                                            </span>
                                                        ) : (
                                                            <span>{line}</span>
                                                        )}
                                                        {idx < msg.content.split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {suggestedTransaction && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <History size={14} className="text-primary" />
                                                    <span className="text-xs font-black uppercase tracking-widest">{t('ai.confirm_transaction', { defaultValue: 'CONFIRMAR REGISTRO' })}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between bg-card/40 p-3 rounded-xl border border-border/20">
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-bold uppercase">{suggestedTransaction.description}</p>
                                                    <p className="text-lg font-black tracking-tighter">
                                                        {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'MXN' }).format(suggestedTransaction.amount)}
                                                    </p>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Wallet size={16} className="text-primary" />
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={confirmTransaction}
                                                    className="flex-1 bg-primary hover:bg-primary/90 h-9 rounded-xl font-bold text-xs"
                                                >
                                                    {t('common.confirm', { defaultValue: 'Confirmar' })}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setSuggestedTransaction(null)}
                                                    className="h-9 w-9 p-0 rounded-xl"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-border/40 bg-card/20 backdrop-blur-xl">
                                    <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => processInput(t('ai.advice.ask_advice'))}
                                            className="grow-0 shrink-0 h-7 rounded-full text-[10px] font-black uppercase border-primary/20 bg-primary/5 hover:bg-primary/10"
                                        >
                                            {t('ai.advice.ask_advice')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => processInput(t('ai.advice.how_am_i'))}
                                            className="grow-0 shrink-0 h-7 rounded-full text-[10px] font-black uppercase border-primary/20 bg-primary/5 hover:bg-primary/10"
                                        >
                                            {t('ai.advice.how_am_i')}
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={t('ai.placeholder', { defaultValue: '¿Qué gastaste hoy?' })}
                                            className="bg-background/50 border-border/40 focus:ring-primary/20 rounded-xl px-4 h-10 text-xs"
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={!input.trim()}
                                            className="bg-primary hover:bg-primary/90 rounded-xl h-10 w-10 p-0 shadow-lg shadow-primary/20"
                                        >
                                            <Send size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
