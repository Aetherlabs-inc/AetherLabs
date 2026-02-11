import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ClipboardList, TrendingUp, Activity } from 'lucide-react'

interface WaitlistPreview {
  id: string
  email: string
  role: string | null
  created_at: string
}

interface UserPreview {
  id: string
  email: string | null
  full_name: string | null
  user_type: string | null
  created_at: string
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-500">
          {title}
        </CardTitle>
        <div className="text-neutral-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    waitlist: 0,
    todayWaitlist: 0,
    loading: true,
  })
  const [recentWaitlist, setRecentWaitlist] = useState<WaitlistPreview[]>([])
  const [recentUsers, setRecentUsers] = useState<UserPreview[]>([])

  useEffect(() => {
    async function fetchStats() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const [
        { count: userCount },
        { count: waitlistCount },
        { count: todayCount },
        { data: waitlistData },
        { data: usersData },
      ] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('waitlist').select('*', { count: 'exact', head: true }),
        supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString()),
        supabase
          .from('waitlist')
          .select('id, email, role, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('user_profiles')
          .select('id, email, full_name, user_type, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setStats({
        users: userCount ?? 0,
        waitlist: waitlistCount ?? 0,
        todayWaitlist: todayCount ?? 0,
        loading: false,
      })
      setRecentWaitlist(waitlistData ?? [])
      setRecentUsers(usersData ?? [])
    }
    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Overview of your application metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Waitlist Signups"
          value={stats.loading ? '...' : stats.waitlist}
          icon={<ClipboardList className="h-5 w-5" />}
          description="Total signups"
        />
        <StatCard
          title="Today's Signups"
          value={stats.loading ? '...' : stats.todayWaitlist}
          icon={<TrendingUp className="h-5 w-5" />}
          description="New today"
        />
        <StatCard
          title="Registered Users"
          value={stats.loading ? '...' : stats.users}
          icon={<Users className="h-5 w-5" />}
          description="App users"
        />
        <StatCard
          title="Active Today"
          value="-"
          icon={<Activity className="h-5 w-5" />}
          description="Users active in last 24h"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Waitlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWaitlist.length === 0 ? (
              <p className="text-sm text-neutral-500">No waitlist entries yet.</p>
            ) : (
              recentWaitlist.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {entry.email}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {entry.role ? entry.role : 'Unknown'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newest Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-neutral-500">No users yet.</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {user.full_name || user.email || 'Unnamed user'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {user.user_type || 'unknown'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
