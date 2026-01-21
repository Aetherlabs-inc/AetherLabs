'use client';

import React, { useState } from "react";
import { Image, FileCheck, Clock, Plus, BarChart3, Activity, Users, FileText, Bell, Search, Home, Settings, HelpCircle, CreditCard, LogOut, User as UserIcon, Shield, AlertCircle, Eye, Wifi, CheckCircle, Filter } from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const DashboardPreview = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    // Mock data for preview
    const stats = {
        totalArtworks: 1250,
        issuedCertificates: 980,
        inProcessCertificates: 270,
    };

    const recentActivity = [
        { type: "artwork", title: "The Starry Night", action: "Added", time: "2h ago" },
        { type: "certificate", title: "Mona Lisa", action: "Issued", time: "4h ago" },
        { type: "verification", title: "The Persistence of Memory", action: "Verified", time: "5h ago" },
        { type: "certificate", title: "The Scream", action: "Issued", time: "7h ago" },
    ];

    // Chart data for certificate issuance trend
    const certificateTrendData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Certificates Issued",
                data: [120, 150, 180, 140, 160, 156],
                borderColor: "hsl(var(--primary))",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                tension: 0.4,
            },
        ],
    };

    // Chart data for artwork categories
    const categoryData = {
        labels: ["Paintings", "Sculptures", "Digital Art", "Photography", "Other"],
        datasets: [
            {
                data: [45, 20, 15, 10, 10],
                backgroundColor: [
                    "hsl(var(--primary))",
                    "hsl(var(--primary) / 0.8)",
                    "hsl(var(--primary) / 0.6)",
                    "hsl(var(--primary) / 0.4)",
                    "hsl(var(--primary) / 0.2)",
                ],
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    color: "hsl(var(--border))",
                },
                ticks: {
                    color: "hsl(var(--muted-foreground))",
                },
            },
            y: {
                grid: {
                    color: "hsl(var(--border))",
                },
                ticks: {
                    color: "hsl(var(--muted-foreground))",
                },
            },
        },
    };

    const doughnutOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    // Preview sidebar navigation groups
    const navGroups = [
        {
            label: "Main",
            items: [
                { title: "Dashboard", icon: Home, section: "dashboard" },
                { title: "Artworks", icon: Image, section: "artworks" },
                { title: "Profile", icon: UserIcon, section: "profile" },
            ],
        },
        {
            label: "Management",
            items: [
                { title: "Artists", icon: Users, section: "artists" },
                { title: "Users", icon: Users, section: "users" },
                { title: "Billing", icon: CreditCard, section: "billing" },
            ],
        },
        {
            label: "Settings & Support",
            items: [
                { title: "Settings", icon: Settings, section: "settings" },
                { title: "Help & Support", icon: HelpCircle, section: "help" },
                { title: "Logout", icon: LogOut, section: "logout" },
            ],
        },
    ];

    const handleNavClick = (section: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (section === 'logout') return; // Don't navigate for logout in preview
        setActiveSection(section);
    };

    return (
        <SidebarProvider className="w-full">
            <Sidebar className="border-r border-border">
                <SidebarHeader>
                    <div className="flex items-center gap-2 px-4 py-2">
                        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">A</span>
                        </div>
                        <span className="font-semibold text-foreground">AetherLabs</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {navGroups.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={activeSection === item.section}
                                            >
                                                <a
                                                    href="#"
                                                    onClick={(e) => handleNavClick(item.section, e)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <item.icon size={18} />
                                                    {item.title}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <div className="flex-1 bg-background p-4">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                            {activeSection === 'dashboard' && 'Dashboard Overview'}
                            {activeSection === 'artworks' && 'Artworks'}
                            {activeSection === 'profile' && 'Profile'}
                            {activeSection === 'artists' && 'Artists'}
                            {activeSection === 'users' && 'Users'}
                            {activeSection === 'billing' && 'Billing'}
                            {activeSection === 'settings' && 'Settings'}
                            {activeSection === 'help' && 'Help & Support'}
                        </h2>
                        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8 self-end sm:self-auto">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <div className="relative w-full sm:w-[200px]">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Search..." className="h-9 w-full pl-8 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Section */}
                    {activeSection === 'dashboard' && (
                        <>
                            {/* Stats Cards */}
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <Card>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Total Artworks</p>
                                                <p className="text-xl font-bold text-foreground mt-1">{stats.totalArtworks.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <Image className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Issued Certificates</p>
                                                <p className="text-xl font-bold text-foreground mt-1">{stats.issuedCertificates.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <FileCheck className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">In Process</p>
                                                <p className="text-xl font-bold text-foreground mt-1">{stats.inProcessCertificates.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <Clock className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions & Recent Activity */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
                                                <Image className="w-4 h-4 mr-2" />
                                                Add Artwork
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
                                                <FileCheck className="w-4 h-4 mr-2" />
                                                Issue Certificate
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
                                                <Users className="w-4 h-4 mr-2" />
                                                Add Artist
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
                                                <FileText className="w-4 h-4 mr-2" />
                                                View Reports
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center">
                                            <Activity className="w-4 h-4 mr-2" />
                                            Recent Activity
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {recentActivity.map((activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-medium text-foreground truncate">{activity.title}</p>
                                                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{activity.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Analytics Section */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Analytics Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <h3 className="text-xs font-medium text-muted-foreground">Monthly Certificates</h3>
                                            <p className="text-lg font-bold text-foreground mt-1">156</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">+12% from last month</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <h3 className="text-xs font-medium text-muted-foreground">Verification Rate</h3>
                                            <p className="text-lg font-bold text-foreground mt-1">98.5%</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">+2.3% from last month</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <h3 className="text-xs font-medium text-muted-foreground">Active Users</h3>
                                            <p className="text-lg font-bold text-foreground mt-1">1,234</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">+8% from last month</p>
                                        </div>
                                    </div>

                                    {/* Charts Grid */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="p-3 rounded-lg bg-muted/20">
                                            <h3 className="text-xs font-medium text-muted-foreground mb-3">Certificate Issuance Trend</h3>
                                            <div className="h-52 sm:h-[200px]">
                                                <Line data={certificateTrendData} options={chartOptions} />
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/20">
                                            <h3 className="text-xs font-medium text-muted-foreground mb-3">Artwork Categories</h3>
                                            <div className="h-52 sm:h-[200px]">
                                                <Doughnut data={categoryData} options={doughnutOptions} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Artworks Section */}
                    {activeSection === 'artworks' && (
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm flex items-center">
                                        <Image className="w-4 h-4 mr-2" />
                                        Recent Artworks
                                    </CardTitle>
                                    <Button size="sm" variant="outline" className="h-8 text-xs">
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add Artwork
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Artworks Stats */}
                                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-primary/10 rounded">
                                                <Image className="w-3 h-3 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="text-sm font-bold text-foreground">24</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-primary/10 rounded">
                                                <Shield className="w-3 h-3 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Authenticated</p>
                                                <p className="text-sm font-bold text-foreground">18</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-primary/10 rounded">
                                                <Clock className="w-3 h-3 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Pending</p>
                                                <p className="text-sm font-bold text-foreground">4</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-primary/10 rounded">
                                                <AlertCircle className="w-3 h-3 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Review</p>
                                                <p className="text-sm font-bold text-foreground">2</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                        <Input placeholder="Search artworks..." className="h-9 pl-8 text-xs" />
                                    </div>
                                    <Button variant="outline" size="sm" className="h-9 px-3">
                                        <Filter className="w-3 h-3" />
                                    </Button>
                                </div>

                                {/* Artworks Grid */}
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        {
                                            id: 1,
                                            title: "Seascape #12",
                                            artist: "Jane Doe",
                                            year: 2024,
                                            medium: "Oil on Canvas",
                                            status: "authenticated",
                                            hasCertificate: true,
                                            hasNFC: true,
                                            certificateId: "COA-2024-001",
                                            imageUrl: "/placeholder-artwork.jpg"
                                        },
                                        {
                                            id: 2,
                                            title: "Lotus Study – RK-017",
                                            artist: "John Smith",
                                            year: 2023,
                                            medium: "Watercolor",
                                            status: "pending_verification",
                                            hasCertificate: false,
                                            hasNFC: false,
                                            imageUrl: "/placeholder-artwork.jpg"
                                        },
                                        {
                                            id: 3,
                                            title: "Abstract No. 42",
                                            artist: "Maria Garcia",
                                            year: 2024,
                                            medium: "Acrylic",
                                            status: "authenticated",
                                            hasCertificate: true,
                                            hasNFC: true,
                                            certificateId: "COA-2024-045",
                                            imageUrl: "/placeholder-artwork.jpg"
                                        }
                                    ].map((artwork) => (
                                        <Card key={artwork.id} className="overflow-hidden border-border">
                                            <div className="aspect-video bg-muted relative">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Image className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <CardContent className="p-3">
                                                <div className="mb-2">
                                                    <h4 className="text-xs font-semibold text-foreground mb-0.5 truncate">{artwork.title}</h4>
                                                    <p className="text-xs text-muted-foreground truncate">{artwork.artist}</p>
                                                    <p className="text-xs text-muted-foreground">{artwork.year} • {artwork.medium}</p>
                                                </div>

                                                {/* Status Badges */}
                                                <div className="space-y-1 mb-2">
                                                    {artwork.hasCertificate ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <CheckCircle className="w-3 h-3 text-primary" />
                                                            <span className="text-xs text-foreground">Certificate</span>
                                                            <Badge variant="outline" className="text-xs h-4 px-1 ml-auto">
                                                                {artwork.certificateId}
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <AlertCircle className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">No Certificate</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5">
                                                        {artwork.hasNFC ? (
                                                            <>
                                                                <Wifi className="w-3 h-3 text-primary" />
                                                                <span className="text-xs text-foreground">NFC Linked</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Wifi className="w-3 h-3 text-muted-foreground" />
                                                                <span className="text-xs text-muted-foreground">No NFC</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge
                                                        variant={artwork.status === 'authenticated' ? 'default' : 'outline'}
                                                        className={`text-xs ${artwork.status === 'authenticated'
                                                            ? 'bg-primary text-primary-foreground'
                                                            : artwork.status === 'pending_verification'
                                                                ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                                                : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {artwork.status.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>

                                                {/* View Button */}
                                                <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Other Sections Placeholder */}
                    {activeSection !== 'dashboard' && activeSection !== 'artworks' && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Settings className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">
                                            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            This section is available in the full application.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardPreview;

