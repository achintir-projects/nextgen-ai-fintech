"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Download, 
  Key, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield, 
  CreditCard, 
  Zap,
  Activity,
  Github,
  GitCompare,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Bell,
  LogOut,
  ExternalLink,
  FolderOpen,
  Rocket,
  Code,
  Database,
  Smartphone
} from "lucide-react"

// Mock data - replace with real API calls
const mockProjects = [
  {
    id: "1",
    name: "Mobile Banking App",
    description: "KYC-enabled mobile banking solution",
    status: "active",
    lastActivity: "2 hours ago",
    badge: "KYC-ready",
    href: "/project/1"
  },
  {
    id: "2", 
    name: "Payment Gateway",
    description: "Payment processing integration",
    status: "deployed",
    lastActivity: "1 day ago",
    badge: "GitHub CI",
    href: "/project/2"
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    description: "Real-time financial analytics",
    status: "building",
    lastActivity: "3 hours ago",
    badge: "SDK Downloads",
    href: "/project/3"
  }
]

const mockTemplates = [
  {
    id: "blank",
    title: "Blank App",
    description: "Start from scratch with a clean slate",
    icon: <FileText className="h-8 w-8" />,
    href: "/create/blank"
  },
  {
    id: "kyc",
    title: "KYC + Onboarding",
    description: "Pre-configured KYC and user onboarding",
    icon: <Shield className="h-8 w-8" />,
    href: "/create/kyc"
  },
  {
    id: "payments",
    title: "Payments Starter",
    description: "Payment processing and transaction management",
    icon: <CreditCard className="h-8 w-8" />,
    href: "/create/payments"
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description: "Real-time analytics and reporting",
    icon: <BarChart3 className="h-8 w-8" />,
    href: "/create/analytics"
  }
]

const mockActivity = [
  {
    id: "1",
    title: "Mobile Banking App scaffolded",
    type: "app_scaffolded",
    timestamp: "2 minutes ago",
    icon: <Rocket className="h-4 w-4 text-blue-600" />
  },
  {
    id: "2", 
    title: "SDK v2.1.0 released",
    type: "sdk_release",
    timestamp: "1 hour ago",
    icon: <Download className="h-4 w-4 text-green-600" />
  },
  {
    id: "3",
    title: "KYC verification completed",
    type: "kyc_completed",
    timestamp: "3 hours ago",
    icon: <Shield className="h-4 w-4 text-purple-600" />
  },
  {
    id: "4",
    title: "Payment gateway deployed",
    type: "deployment",
    timestamp: "5 hours ago",
    icon: <Zap className="h-4 w-4 text-orange-600" />
  }
]

const quickActions = [
  { title: "Open Chat Studio", icon: <MessageSquare className="h-4 w-4" />, href: "/chat" },
  { title: "New App", icon: <Plus className="h-4 w-4" />, action: "new-app" },
  { title: "SDK Downloads", icon: <Download className="h-4 w-4" />, href: "/download" },
  { title: "API Keys", icon: <Key className="h-4 w-4" />, href: "/auth" }
]

const onboardingSteps = [
  { title: "Connect GitHub", completed: true },
  { title: "Download SDK", completed: true },
  { title: "Create API Key", completed: false },
  { title: "Generate First App", completed: false }
]

const systemStatus = [
  { name: "Generation Engine", status: "operational" },
  { name: "KYC Engine", status: "operational" },
  { name: "Payments Engine", status: "degraded" },
  { name: "Realtime Engine", status: "operational" }
]

const commandPaletteActions = [
  {
    title: "Go to Chat Studio",
    icon: <MessageSquare className="h-4 w-4" />,
    href: "/chat",
    shortcut: "⌘C"
  },
  {
    title: "Open Admin",
    icon: <Settings className="h-4 w-4" />,
    href: "/admin", 
    shortcut: "⌘A"
  },
  {
    title: "Open Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    href: "/analytics",
    shortcut: "⌘N"
  },
  {
    title: "Create API Key",
    icon: <Key className="h-4 w-4" />,
    href: "/auth",
    shortcut: "⌘K"
  },
  {
    title: "Open Docs",
    icon: <FileText className="h-4 w-4" />,
    href: "/docs",
    shortcut: "⌘D"
  }
]

export default function StudioPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [createNewOpen, setCreateNewOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-green-500"
      case "degraded": return "bg-yellow-500"
      case "down": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational": return "Operational"
      case "degraded": return "Degraded"
      case "down": return "Down"
      default: return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-primary rounded"></div>
                <span className="font-bold">PAAM Studio</span>
              </div>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="/docs" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Docs
              </a>
              <a href="/auth" className="transition-colors hover:text-foreground/80 text-foreground/60">
                API Keys
              </a>
            </nav>
          </div>
          
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="outline"
                className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search...
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  ⌘K
                </kbd>
              </Button>
            </div>
            
            <nav className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Rail */}
        <aside className="w-64 border-r bg-muted/5">
          <div className="p-4 space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      if (action.action === "new-app") {
                        setCreateNewOpen(true)
                      } else if (action.href) {
                        window.location.href = action.href
                      }
                    }}
                  >
                    {action.icon}
                    <span className="ml-2">{action.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Onboarding Checklist */}
            <div>
              <h3 className="text-sm font-medium mb-3">Onboarding Checklist</h3>
              <div className="space-y-3">
                {onboardingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.completed 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "border-gray-300"
                    }`}>
                      {step.completed && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${
                      step.completed ? "text-muted-foreground" : "text-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
                <Progress value={50} className="mt-2" />
              </div>
            </div>

            {/* System Status */}
            <div>
              <h3 className="text-sm font-medium mb-3">System Status</h3>
              <div className="space-y-2">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{system.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(system.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Build, test, and ship FinTech apps with an AI-native studio.
                </h1>
                <p className="text-muted-foreground mt-2">
                  Create powerful financial applications with PAAM's comprehensive SDK suite
                </p>
              </div>
              
              {/* Live Activity Widget */}
              <Card className="w-80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Activity className="mr-2 h-4 w-4" />
                    Live Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {mockActivity.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-2 text-sm">
                          {activity.icon}
                          <span className="truncate">{activity.title}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {activity.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center space-x-4 mt-6">
              <Button asChild>
                <a href="/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Chat Studio
                </a>
              </Button>
              <Button variant="outline" onClick={() => setCreateNewOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New app
              </Button>
              <Button variant="outline" asChild>
                <a href="/compare">
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare Versions
                </a>
              </Button>
              
              <div className="flex items-center space-x-2 ml-auto">
                <Badge variant="secondary" className="flex items-center">
                  <Shield className="mr-1 h-3 w-3" />
                  KYC-ready
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Github className="mr-1 h-3 w-3" />
                  GitHub CI
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Download className="mr-1 h-3 w-3" />
                  SDK Downloads
                </Badge>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* New Project Card */}
                <Card className="border-dashed cursor-pointer hover:bg-muted/50" onClick={() => setCreateNewOpen(true)}>
                  <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">New Project</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Create a new FinTech application
                    </p>
                  </CardContent>
                </Card>

                {/* Project Cards */}
                {mockProjects.map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {project.badge}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {project.lastActivity}
                          </span>
                        </div>
                        <Button size="sm" asChild>
                          <a href={project.href}>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded">
                          {template.icon}
                        </div>
                        <CardTitle className="text-base">{template.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-4">
                        {template.description}
                      </CardDescription>
                      <Button size="sm" className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest events and updates from your PAAM Studio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <div className="p-1 bg-muted rounded">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Command Palette */}
      <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            {commandPaletteActions.map((action, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  if (action.href) {
                    window.location.href = action.href
                  }
                  setCommandPaletteOpen(false)
                }}
              >
                {action.icon}
                <span>{action.title}</span>
                <CommandShortcut>{action.shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Create New Dialog */}
      <Dialog open={createNewOpen} onOpenChange={setCreateNewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New App</DialogTitle>
            <DialogDescription>
              Choose a template to get started quickly
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded">
                      {template.icon}
                    </div>
                    <CardTitle className="text-base">{template.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-4">
                    {template.description}
                  </CardDescription>
                  <Button size="sm" className="w-full">
                    Create App
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}