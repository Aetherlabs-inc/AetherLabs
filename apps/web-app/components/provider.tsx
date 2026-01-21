"use client";
import React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '@/src/components/auth-provider'

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme='light' disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </AuthProvider>
    )
}
