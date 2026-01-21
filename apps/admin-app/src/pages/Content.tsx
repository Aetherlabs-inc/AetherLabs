import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function Content() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content</h1>
          <p className="text-neutral-500 mt-1">
            Manage your application content
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">
            Content management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
