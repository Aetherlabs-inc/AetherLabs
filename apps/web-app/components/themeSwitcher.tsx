"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

interface ThemeSwitcherProps {
    size?: number;
    className?: string;
}

export function ThemeSwitcher({ size = 18, className = "" }: ThemeSwitcherProps) {
    const { theme, setTheme } = useTheme()

    // Check if current theme is dark
    const isDarkMode = theme === 'dark'

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className={`flex items-center gap-2 rounded-full px-3 py-2 ${className}`}>
            <Moon size={size} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
                checked={!isDarkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
            />
            <Sun size={size} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
    )
}

// Mobile version with label
export function ThemeSwitcherWithLabel({ size = 16, className = "" }: ThemeSwitcherProps) {
    const { theme, setTheme } = useTheme()

    // Check if current theme is dark
    const isDarkMode = theme === 'dark'

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className={`flex items-center justify-between px-3 py-2 ${className}`}>
            <span className="text-sm text-muted-foreground">Theme</span>
            <div className="flex items-center gap-2">
                <Moon size={size} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                <Switch
                    checked={!isDarkMode}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-primary"
                />
                <Sun size={size} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
        </div>
    )
}
