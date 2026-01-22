import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TransactionImageViewer = ({ attachment, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.5, 0.5));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleReset = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = attachment.base64;
        link.download = attachment.name || 'comprobante.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                const blob = await (await fetch(attachment.base64)).blob();
                const file = new File([blob], attachment.name || 'comprobante.jpg', { type: blob.type });
                await navigator.share({
                    files: [file],
                    title: 'Comprobante de transacción',
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        }
    };

    const handleMouseDown = (e) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (scale > 1 && e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging && scale > 1 && e.touches.length === 1) {
            setPosition({
                x: e.touches[0].clientX - dragStart.x,
                y: e.touches[0].clientY - dragStart.y
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            // Reset on close
            handleReset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent
                className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 backdrop-blur-xl border-0 overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full flex flex-col"
                        >
                            {/* Header with controls */}
                            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-lg truncate">
                                            {attachment.name || 'Comprobante'}
                                        </h3>
                                        <p className="text-white/60 text-sm">
                                            Toca para cerrar • Pellizca para zoom
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-white/20 rounded-full"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>

                            {/* Image container */}
                            <div
                                className="flex-1 flex items-center justify-center overflow-hidden relative"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <motion.img
                                    src={attachment.base64}
                                    alt={attachment.name || 'Comprobante'}
                                    className={cn(
                                        "max-w-full max-h-full object-contain select-none",
                                        scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                                    )}
                                    style={{
                                        transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                                    }}
                                    drag={false}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Bottom toolbar */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="flex items-center justify-center gap-2">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-xl"
                                            onClick={handleZoomOut}
                                            disabled={scale <= 0.5}
                                        >
                                            <ZoomOut className="w-5 h-5" />
                                        </Button>
                                        <div className="px-3 text-white font-bold text-sm min-w-[60px] text-center">
                                            {Math.round(scale * 100)}%
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-xl"
                                            onClick={handleZoomIn}
                                            disabled={scale >= 4}
                                        >
                                            <ZoomIn className="w-5 h-5" />
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
                                            onClick={handleRotate}
                                        >
                                            <RotateCw className="w-5 h-5" />
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
                                            onClick={handleDownload}
                                        >
                                            <Download className="w-5 h-5" />
                                        </Button>
                                    </motion.div>

                                    {navigator.share && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.25 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-white hover:bg-white/20 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
                                                onClick={handleShare}
                                            >
                                                <Share2 className="w-5 h-5" />
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>

                                {scale !== 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center mt-2"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
                                            onClick={handleReset}
                                        >
                                            Restablecer vista
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};
