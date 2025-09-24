"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PAAMSpecDesigner from "@/components/paam-spec-designer"
import MultiPlatformPreview from "@/components/multi-platform-preview"
import IntentPreservationWorkbench from "@/components/intent-preservation-workbench"
import PAAMDebugger from "@/components/paam-debugger"
import FrameworkDeploymentManager from "@/components/framework-deployment-manager"
import RealTimeCollaboration from "@/components/real-time-collaboration"
import AIAgentPatch from "@/components/ai-agent-patch"
import QualityDashboard from "@/components/quality-dashboard"
import { 
  Play, 
  Square, 
  RefreshCw, 
  Settings, 
  Users, 
  MessageSquare, 
  Code, 
  Eye, 
  Smartphone, 
  Globe,
  Zap,
  FileText,
  GitBranch,
  Shield,
  BarChart3,
  Terminal,
  Maximize2,
  Minimize2,
  Plus,
  Save,
  Share,
  Bug,
  Bot,
  Rocket
} from "lucide-react"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  )
})

interface WorkspaceState {
  isRunning: boolean
  activeTab: string
  selectedFramework: string
  selectedPlatform: string
  collaborators: number
  lastSaved: Date | null
}

interface ProjectSpec {
  id: string
  name: string
  entities: any[]
  flows: any[]
  complianceRules: any[]
  framework: string
  platform: string[]
}

export default function Workspace() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  
  const [state, setState] = useState<WorkspaceState>({
    isRunning: false,
    activeTab: 'editor',
    selectedFramework: 'nextjs',
    selectedPlatform: 'web',
    collaborators: 1,
    lastSaved: null
  })

  const [projectSpec, setProjectSpec] = useState<ProjectSpec>({
    id: projectId,
    name: 'Untitled Project',
    entities: [],
    flows: [],
    complianceRules: [],
    framework: 'nextjs',
    platform: ['web']
  })

  const [code, setCode] = useState(`// Welcome to PAAM IDE
import { PAAM } from '@paam/sdk'

// Your PAAM specification will be compiled here
// Start by designing your spec in the visual editor

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center pt-20">
        PAAM Studio IDE
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Visual specification meets code-first development
      </p>
    </div>
  )
}`)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load project data
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const project = await response.json()
        setProjectSpec(prev => ({
          ...prev,
          name: project.name,
          framework: project.config?.framework || 'nextjs',
          platform: project.platform ? [project.platform] : ['web']
        }))
        setState(prev => ({
          ...prev,
          selectedFramework: project.config?.framework || 'nextjs',
          selectedPlatform: project.platform || 'web'
        }))
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }

  const handleRun = () => {
    setState(prev => ({ ...prev, isRunning: true }))
    // Simulate running the application
    setTimeout(() => {
      setState(prev => ({ ...prev, isRunning: false }))
    }, 2000)
  }

  const handleStop = () => {
    setState(prev => ({ ...prev, isRunning: false }))
  }

  const handleSave = async () => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: { framework: state.selectedFramework },
          spec: projectSpec
        })
      })
      setState(prev => ({ ...prev, lastSaved: new Date() }))
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleFrameworkChange = (framework: string) => {
    setState(prev => ({ ...prev, selectedFramework: framework }))
    setProjectSpec(prev => ({ ...prev, framework }))
  }

  const handlePlatformChange = (platform: string) => {
    setState(prev => ({ ...prev, selectedPlatform: platform }))
    setProjectSpec(prev => ({ ...prev, platform: [platform] }))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`h-screen flex flex-col bg-gray-900 text-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Studio
          </Button>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">{projectSpec.name}</h1>
            <Badge variant="secondary" className="text-xs">
              {state.selectedFramework}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {state.selectedPlatform}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Framework Selector */}
          <Select value={state.selectedFramework} onValueChange={handleFrameworkChange}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nextjs">Next.js</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
            </SelectContent>
          </Select>

          {/* Platform Selector */}
          <Select value={state.selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1 border-l border-gray-700 pl-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleSave}
              className="text-green-400 hover:text-green-300"
            >
              <Save className="h-4 w-4" />
            </Button>
            
            {state.isRunning ? (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleStop}
                className="text-red-400 hover:text-red-300"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleRun}
                className="text-green-400 hover:text-green-300"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button 
              size="sm" 
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Palette */}
        <div className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col">
          <div className="p-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold mb-2">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                <Code className="h-3 w-3 mr-1" />
                Code
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Spec
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                <Terminal className="h-3 w-3 mr-1" />
                Terminal
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Debug
              </Button>
            </div>
          </div>

          <div className="p-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold mb-2">PAAM Palette</h3>
            <div className="space-y-2">
              <div className="text-xs text-gray-400">Entities</div>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <Plus className="h-3 w-3 mr-2" />
                User Entity
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <Plus className="h-3 w-3 mr-2" />
                Transaction
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <Plus className="h-3 w-3 mr-2" />
                Account
              </Button>
              
              <div className="text-xs text-gray-400 mt-3">Flows</div>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <GitBranch className="h-3 w-3 mr-2" />
                Payment Flow
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <GitBranch className="h-3 w-3 mr-2" />
                KYC Flow
              </Button>
              
              <div className="text-xs text-gray-400 mt-3">Compliance</div>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <Shield className="h-3 w-3 mr-2" />
                AML Rule
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start h-7 text-xs">
                <Shield className="h-3 w-3 mr-2" />
                Data Privacy
              </Button>
            </div>
          </div>

          <div className="p-3 flex-1">
            <h3 className="text-sm font-semibold mb-2">Collaborators</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs">You</span>
              </div>
              {state.collaborators > 1 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-xs">{state.collaborators - 1} other</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Editor Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={state.activeTab} onValueChange={(value) => setState(prev => ({ ...prev, activeTab: value }))}>
            <div className="border-b border-gray-800 bg-gray-950">
              <TabsList className="h-10 bg-transparent flex-wrap">
                <TabsTrigger value="editor" className="data-[state=active]:bg-gray-800">
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="spec" className="data-[state=active]:bg-gray-800">
                  <Eye className="h-4 w-4 mr-2" />
                  Spec Designer
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800">
                  <Globe className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="debugger" className="data-[state=active]:bg-gray-800">
                  <Bug className="h-4 w-4 mr-2" />
                  Debugger
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-gray-800">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="data-[state=active]:bg-gray-800">
                  <Users className="h-4 w-4 mr-2" />
                  Collaboration
                </TabsTrigger>
                <TabsTrigger value="ai-agent" className="data-[state=active]:bg-gray-800">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Agent
                </TabsTrigger>
                <TabsTrigger value="deployment" className="data-[state=active]:bg-gray-800">
                  <Rocket className="h-4 w-4 mr-2" />
                  Deployment
                </TabsTrigger>
                <TabsTrigger value="quality" className="data-[state=active]:bg-gray-800">
                  <Shield className="h-4 w-4 mr-2" />
                  Quality
                </TabsTrigger>
                <TabsTrigger value="terminal" className="data-[state=active]:bg-gray-800">
                  <Terminal className="h-4 w-4 mr-2" />
                  Terminal
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="editor" className="h-full m-0">
                <div className="h-full flex">
                  {/* Monaco Editor Area */}
                  <div className="flex-1 bg-gray-950">
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-950">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>main.tsx</span>
                          <span>TypeScript</span>
                          <span>React</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="h-6 text-xs">
                            Format
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 relative">
                        <MonacoEditor
                          height="100%"
                          defaultLanguage="typescript"
                          value={code}
                          onChange={(value) => setCode(value || '')}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            folding: true,
                            showFoldingControls: 'always'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="spec" className="h-full m-0">
                <PAAMSpecDesigner
                  entities={projectSpec.entities}
                  flows={projectSpec.flows}
                  onEntitiesChange={(entities) => setProjectSpec(prev => ({ ...prev, entities }))}
                  onFlowsChange={(flows) => setProjectSpec(prev => ({ ...prev, flows }))}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full m-0">
                <MultiPlatformPreview
                  code={code}
                  framework={state.selectedFramework}
                  platform={state.selectedPlatform}
                  isRunning={state.isRunning}
                  onRun={handleRun}
                  onStop={handleStop}
                />
              </TabsContent>

              <TabsContent value="debugger" className="h-full m-0">
                <PAAMDebugger
                  code={code}
                  spec={projectSpec}
                  onBreakpointChange={(breakpoints) => {
                    console.log('Breakpoints changed:', breakpoints)
                  }}
                  onVariableInspect={(variable) => {
                    console.log('Variable inspected:', variable)
                  }}
                />
              </TabsContent>

              <TabsContent value="analysis" className="h-full m-0">
              <div className="h-full flex">
                <IntentPreservationWorkbench
                  entities={projectSpec.entities}
                  flows={projectSpec.flows}
                  requirements={[
                    {
                      id: 'REQ-001',
                      title: 'User Authentication',
                      description: 'Secure user authentication with multi-factor support',
                      priority: 'high',
                      status: 'satisfied',
                      mappedTo: ['User Entity', 'Authentication Flow'],
                      confidence: 0.95
                    },
                    {
                      id: 'REQ-002',
                      title: 'Payment Processing',
                      description: 'Secure payment transaction processing',
                      priority: 'high',
                      status: 'partial',
                      mappedTo: ['Transaction Flow'],
                      confidence: 0.78
                    },
                    {
                      id: 'REQ-003',
                      title: 'Data Privacy',
                      description: 'GDPR-compliant data handling',
                      priority: 'medium',
                      status: 'satisfied',
                      mappedTo: ['Compliance Rule'],
                      confidence: 0.88
                    }
                  ]}
                />
              </div>
            </TabsContent>

            <TabsContent value="collaboration" className="h-full m-0">
              <RealTimeCollaboration
                projectId={projectId}
                code={code}
                onCodeChange={setCode}
              />
            </TabsContent>

            <TabsContent value="ai-agent" className="h-full m-0">
              <AIAgentPatch
                code={code}
                spec={projectSpec}
                onPatchApply={(patch) => {
                  console.log('Patch applied:', patch)
                }}
                onCodeUpdate={setCode}
              />
            </TabsContent>

            <TabsContent value="deployment" className="h-full m-0">
              <FrameworkDeploymentManager
                project={projectSpec}
                onDeploy={(deployment) => {
                  console.log('Deployment started:', deployment)
                }}
                onRollback={(deploymentId) => {
                  console.log('Rollback initiated:', deploymentId)
                }}
              />
            </TabsContent>

            <TabsContent value="quality" className="h-full m-0">
              <QualityDashboard
                project={projectSpec}
                code={code}
                spec={projectSpec}
              />
            </TabsContent>

            <TabsContent value="terminal" className="h-full m-0">
                <div className="h-full bg-black">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                      <h3 className="font-medium">Terminal</h3>
                      <Button size="sm" variant="ghost" className="h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        New Terminal
                      </Button>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm text-green-400">
                      <div className="space-y-1">
                        <div>$ paam compile</div>
                        <div>✓ Parsing PAAM specification</div>
                        <div>✓ Validating entities and flows</div>
                        <div>✓ Applying compliance rules</div>
                        <div>✓ Generating code for {state.selectedFramework}</div>
                        <div>✓ Optimizing for {state.selectedPlatform}</div>
                        <div className="text-blue-400">Compilation completed successfully</div>
                        <div>$ </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - AI Agent & Properties */}
        <div className="w-80 border-l border-gray-800 bg-gray-950 flex flex-col">
          <div className="p-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold mb-2">AI Agent</h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Current Task</div>
                <div className="text-sm">Ready to assist</div>
              </div>
              <Button size="sm" className="w-full" variant="outline">
                <MessageSquare className="h-3 w-3 mr-2" />
                Ask AI Agent
              </Button>
            </div>
          </div>

          <div className="p-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold mb-2">Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Project Name</label>
                <Input 
                  value={projectSpec.name}
                  onChange={(e) => setProjectSpec(prev => ({ ...prev, name: e.target.value }))}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Entities</label>
                <div className="text-xs text-gray-500">{projectSpec.entities.length} entities</div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Flows</label>
                <div className="text-xs text-gray-500">{projectSpec.flows.length} flows</div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Compliance Rules</label>
                <div className="text-xs text-gray-500">{projectSpec.complianceRules.length} rules</div>
              </div>
            </div>
          </div>

          <div className="p-3 flex-1">
            <h3 className="text-sm font-semibold mb-2">Jobs Queue</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-800 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Compilation</span>
                  <Badge variant="secondary" className="text-xs">Completed</Badge>
                </div>
              </div>
              <div className="p-2 bg-gray-800 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Validation</span>
                  <Badge variant="outline" className="text-xs">Running</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-gray-800 bg-gray-950 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            {state.lastSaved ? `Saved ${state.lastSaved.toLocaleTimeString()}` : 'Not saved'}
          </span>
          <span className="text-gray-400">
            {state.collaborators} collaborator{state.collaborators !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-green-400">● Ready</span>
          <span className="text-gray-500">PAAM IDE v1.0</span>
        </div>
      </div>
    </div>
  )
}