'use client';

import React from "react";
import { motion } from "framer-motion";
import { Image, FileCheck, Clock, Plus, BarChart3, Activity, Users, FileText, Search, Bell } from "lucide-react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Simple helper to keep animation props tidy
const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

const Dashboard = () => {
    // Mock data - replace with actual data from your backend
    const stats = {
        totalArtworks: 1250,
        issuedCertificates: 980,
        inProcessCertificates: 270,
        totalUsers: 850,
        verificationRate: 98.5,
        monthlyGrowth: 12,
    };

    const recentActivity = [
        { type: "artwork", title: "The Starry Night", action: "Added", time: "2 hours ago" },
        { type: "certificate", title: "Mona Lisa", action: "Issued", time: "4 hours ago" },
        { type: "verification", title: "The Persistence of Memory", action: "Verified", time: "5 hours ago" },
        { type: "user", title: "New Artist Registration", action: "Completed", time: "6 hours ago" },
        { type: "certificate", title: "The Scream", action: "Issued", time: "7 hours ago" },
    ];

    // Chart data for certificate issuance trend
    const certificateTrendData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Certificates Issued",
                data: [120, 150, 180, 140, 160, 156],
                borderColor: "rgb(0, 0, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
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
                backgroundColor: ["rgb(0, 0, 0)", "rgb(40, 40, 40)", "rgb(80, 80, 80)", "rgb(120, 120, 120)", "rgb(160, 160, 160)"],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-background px-4 py-6 sm:px-6">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                        <Button variant="ghost" size="icon" className="self-end sm:self-auto">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <div className="relative w-full sm:w-[220px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="w-full pl-9" />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <motion.div {...fadeInUp(0.0)}>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Artworks</p>
                                        <p className="text-2xl font-bold text-foreground mt-2">{stats.totalArtworks}</p>
                                    </div>
                                    <div className="bg-black rounded-full p-3">
                                        <Image className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div {...fadeInUp(0.08)}>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Issued Certificates</p>
                                        <p className="text-2xl font-bold text-foreground mt-2">{stats.issuedCertificates}</p>
                                    </div>
                                    <div className="bg-black rounded-full p-3">
                                        <FileCheck className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div {...fadeInUp(0.16)}>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Certificates in Process</p>
                                        <p className="text-2xl font-bold text-foreground mt-2">{stats.inProcessCertificates}</p>
                                    </div>
                                    <div className="bg-black rounded-full p-3">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <motion.div {...fadeInUp(0.0)}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Image className="w-5 h-5 mr-2" />
                                        Add Artwork
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FileCheck className="w-5 h-5 mr-2" />
                                        Issue Certificate
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Users className="w-5 h-5 mr-2" />
                                        Add Artist
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FileText className="w-5 h-5 mr-2" />
                                        View Reports
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div {...fadeInUp(0.08)}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Activity className="w-5 h-5 mr-2" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                            {...fadeInUp(index * 0.05)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full mr-3 bg-black" />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Analytics Section */}
            <motion.div {...fadeInUp(0.12)} className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Analytics Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <motion.div {...fadeInUp(0.0)}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground">Monthly Certificates</h3>
                                        <p className="text-2xl font-bold text-foreground mt-2">156</p>
                                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div {...fadeInUp(0.06)}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground">Verification Rate</h3>
                                        <p className="text-2xl font-bold text-foreground mt-2">98.5%</p>
                                        <p className="text-xs text-muted-foreground mt-1">+2.3% from last month</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div {...fadeInUp(0.12)}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                                        <p className="text-2xl font-bold text-foreground mt-2">1,234</p>
                                        <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <motion.div {...fadeInUp(0.0)}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Certificate Issuance Trend</h3>
                                        <div className="h-64 md:h-[300px]">
                                            <Line data={certificateTrendData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div {...fadeInUp(0.06)}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Artwork Categories</h3>
                                        <div className="h-64 md:h-[300px]">
                                            <Doughnut data={categoryData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Dashboard;
