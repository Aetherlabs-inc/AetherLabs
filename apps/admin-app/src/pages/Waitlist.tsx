import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, RefreshCw, Download, Trash2, Mail } from 'lucide-react'

interface WaitlistEntry {
  id: string
  email: string
  name: string | null
  role: string | null
  created_at: string
}

export function Waitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  async function fetchWaitlist() {
    setLoading(true)
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEntries(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWaitlist()
  }, [])

  const filteredEntries = entries.filter(
    (entry) =>
      entry.email?.toLowerCase().includes(search.toLowerCase()) ||
      entry.name?.toLowerCase().includes(search.toLowerCase()) ||
      entry.role?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEntries.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredEntries.map((e) => e.id)))
    }
  }

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} entries?`
    )
    if (!confirmed) return

    const { error } = await supabase
      .from('waitlist')
      .delete()
      .in('id', Array.from(selectedIds))

    if (!error) {
      setSelectedIds(new Set())
      fetchWaitlist()
    }
  }

  const exportToCsv = () => {
    const headers = ['Email', 'Name', 'Role', 'Signed Up']
    const rows = filteredEntries.map((entry) => [
      entry.email,
      entry.name || '',
      entry.role || '',
      new Date(entry.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRoleBadge = (role: string | null) => {
    switch (role?.toLowerCase()) {
      case 'artist':
        return <Badge variant="default">Artist</Badge>
      case 'gallery':
        return <Badge variant="secondary">Gallery</Badge>
      case 'collector':
        return <Badge variant="success">Collector</Badge>
      default:
        return <Badge variant="outline">{role || 'Unknown'}</Badge>
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Waitlist</h1>
          <p className="text-neutral-500 mt-1">
            {entries.length} people signed up
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Signups</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by email, name, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-72"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchWaitlist}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {selectedIds.size > 0 && (
              <Button variant="destructive" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4" />
                Delete ({selectedIds.size})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredEntries.length > 0 &&
                      selectedIds.size === filteredEntries.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-300"
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Signed Up</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <span className="text-neutral-500">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <span className="text-neutral-500">No waitlist entries found</span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(entry.id)}
                        onChange={() => toggleSelect(entry.id)}
                        className="rounded border-neutral-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{entry.email}</TableCell>
                    <TableCell className="text-neutral-500">
                      {entry.name || '-'}
                    </TableCell>
                    <TableCell>{getRoleBadge(entry.role)}</TableCell>
                    <TableCell className="text-neutral-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => window.open(`mailto:${entry.email}`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
