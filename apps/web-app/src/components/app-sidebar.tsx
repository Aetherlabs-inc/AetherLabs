'use client';

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Skeleton,
} from "@aetherlabs/ui";
import { Settings, Home, Image, HelpCircle, LogOut, FileCheck, FolderOpen, Plus, Activity } from "lucide-react";
import { createClient } from '@/src/lib/supabase';
import { userProfileService, UserProfile } from '@/src/services/user-profile-service';
import { DashboardService, type Activity as ActivityType } from '@/src/services/dashboard-service';

const mainNavItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Artworks", icon: Image, url: "/artworks" },
  { title: "Certificates", icon: FileCheck, url: "/certificates" },
  { title: "Collections", icon: FolderOpen, url: "/collections" },
];

const footerNavItems = [
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Support", icon: HelpCircle, url: "/help" },
];

const getUserTypeLabel = (userType: string | null | undefined): string => {
  if (!userType) return 'User';
  return userType.charAt(0).toUpperCase() + userType.slice(1);
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [recentActivity, setRecentActivity] = React.useState<ActivityType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activityLoading, setActivityLoading] = React.useState(true);

  React.useEffect(() => {
    fetchUserProfile();
    fetchRecentActivity();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userProfile = await userProfileService.getUserProfile(user.id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const activity = await DashboardService.getRecentActivity(3);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleQuickRegister = () => {
    router.push('/artworks?action=register');
  };

  const isActive = (url: string) => {
    if (url === '/dashboard') return pathname === url;
    return pathname.startsWith(url);
  };

  const displayName = profile?.full_name || profile?.username || 'User';
  const userType = getUserTypeLabel(profile?.user_type);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/profile" className="block">
              <SidebarMenuButton size="lg" className="w-full hover:bg-sidebar-accent">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-9 w-9 border-2 border-[#BC8010]/20">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                    <AvatarFallback className="bg-[#2A2121] text-white text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                    <span className="font-semibold text-sm truncate w-full">
                      {loading ? 'Loading...' : displayName}
                    </span>
                    <span className="text-xs text-sidebar-foreground/70 truncate w-full">
                      {loading ? '' : userType}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Quick Register Button */}
        <div className="px-2 pb-2">
          <Button
            onClick={handleQuickRegister}
            className="w-full bg-[#2A2121] hover:bg-[#2A2121]/90 text-white justify-start"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Register Artwork
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={isActive(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Recent Activity */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-sidebar-foreground/50 uppercase tracking-wider flex items-center gap-2">
            <Activity size={12} />
            Recent Activity
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              {activityLoading ? (
                <>
                  <div className="flex items-center gap-2 py-1.5">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-1.5">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-14" />
                    </div>
                  </div>
                </>
              ) : recentActivity.length === 0 ? (
                <p className="text-xs text-sidebar-foreground/50 py-2">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 py-1.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      activity.type === 'artwork' ? 'bg-[#BC8010]' :
                      activity.type === 'certificate' ? 'bg-green-500' :
                      activity.type === 'nfc' ? 'bg-blue-500' :
                      'bg-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-sidebar-foreground truncate">
                        {activity.title}
                      </p>
                      <p className="text-[10px] text-sidebar-foreground/50">
                        {activity.action} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {footerNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                className={isActive(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
              >
                <Link href={item.url} className="flex items-center gap-2">
                  <item.icon size={18} />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full text-[#CA5B2B] hover:text-[#CA5B2B] hover:bg-[#CA5B2B]/10"
            >
              <LogOut size={18} />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
