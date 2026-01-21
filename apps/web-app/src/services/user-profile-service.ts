import { createClient } from '@/src/lib/supabase';

export interface UserProfile {
    id: string;
    email?: string; // Only available for own profile, not in public view
    full_name: string | null;
    username: string | null;
    slug: string | null;
    avatar_url: string | null;
    user_type: 'artist' | 'gallery' | 'collector';
    bio: string | null;
    website: string | null;
    location: string | null;
    phone?: string | null; // Only available for own profile, not in public view
    instagram?: string | null; // Only available for own profile, not in public view
    profile_visibility?: 'public' | 'private' | null; // Only available for own profile, not in public view
    created_at: string;
    updated_at?: string; // May not be in public view
}

export interface UserProfileUpdate {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    user_type?: 'artist' | 'gallery' | 'collector';
    bio?: string | null;
    website?: string | null;
    location?: string | null;
    phone?: string | null;
}

export interface UserStats {
    artworks_count: number;
    certificates_count: number;
    collections_count: number;
}

export class UserProfileService {
    private supabase = createClient();

    /**
     * Get user profile by user ID
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No profile found, return null
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    /**
     * Create or update user profile
     */
    async upsertUserProfile(profile: UserProfile): Promise<UserProfile> {
        try {
            // Validate username if provided
            if (profile.username) {
                const validation = UserProfileService.validateUsername(profile.username);
                if (!validation.valid) {
                    throw new Error(validation.error || 'Invalid username');
                }

                // Check if username is available
                const isAvailable = await this.isUsernameAvailable(profile.username, profile.id);
                if (!isAvailable) {
                    throw new Error('Username is already taken');
                }
            }

            const { data, error } = await this.supabase
                .from('user_profiles')
                .upsert(profile, {
                    onConflict: 'id'
                })
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error upserting user profile:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
        try {
            // Validate username if provided
            if (updates.username !== undefined) {
                if (updates.username) {
                    const validation = UserProfileService.validateUsername(updates.username);
                    if (!validation.valid) {
                        throw new Error(validation.error || 'Invalid username');
                    }

                    // Check if username is available
                    const isAvailable = await this.isUsernameAvailable(updates.username, userId);
                    if (!isAvailable) {
                        throw new Error('Username is already taken');
                    }
                }
            }

            const { data, error } = await this.supabase
                .from('user_profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    /**
     * Delete user profile
     */
    async deleteUserProfile(userId: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('user_profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting user profile:', error);
            throw error;
        }
    }

    /**
     * Upload avatar image
     */
    async uploadAvatar(userId: string, file: File): Promise<string> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            console.log('Uploading avatar to path:', filePath);

            // Upload file to storage
            const { error: uploadError } = await this.supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true // Replace existing file
                });

            if (uploadError) {
                console.error('Avatar upload error:', uploadError);
                throw uploadError;
            }

            console.log('Avatar uploaded successfully');

            // Get public URL
            const { data } = this.supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log('Generated avatar URL:', data.publicUrl);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }

    /**
     * Delete avatar image
     */
    async deleteAvatar(userId: string): Promise<void> {
        try {
            const filePath = `avatars/${userId}`;

            const { error } = await this.supabase.storage
                .from('avatars')
                .remove([filePath]);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting avatar:', error);
            throw error;
        }
    }

    /**
     * Get user statistics
     */
    async getUserStats(userId: string): Promise<UserStats> {
        try {
            // Get artworks count
            const { count: artworksCount } = await this.supabase
                .from('artworks')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // Get certificates count (through artworks)
            const { count: certificatesCount } = await this.supabase
                .from('certificates')
                .select(`
          *,
          artworks!inner(user_id)
        `, { count: 'exact', head: true })
                .eq('artworks.user_id', userId);

            // For now, collections count is 0 (no collections table yet)
            const collectionsCount = 0;

            return {
                artworks_count: artworksCount || 0,
                certificates_count: certificatesCount || 0,
                collections_count: collectionsCount
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    }

    /**
     * Search users by name or email
     */
    async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
                .limit(limit);

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }

    /**
     * Get users by type
     */
    async getUsersByType(userType: 'artist' | 'gallery' | 'collector', limit: number = 20): Promise<UserProfile[]> {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_type', userType)
                .limit(limit);

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching users by type:', error);
            throw error;
        }
    }

    /**
     * Create initial profile from auth user
     */
    async createInitialProfile(userId: string, email: string, metadata?: any): Promise<UserProfile> {
        try {
            const initialProfile: UserProfile = {
                id: userId,
                email,
                full_name: metadata?.full_name || null,
                username: null,
                slug: null,
                avatar_url: metadata?.avatar_url || null,
                user_type: 'artist',
                bio: null,
                website: null,
                location: null,
                phone: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            return await this.upsertUserProfile(initialProfile);
        } catch (error) {
            console.error('Error creating initial profile:', error);
            throw error;
        }
    }

    /**
     * Get public user profile by username (preferred) or ID (fallback)
     * Uses the secure get_public_profile_by_username_or_slug() function or public_profiles view
     * Returns only public-safe columns (no email, phone, instagram, website, etc.)
     */
    async getPublicProfile(identifier: string): Promise<UserProfile | null> {
        try {
            const lowerIdentifier = identifier.toLowerCase();

            // Method 1: Use public_profiles view (preferred - view handles visibility filtering)
            // Try as username first
            const { data: usernameData, error: usernameError } = await this.supabase
                .from('public_profiles')
                .select('*')
                .eq('username', lowerIdentifier)
                .maybeSingle();

            if (usernameData && !usernameError) {
                console.log('Found profile by username via view:', identifier);
                return usernameData as UserProfile;
            }

            // Try as slug
            const { data: slugData, error: slugError } = await this.supabase
                .from('public_profiles')
                .select('*')
                .eq('slug', lowerIdentifier)
                .maybeSingle();

            if (slugData && !slugError) {
                console.log('Found profile by slug via view:', identifier);
                return slugData as UserProfile;
            }

            // Method 2: Fallback to secure function
            try {
                const { data: functionData, error: functionError } = await this.supabase
                    .rpc('get_public_profile_by_username_or_slug', { identifier: lowerIdentifier });

                if (functionData && Array.isArray(functionData) && functionData.length > 0 && !functionError) {
                    const profile = functionData[0] as UserProfile;
                    // Check if profile is public (function might return private profiles)
                    if (profile.profile_visibility === 'private') {
                        console.log('Profile is private:', identifier);
                        return null;
                    }
                    console.log('Found profile via function:', identifier);
                    return profile;
                }
            } catch (rpcError) {
                console.warn('RPC function error (non-critical):', rpcError);
            }

            // Method 3: If identifier looks like a UUID, try as ID (backward compatibility)
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
            
            if (isUUID) {
                const { data: idData, error: idError } = await this.supabase
                    .from('public_profiles')
                    .select('*')
                    .eq('id', identifier)
                    .maybeSingle();

                if (idData && !idError) {
                    console.log('Found profile by ID via view:', identifier);
                    return idData as UserProfile;
                }
            }

            // Not found
            console.log('Profile not found for identifier:', identifier);
            return null;
        } catch (error) {
            console.error('Error fetching public profile:', error);
            throw error;
        }
    }

    /**
     * Check if username is available
     */
    async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
        try {
            const query = this.supabase
                .from('user_profiles')
                .select('id')
                .eq('username', username)
                .limit(1);

            const { data, error } = await query;

            if (error) throw error;

            // If no results, username is available
            if (!data || data.length === 0) {
                return true;
            }

            // If excludeUserId is provided and matches, username is available (for updates)
            if (excludeUserId && data[0].id === excludeUserId) {
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking username availability:', error);
            throw error;
        }
    }

    /**
     * Validate username format
     */
    static validateUsername(username: string): { valid: boolean; error?: string } {
        if (!username) {
            return { valid: false, error: 'Username is required' };
        }

        if (username.length < 3) {
            return { valid: false, error: 'Username must be at least 3 characters' };
        }

        if (username.length > 30) {
            return { valid: false, error: 'Username must be less than 30 characters' };
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
        }

        // Reserved usernames
        const reserved = ['admin', 'api', 'www', 'mail', 'support', 'help', 'about', 'contact', 'profile', 'settings'];
        if (reserved.includes(username.toLowerCase())) {
            return { valid: false, error: 'This username is reserved' };
        }

        return { valid: true };
    }

    /**
     * Get public user stats (no authentication required)
     */
    async getPublicStats(userId: string): Promise<UserStats> {
        try {
            // Get artworks count (only public/verified ones)
            const { count: artworksCount } = await this.supabase
                .from('artworks')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .in('status', ['verified', 'authenticated', 'pending_verification']);

            // Get certificates count
            const { count: certificatesCount } = await this.supabase
                .from('certificates')
                .select(`
                    *,
                    artworks!inner(user_id)
                `, { count: 'exact', head: true })
                .eq('artworks.user_id', userId);

            return {
                artworks_count: artworksCount || 0,
                certificates_count: certificatesCount || 0,
                collections_count: 0
            };
        } catch (error) {
            console.error('Error fetching public stats:', error);
            throw error;
        }
    }
}

export const userProfileService = new UserProfileService();
