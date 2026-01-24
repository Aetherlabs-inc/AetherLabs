'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="relative flex items-center justify-center w-full min-h-screen bg-background">
            {/* Cosmic particle effect (background dots) */}
            <div className="absolute inset-0 cosmic-grid opacity-30"></div>

            {/* Gradient glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
                <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center justify-center space-y-6"
            >
                {/* Icon container with glow effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-foreground">Loading</p>
                    <p className="text-sm text-muted-foreground">Please wait while we load the content</p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
