import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  ClipboardList,
  Plus,
  type LucideIcon,
} from 'lucide-react'

type NavItem =
  | { title: string; icon: LucideIcon; url: string; isAction?: false }
  | { title: string; icon: LucideIcon; isAction: true }

type NavGroup = {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { title: 'Dashboard', icon: BarChart3, url: '/' },
      { title: 'Users', icon: Users, url: '/users' },
      { title: 'Waitlist', icon: ClipboardList, url: '/waitlist' },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
            A
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">AetherLabs</span>
            <span className="text-xs text-sidebar-foreground/70">Admin Panel</span>
          </div>
        </div>
        <Button className="w-full mt-4 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:px-2">
          <Plus size={16} className="group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">Quick Create</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, index) => (
          <SidebarGroup key={group.label || `group-${index}`}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = !item.isAction && location.pathname === item.url
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.isAction ? (
                        <SidebarMenuButton
                          onClick={handleSignOut}
                          isActive={isActive}
                          tooltip={item.title}
                        >
                          <Icon size={18} />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <Link to={item.url}>
                            <Icon size={18} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
            <span className="text-xs font-medium truncate">{user?.email?.split('@')[0] || 'User'}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email || ''}</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
