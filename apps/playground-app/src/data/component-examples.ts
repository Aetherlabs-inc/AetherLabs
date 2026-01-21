export interface ComponentExample {
  name: string
  description: string
  code: string
  category: 'inputs' | 'display' | 'feedback' | 'layout' | 'navigation' | 'tokens'
}

export const componentExamples: ComponentExample[] = [
  {
    name: 'Button',
    description: 'Clickable button with multiple variants and sizes',
    category: 'inputs',
    code: `function Demo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
    </div>
  )
}`,
  },
  {
    name: 'Button Sizes',
    description: 'Button component with different size options',
    category: 'inputs',
    code: `function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="icon"><Plus /></Button>
    </div>
  )
}`,
  },
  {
    name: 'Badge',
    description: 'Small status indicator badges',
    category: 'display',
    code: `function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}`,
  },
  {
    name: 'Card',
    description: 'Container for grouped content',
    category: 'layout',
    code: `function Demo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description goes here with more details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}`,
  },
  {
    name: 'Input',
    description: 'Text input field for forms',
    category: 'inputs',
    code: `function Demo() {
  return (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input placeholder="Enter your name..." />
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input disabled placeholder="Disabled input" />
    </div>
  )
}`,
  },
  {
    name: 'Input with Label',
    description: 'Labeled input field for forms',
    category: 'inputs',
    code: `function Demo() {
  return (
    <div className="flex flex-col gap-4 w-[300px]">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
    </div>
  )
}`,
  },
  {
    name: 'Textarea',
    description: 'Multi-line text input',
    category: 'inputs',
    code: `function Demo() {
  return (
    <div className="flex flex-col gap-4 w-[350px]">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          rows={4}
        />
      </div>
    </div>
  )
}`,
  },
  {
    name: 'Table',
    description: 'Data table for displaying structured information',
    category: 'display',
    code: `function Demo() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'Inactive' },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'secondary'}>
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`,
  },
  {
    name: 'Skeleton',
    description: 'Loading placeholder animation',
    category: 'feedback',
    code: `function Demo() {
  return (
    <div className="flex flex-col gap-4 w-[300px]">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-[125px] w-full rounded-lg" />
    </div>
  )
}`,
  },
  {
    name: 'Separator',
    description: 'Visual divider between content',
    category: 'layout',
    code: `function Demo() {
  return (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Section One</h4>
        <p className="text-sm text-neutral-500">Content for the first section.</p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Section Two</h4>
        <p className="text-sm text-neutral-500">Content for the second section.</p>
      </div>
    </div>
  )
}`,
  },
  {
    name: 'Tooltip',
    description: 'Informational popup on hover',
    category: 'feedback',
    code: `function Demo() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a helpful tooltip!</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More information here</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}`,
  },
  {
    name: 'Sheet',
    description: 'Slide-out panel from screen edge',
    category: 'navigation',
    code: `function Demo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@johndoe" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`,
  },
  {
    name: 'Login Form',
    description: 'Complete login form example',
    category: 'inputs',
    code: `function Demo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Sign In</Button>
        <Button variant="link" className="text-sm">
          Forgot password?
        </Button>
      </CardFooter>
    </Card>
  )
}`,
  },
  {
    name: 'Sidebar',
    description: 'Navigation sidebar with menu items and groups',
    category: 'navigation',
    code: `function Demo() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-[400px] w-[280px] rounded-lg border border-neutral-200 overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sidebar-foreground">AetherLabs</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="h-4 w-4" />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FolderOpen className="h-4 w-4" />
                      <span>Projects</span>
                      <SidebarMenuBadge>12</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-sidebar-foreground">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60">Admin</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}`,
  },
  {
    name: 'Color Palette',
    description: 'Complete color system with all palettes',
    category: 'tokens',
    code: `function Demo() {
  const palettes = [
    { name: 'Primary', prefix: 'primary' },
    { name: 'Secondary', prefix: 'secondary' },
    { name: 'Accent', prefix: 'accent' },
    { name: 'Neutral', prefix: 'neutral' },
    { name: 'Success', prefix: 'success' },
    { name: 'Warning', prefix: 'warning' },
    { name: 'Danger', prefix: 'danger' },
    { name: 'Info', prefix: 'info' },
  ]

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {palettes.map(({ name, prefix }) => (
        <div key={prefix}>
          <h3 className="text-sm font-semibold text-neutral-700 mb-2">{name}</h3>
          <div className="flex gap-1">
            {shades.map((shade) => (
              <div key={shade} className="flex-1">
                <div
                  className={\`h-10 rounded-md bg-\${prefix}-\${shade}\`}
                  title={\`\${prefix}-\${shade}\`}
                />
                <p className="text-[10px] text-neutral-500 text-center mt-1">{shade}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}`,
  },
  {
    name: 'Semantic Colors',
    description: 'Background, foreground, and semantic tokens',
    category: 'tokens',
    code: `function Demo() {
  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Backgrounds</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-background border border-border">
            <p className="text-xs font-medium text-foreground">background</p>
            <p className="text-xs text-muted-foreground">Default bg</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-xs font-medium text-card-foreground">card</p>
            <p className="text-xs text-muted-foreground">Card bg</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-xs font-medium text-foreground">muted</p>
            <p className="text-xs text-muted-foreground">Muted bg</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Status Colors</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-success-100 border border-success-200">
            <Check className="h-4 w-4 text-success-600 mb-1" />
            <p className="text-xs font-medium text-success-700">Success</p>
          </div>
          <div className="p-3 rounded-lg bg-warning-100 border border-warning-200">
            <AlertTriangle className="h-4 w-4 text-warning-600 mb-1" />
            <p className="text-xs font-medium text-warning-700">Warning</p>
          </div>
          <div className="p-3 rounded-lg bg-danger-100 border border-danger-200">
            <X className="h-4 w-4 text-danger-600 mb-1" />
            <p className="text-xs font-medium text-danger-700">Danger</p>
          </div>
          <div className="p-3 rounded-lg bg-info-100 border border-info-200">
            <Info className="h-4 w-4 text-info-600 mb-1" />
            <p className="text-xs font-medium text-info-700">Info</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Action Colors</h3>
        <div className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
    </div>
  )
}`,
  },
  {
    name: 'Brand Customization',
    description: 'Change primary color with --brand-hue',
    category: 'tokens',
    code: `function Demo() {
  const brands = [
    { name: 'Blue (Default)', hue: 250 },
    { name: 'Purple', hue: 280 },
    { name: 'Cyan', hue: 200 },
    { name: 'Green', hue: 150 },
    { name: 'Orange', hue: 35 },
    { name: 'Red', hue: 25 },
  ]

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <p className="text-sm text-neutral-600">
        Override <code className="bg-neutral-100 px-1 rounded">--brand-hue</code> to change the primary color.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {brands.map(({ name, hue }) => (
          <div
            key={hue}
            className="p-4 rounded-lg border border-neutral-200"
            style={{ '--brand-hue': hue }}
          >
            <p className="text-sm font-medium mb-2">{name}</p>
            <p className="text-xs text-neutral-500 mb-3">--brand-hue: {hue}</p>
            <div className="flex gap-2">
              <Button size="sm">Button</Button>
              <Badge>Badge</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    name: 'Dark Mode',
    description: 'Toggle dark mode with .dark class',
    category: 'tokens',
    code: `function Demo() {
  const [dark, setDark] = React.useState(false)

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Dark Mode</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {dark ? 'Light' : 'Dark'}
        </Button>
      </div>

      <div className={cn("rounded-lg p-4 transition-colors", dark && "dark")}>
        <Card>
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>
              This card responds to the dark class.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
            </div>
            <Input placeholder="Type something..." />
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`,
  },
]

export const categories = [
  { id: 'all', label: 'All Components' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'display', label: 'Display' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'layout', label: 'Layout' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'tokens', label: 'Tokens' },
] as const
