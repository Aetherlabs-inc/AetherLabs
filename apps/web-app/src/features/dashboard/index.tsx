'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Image, FileCheck, Clock, Plus, BarChart3, Activity, AlertCircle, ChevronRight, FileText } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, Button } from "@aetherlabs/ui";
import { DashboardService, type DashboardStats, type Activity as ActivityType, type PendingItem } from "@/src/services/dashboard-service";
import { StatsGridSkeleton, ActivityListSkeleton, QuickActionsSkeleton, ChartSkeleton } from "@/src/components/skeletons/DashboardSkeleton";
import { DataError } from "@/src/components/error-states";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Simple helper to keep animation props tidy
const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

// Helper to get theme colors from CSS variables for Chart.js
// Converts HSL values to hex or rgba format that Chart.js can use
const getThemeColor = (cssVar: string, opacity: number = 1, format: 'hex' | 'rgba' = 'rgba'): string => {
    if (typeof window === 'undefined') {
        return format === 'hex' ? '#000000' : `rgba(0, 0, 0, ${opacity})`;
    }

    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(cssVar)
        .trim();

    // Parse HSL values (format: "h s% l%" or "h s l")
    const hslMatch = value.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%?\s+(\d+(?:\.\d+)?)%?/);

    if (hslMatch) {
        const h = parseFloat(hslMatch[1]) / 360;
        const s = parseFloat(hslMatch[2]) / 100;
        const l = parseFloat(hslMatch[3]) / 100;

        // Convert HSL to RGB
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const r255 = Math.round(r * 255);
        const g255 = Math.round(g * 255);
        const b255 = Math.round(b * 255);

        if (format === 'hex') {
            // Convert to hex
            const toHex = (n: number) => {
                const hex = n.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            return `#${toHex(r255)}${toHex(g255)}${toHex(b255)}`;
        }

        return `rgba(${r255}, ${g255}, ${b255}, ${opacity})`;
    }

    // Fallback
    return format === 'hex' ? '#000000' : `rgba(0, 0, 0, ${opacity})`;
};

const Dashboard = () => {
    const router = useRouter();

    // State for real data
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityType[]>([]);
    const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, activityData, pendingData] = await Promise.all([
                DashboardService.getStats(),
                DashboardService.getRecentActivity(5),
                DashboardService.getPendingItems()
            ]);

            setStats(statsData);
            setRecentActivity(activityData);
            setPendingItems(pendingData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Navigation handlers for quick actions
    const handleAddArtwork = () => router.push('/artworks?action=register');
    const handleIssueCertificate = () => router.push('/artworks');
    const handleViewReports = () => router.push('/certificates');
    const handleViewPendingItem = (id: string) => router.push(`/artworks/${id}`);

    // Chart data for certificate issuance trend - using theme colors
    // Use hex format for Chart.js compatibility
    const chartColor1 = getThemeColor('--chart-1', 1, 'hex');
    const chartColor2 = getThemeColor('--chart-2', 1, 'hex');
    const chartColor3 = getThemeColor('--chart-3', 1, 'hex');
    const chartColor4 = getThemeColor('--chart-4', 1, 'hex');
    const chartColor5 = getThemeColor('--chart-5', 1, 'hex');

    const certificateTrendData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Certificates Issued",
                data: [120, 150, 180, 140, 160, 156],
                borderColor: chartColor1,
                backgroundColor: chartColor1,
                tension: 0.4,
            },
        ],
    };

    // Chart data for artwork categories - using theme colors
    // Use rgba for background with opacity, hex for borders
    const categoryData = {
        labels: ["Paintings", "Sculptures", "Digital Art", "Photography", "Other"],
        datasets: [
            {
                data: [45, 20, 15, 10, 10],
                backgroundColor: [
                    getThemeColor('--chart-1', 0.56, 'rgba'),
                    getThemeColor('--chart-2', 0.56, 'rgba'),
                    getThemeColor('--chart-3', 0.56, 'rgba'),
                    getThemeColor('--chart-4', 0.56, 'rgba'),
                    getThemeColor('--chart-5', 0.56, 'rgba'),
                ],
                borderColor: [
                    chartColor1,
                    chartColor2,
                    chartColor3,
                    chartColor4,
                    chartColor5,
                ],
                tension: 0.4,
            },
        ],
    };

    // Error state
    if (error) {
        return (
            <div className="w-full min-h-screen bg-background">
                <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
                    <DataError
                        title="Unable to load dashboard"
                        error={error}
                        onRetry={fetchDashboardData}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background">
            <div className="mx-auto w-full">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s an overview of your artwork portfolio
                    </p>
                </div>

                {/* Stats - with loading skeleton */}
                {loading ? (
                    <div className="mb-6 sm:mb-8">
                        <StatsGridSkeleton />
                    </div>
                ) : (
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        <motion.div {...fadeInUp(0.0)} className="min-w-0">
                            <Card className="h-full border border-border bg-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-muted-foreground truncate">Total Artworks</p>
                                            <p className="text-2xl font-bold text-foreground mt-2">{stats?.totalArtworks || 0}</p>
                                        </div>
                                        <div className="rounded-full p-3 shrink-0 bg-primary">
                                            <Image className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div {...fadeInUp(0.08)} className="min-w-0">
                            <Card className="h-full border border-border bg-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-muted-foreground truncate">Issued Certificates</p>
                                            <p className="text-2xl font-bold text-foreground mt-2">{stats?.issuedCertificates || 0}</p>
                                        </div>
                                        <div className="bg-primary rounded-full p-3 shrink-0">
                                            <FileCheck className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div {...fadeInUp(0.16)} className="min-w-0 sm:col-span-2 lg:col-span-1">
                            <Card className="h-full border border-border bg-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-muted-foreground truncate">Certificates in Process</p>
                                            <p className="text-2xl font-bold text-foreground mt-2">{stats?.inProcessCertificates || 0}</p>
                                        </div>
                                        <div className="bg-primary rounded-full p-3 shrink-0">
                                            <Clock className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Needs Attention Section */}
                {!loading && pendingItems.length > 0 && (
                    <motion.div {...fadeInUp(0.2)} className="mb-6 sm:mb-8">
                        <Card className="border-2 border-[#CA5B2B]/30 bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center text-[#CA5B2B]">
                                    <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                                    Needs Attention
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {pendingItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                                            onClick={() => handleViewPendingItem(item.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                                        <Image className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.issue === 'no_certificate' && 'Missing certificate'}
                                                        {item.issue === 'no_nfc' && 'No NFC tag linked'}
                                                        {item.issue === 'pending_verification' && 'Pending verification'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Quick Actions & Recent Activity */}
                {loading ? (
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-2">
                        <QuickActionsSkeleton />
                        <Card className="border border-border bg-card">
                            <CardHeader>
                                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                            </CardHeader>
                            <CardContent>
                                <ActivityListSkeleton count={5} />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-2">
                        <motion.div {...fadeInUp(0.0)} className="min-w-0">
                            <Card className="h-full border border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Plus className="w-5 h-5 mr-2 shrink-0" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:border-[#BC8010]/50 hover:bg-[#BC8010]/5"
                                            onClick={handleAddArtwork}
                                        >
                                            <Image className="w-5 h-5 mr-2" />
                                            Add Artwork
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:border-[#BC8010]/50 hover:bg-[#BC8010]/5"
                                            onClick={handleIssueCertificate}
                                        >
                                            <FileCheck className="w-5 h-5 mr-2" />
                                            Issue Certificate
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:border-[#BC8010]/50 hover:bg-[#BC8010]/5"
                                            onClick={handleViewReports}
                                        >
                                            <FileText className="w-5 h-5 mr-2" />
                                            View Certificates
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:border-[#BC8010]/50 hover:bg-[#BC8010]/5"
                                            onClick={() => router.push('/artworks')}
                                        >
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            View All Artworks
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div {...fadeInUp(0.08)} className="min-w-0">
                            <Card className="h-full border border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Activity className="w-5 h-5 mr-2 shrink-0" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentActivity.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No recent activity</p>
                                            <p className="text-xs mt-1">Start by adding your first artwork</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentActivity.map((activity, index) => (
                                                <motion.div
                                                    key={activity.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                                    {...fadeInUp(index * 0.05)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-3 ${
                                                            activity.type === 'artwork' ? 'bg-[#BC8010]' :
                                                            activity.type === 'certificate' ? 'bg-green-500' :
                                                            activity.type === 'nfc' ? 'bg-blue-500' :
                                                            'bg-accent'
                                                        }`} />
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Analytics Section */}
                {loading ? (
                    <div className="mt-6 sm:mt-8 w-full">
                        <Card className="border border-border bg-card">
                            <CardHeader>
                                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                            </CardHeader>
                            <CardContent>
                                <StatsGridSkeleton />
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 mt-6">
                                    <ChartSkeleton />
                                    <ChartSkeleton />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <motion.div {...fadeInUp(0.12)} className="mt-6 sm:mt-8 w-full">
                        <Card className="border border-border bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    Analytics Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                                    <motion.div {...fadeInUp(0.0)} className="min-w-0">
                                        <Card className="h-full border border-border bg-card">
                                            <CardContent className="pt-6">
                                                <h3 className="text-sm font-medium text-muted-foreground truncate">Pending Verification</h3>
                                                <p className="text-2xl font-bold text-foreground mt-2">{stats?.pendingVerification || 0}</p>
                                                <p className="text-xs text-muted-foreground mt-1 truncate">Artworks awaiting review</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div {...fadeInUp(0.06)} className="min-w-0">
                                        <Card className="h-full border border-border bg-card">
                                            <CardContent className="pt-6">
                                                <h3 className="text-sm font-medium text-muted-foreground truncate">Needs Review</h3>
                                                <p className="text-2xl font-bold text-foreground mt-2">{stats?.needsReview || 0}</p>
                                                <p className="text-xs text-muted-foreground mt-1 truncate">Require attention</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div {...fadeInUp(0.12)} className="min-w-0 sm:col-span-2 lg:col-span-1">
                                        <Card className="h-full border border-border bg-card">
                                            <CardContent className="pt-6">
                                                <h3 className="text-sm font-medium text-muted-foreground truncate">Completion Rate</h3>
                                                <p className="text-2xl font-bold text-foreground mt-2">
                                                    {stats?.totalArtworks
                                                        ? Math.round((stats.issuedCertificates / stats.totalArtworks) * 100)
                                                        : 0}%
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1 truncate">Artworks with certificates</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Charts Grid */}
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                                    <motion.div {...fadeInUp(0.0)} className="min-w-0">
                                        <Card className="h-full border border-border bg-card">
                                            <CardContent className="pt-6">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Certificate Issuance Trend</h3>
                                                <div className="h-64 w-full sm:h-[280px] lg:h-[300px] overflow-hidden">
                                                    <Line data={certificateTrendData} options={{ maintainAspectRatio: false, responsive: true }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div {...fadeInUp(0.06)} className="min-w-0">
                                        <Card className="h-full border border-border bg-card">
                                            <CardContent className="pt-6">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Artwork Categories</h3>
                                                <div className="h-64 w-full sm:h-[280px] lg:h-[300px] overflow-hidden">
                                                    <Doughnut data={categoryData} options={{ maintainAspectRatio: false, responsive: true }} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>


        </div>
    );
};

export default Dashboard;
