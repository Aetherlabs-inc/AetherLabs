'use client'

import React from 'react';
import { Clock, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ComingSoonProps {
    title?: string;
    description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
    title = "Coming Soon", 
    description = "We're working hard to bring you something amazing. This page will be available soon!" 
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-background">
            {/* Cosmic particle effect (background dots) */}
            <div className="absolute inset-0 cosmic-grid opacity-30"></div>

            {/* Gradient glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
                <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center border border-border">
                            <Clock className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
                        {description}
                    </p>
                </div>

                {/* Additional info */}
                <div className="pt-4 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>Stay updated by joining our waitlist</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link href="/waitlist">
                                Join Waitlist
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;

