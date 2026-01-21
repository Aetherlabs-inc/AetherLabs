import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ClipboardList, TrendingUp, Activity } from 'lucide-react'

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

  useEffect(() => {
    async function fetchStats() {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch waitlist count
      const { count: waitlistCount } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      // Fetch today's waitlist signups
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: todayCount } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      setStats({
        users: userCount ?? 0,
        waitlist: waitlistCount ?? 0,
        todayWaitlist: todayCount ?? 0,
        loading: false,
      })
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
    </div>
  )
}
