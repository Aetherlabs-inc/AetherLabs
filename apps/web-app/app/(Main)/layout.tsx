'use client';

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    Separator,
} from "@aetherlabs/ui"
import { Breadcrumbs, HeaderActions } from "@/src/components/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4" />
                        <Breadcrumbs />
                    </div>
                    <div className="ml-auto px-4">
                        <HeaderActions />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {/* Render Page Content */}
                    <div className="flex-1 rounded-xl bg-background md:min-h-min overflow-hidden">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
