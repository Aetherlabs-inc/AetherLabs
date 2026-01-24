'use client';

import React, { useMemo, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Switch,
    useToast,
} from '@aetherlabs/ui';
import { Bell, Globe, Shield, Sliders, Trash2, UserCog, Wifi } from 'lucide-react';

type ThemePreference = 'system' | 'light' | 'dark';
type DefaultView = 'dashboard' | 'artworks' | 'certificates';
type TimeZone = 'auto' | 'america' | 'europe' | 'asia';
type Language = 'en' | 'fr' | 'es' | 'de';

const SettingsPageClient: React.FC = () => {
    const { toast } = useToast();

    const [theme, setTheme] = useState<ThemePreference>('system');
    const [defaultView, setDefaultView] = useState<DefaultView>('dashboard');
    const [timeZone, setTimeZone] = useState<TimeZone>('auto');
    const [language, setLanguage] = useState<Language>('en');

    const [emailUpdates, setEmailUpdates] = useState(true);
    const [nfcAlerts, setNfcAlerts] = useState(true);
    const [certificateStatus, setCertificateStatus] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);

    const [twoFactor, setTwoFactor] = useState(false);
    const [autoLock, setAutoLock] = useState(true);

    const [publicProfile, setPublicProfile] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showCollections, setShowCollections] = useState(true);

    const [autoGenerateCOA, setAutoGenerateCOA] = useState(true);
    const [autoBindNFC, setAutoBindNFC] = useState(false);
    const [requireVerification, setRequireVerification] = useState(true);

    const sessionList = useMemo(
        () => [
            { id: 'current', device: 'MacBook Pro · Chrome', location: 'New York, USA', lastActive: 'Now', current: true },
            { id: 'mobile', device: 'iPhone 15 · Safari', location: 'Brooklyn, USA', lastActive: '2h ago', current: false },
            { id: 'tablet', device: 'iPad Pro · Safari', location: 'Queens, USA', lastActive: '3d ago', current: false },
        ],
        []
    );

    const handleSave = () => {
        toast({
            title: "Settings saved",
            description: "Your preferences were saved for this session.",
        });
    };

    const handleReset = () => {
        setTheme('system');
        setDefaultView('dashboard');
        setTimeZone('auto');
        setLanguage('en');
        setEmailUpdates(true);
        setNfcAlerts(true);
        setCertificateStatus(true);
        setWeeklyDigest(false);
        setTwoFactor(false);
        setAutoLock(true);
        setPublicProfile(true);
        setShowEmail(false);
        setShowCollections(true);
        setAutoGenerateCOA(true);
        setAutoBindNFC(false);
        setRequireVerification(true);

        toast({
            title: "Defaults restored",
            description: "Your settings were reset to default values.",
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your preferences, security, and certificate workflow.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleReset} className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900">
                        Restore Defaults
                    </Button>
                    <Button onClick={handleSave} variant="default" className="bg-primary-600 text-white hover:bg-primary-700 hover:text-white">Save Preferences</Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sliders className="h-5 w-5" />
                            Preferences
                        </CardTitle>
                        <CardDescription>Customize how AetherLabs looks and behaves.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <Select value={theme} onValueChange={(value) => setTheme(value as ThemePreference)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Default view</Label>
                                <Select value={defaultView} onValueChange={(value) => setDefaultView(value as DefaultView)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select default view" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dashboard">Dashboard</SelectItem>
                                        <SelectItem value="artworks">Artworks</SelectItem>
                                        <SelectItem value="certificates">Certificates</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Time zone</Label>
                                <Select value={timeZone} onValueChange={(value) => setTimeZone(value as TimeZone)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">Auto-detect</SelectItem>
                                        <SelectItem value="america">Americas</SelectItem>
                                        <SelectItem value="europe">Europe</SelectItem>
                                        <SelectItem value="asia">Asia-Pacific</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English (US)</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium">Quick access</p>
                                    <p className="text-sm text-muted-foreground">
                                        Pin frequently used actions to the sidebar.
                                    </p>
                                </div>
                                <Badge variant="outline">Coming soon</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Control how you receive updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Email updates</p>
                                <p className="text-sm text-muted-foreground">Important account and product updates.</p>
                            </div>
                            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">NFC tag alerts</p>
                                <p className="text-sm text-muted-foreground">Get notified when a tag is scanned.</p>
                            </div>
                            <Switch checked={nfcAlerts} onCheckedChange={setNfcAlerts} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Certificate status</p>
                                <p className="text-sm text-muted-foreground">Updates on verification and issuance.</p>
                            </div>
                            <Switch checked={certificateStatus} onCheckedChange={setCertificateStatus} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Weekly digest</p>
                                <p className="text-sm text-muted-foreground">A summary of activity every week.</p>
                            </div>
                            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security
                        </CardTitle>
                        <CardDescription>Protect your account and manage sessions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Two-factor authentication</p>
                                <p className="text-sm text-muted-foreground">Require a second step on login.</p>
                            </div>
                            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Auto-lock session</p>
                                <p className="text-sm text-muted-foreground">Lock after 15 minutes of inactivity.</p>
                            </div>
                            <Switch checked={autoLock} onCheckedChange={setAutoLock} />
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium">Active sessions</p>
                                    <p className="text-sm text-muted-foreground">Signed-in devices and browsers.</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Sign out others
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {sessionList.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{session.device}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {session.location} · {session.lastActive}
                                            </p>
                                        </div>
                                        {session.current ? (
                                            <Badge variant="outline">Current</Badge>
                                        ) : (
                                            <Button variant="ghost" size="sm">
                                                Revoke
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCog className="h-5 w-5" />
                            Privacy
                        </CardTitle>
                        <CardDescription>Control visibility of your public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Public profile</p>
                                <p className="text-sm text-muted-foreground">Allow collectors to view your profile.</p>
                            </div>
                            <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Show email</p>
                                <p className="text-sm text-muted-foreground">Display your email on public pages.</p>
                            </div>
                            <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Share collections</p>
                                <p className="text-sm text-muted-foreground">Enable public collection visibility.</p>
                            </div>
                            <Switch checked={showCollections} onCheckedChange={setShowCollections} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wifi className="h-5 w-5" />
                            Certificates & NFC
                        </CardTitle>
                        <CardDescription>Control authentication workflow defaults.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Auto-generate certificates</p>
                                <p className="text-sm text-muted-foreground">Create COAs after artwork registration.</p>
                            </div>
                            <Switch checked={autoGenerateCOA} onCheckedChange={setAutoGenerateCOA} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Auto-bind NFC tags</p>
                                <p className="text-sm text-muted-foreground">Prompt to link NFC during onboarding.</p>
                            </div>
                            <Switch checked={autoBindNFC} onCheckedChange={setAutoBindNFC} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Require verification step</p>
                                <p className="text-sm text-muted-foreground">Mark artworks as pending until reviewed.</p>
                            </div>
                            <Switch checked={requireVerification} onCheckedChange={setRequireVerification} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Support & data
                        </CardTitle>
                        <CardDescription>Manage data exports and account status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support email</Label>
                                <Input id="support-email" value="support@aetherlabs.art" readOnly className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="export-format">Data export</Label>
                                <Select defaultValue="json">
                                    <SelectTrigger id="export-format">
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="json">JSON</SelectItem>
                                        <SelectItem value="csv">CSV</SelectItem>
                                        <SelectItem value="pdf">PDF summary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button variant="outline">Download export</Button>
                            <Button variant="outline">Request support</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            Danger zone
                        </CardTitle>
                        <CardDescription>Permanent actions require confirmation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                            <div>
                                <p className="font-medium text-destructive">Delete account</p>
                                <p className="text-sm text-muted-foreground">
                                    This action removes all artworks, certificates, and tags.
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Delete account</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. All records will be permanently removed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                toast({
                                                    title: "Request submitted",
                                                    description: "We will verify your request before deletion.",
                                                })
                                            }
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Confirm deletion
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPageClient;
