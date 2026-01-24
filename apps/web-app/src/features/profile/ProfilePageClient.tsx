'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/src/lib/supabase';
import { userProfileService, UserProfile, UserStats } from '@/src/services/user-profile-service';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, useToast } from '@aetherlabs/ui';
import { User, Camera, Save, Loader2, Share2 } from 'lucide-react';

export default function ProfilePageClient() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            let profile = await userProfileService.getUserProfile(user.id);

            if (!profile) {
                // Create initial profile
                profile = await userProfileService.createInitialProfile(
                    user.id,
                    user.email || '',
                    user.user_metadata
                );
            }

            setProfile(profile);

            // Fetch user stats
            const userStats = await userProfileService.getUserStats(user.id);
            setStats(userStats);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            // Service handles all username validation and availability checks
            await userProfileService.upsertUserProfile(profile);

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error('Error saving profile:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !profile) return;

        setUploading(true);
        try {
            const avatarUrl = await userProfileService.uploadAvatar(profile.id, file);

            setProfile({
                ...profile,
                avatar_url: avatarUrl,
            });

            toast({
                title: "Success",
                description: "Avatar updated successfully",
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast({
                title: "Error",
                description: "Failed to upload avatar",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        if (profile) {
            setProfile({
                ...profile,
                [field]: value,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Failed to load profile</p>
            </div>
        );
    }

    const handleShareProfile = async () => {
        // Always use username for share links (cleaner URLs)
        if (!profile.username) {
            toast({
                title: "Username Required",
                description: "Please set a username to share your profile link",
                variant: "destructive",
            });
            return;
        }

        const profileUrl = `${window.location.origin}/a/${profile.username}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast({
                title: "Link copied!",
                description: "Your profile link has been copied to clipboard",
            });
        } catch (err) {
            console.error('Failed to copy:', err);
            toast({
                title: "Error",
                description: "Failed to copy link",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-muted-foreground">Manage your account settings and profile information</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleShareProfile}
                        className="gap-2"
                    >
                        <Share2 className="h-4 w-4" />
                        Share Profile
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Profile Photo Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Photo</CardTitle>
                            <CardDescription>Upload a profile picture for your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={profile.avatar_url || ''} />
                                    <AvatarFallback>
                                        <User className="h-12 w-12" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <label htmlFor="avatar-upload">
                                        <Button variant="outline" asChild disabled={uploading}>
                                            <span>
                                                {uploading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Camera className="h-4 w-4 mr-2" />
                                                )}
                                                {uploading ? 'Uploading...' : 'Change Photo'}
                                            </span>
                                        </Button>
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Your basic profile information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        value={profile.full_name || ''}
                                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Email cannot be changed
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            id="username"
                                            value={profile.username || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                                                handleInputChange('username', value);
                                            }}
                                            placeholder="your-username"
                                            maxLength={30}
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {profile.username ? (
                                                <>Your profile URL: <span className="font-mono text-foreground">{typeof window !== 'undefined' && `${window.location.origin}/a/${profile.username}`}</span></>
                                            ) : (
                                                <span className="text-muted-foreground">Set a username to get a custom profile URL</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            3-30 characters, letters, numbers, underscores, and hyphens only
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_type">User Type</Label>
                                <div className="flex space-x-2">
                                    {(['artist', 'gallery', 'collector'] as const).map((type) => (
                                        <Button
                                            key={type}
                                            variant={profile.user_type === type ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleInputChange('user_type', type)}
                                            className="capitalize"
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    value={profile.bio || ''}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Your contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={profile.website || ''}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={profile.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={profile.location || ''}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="City, Country"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your account details and statistics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold">{stats?.artworks_count || 0}</div>
                                    <div className="text-sm text-muted-foreground">Artworks</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold">{stats?.certificates_count || 0}</div>
                                    <div className="text-sm text-muted-foreground">Certificates</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold">{stats?.collections_count || 0}</div>
                                    <div className="text-sm text-muted-foreground">Collections</div>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                                <p>Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
                                {profile.updated_at && (
                                    <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
