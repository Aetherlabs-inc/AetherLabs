import * as React from "react";

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
} from "@/components/ui/sidebar";
import { Settings, Home, Image, Users, CreditCard, HelpCircle, LogOut, User } from "lucide-react";
import { createClient } from '@/src/lib/supabase';

const supabase = createClient();

async function handleSignOut() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}

const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", icon: Home, url: "/dashboard" },
      { title: "Artworks", icon: Image, url: "/artworks" },
      { title: "Profile", icon: User, url: "/profile" },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Artists", icon: Users, url: "/artists" },
      { title: "Users", icon: Users, url: "/users" },
      { title: "Billing", icon: CreditCard, url: "/billing" },
    ],
  },
  {
    label: "Settings & Support",
    items: [
      { title: "Settings", icon: Settings, url: "/settings" },
      { title: "Help & Support", icon: HelpCircle, url: "/help" },
      { title: "Logout", icon: LogOut, onClick: handleSignOut },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>

      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {item.onClick ? (
                        <button onClick={item.onClick} className="flex items-center gap-2">
                          <item.icon size={18} />
                          {item.title}
                        </button>
                      ) : (
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon size={18} />
                          {item.title}
                        </a>
                      )}
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
  );
}
