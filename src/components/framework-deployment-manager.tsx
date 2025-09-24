"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Rocket, 
  Settings, 
  Cloud, 
  Server, 
  GitBranch, 
  Play, 
  Square, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Upload,
  Database,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Code,
  FileText,
  Activity,
  Layers,
  Target
} from 'lucide-react'

interface Environment {
  id: string
  name: string
  type: 'development' | 'staging' | 'production'
  status: 'active' | 'inactive' | 'deploying' | 'failed'
  url?: string
  lastDeployed?: Date
  config: any
}

interface Deployment {
  id: string
  environmentId: string
  version: string
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolled_back'
  startedAt?: Date
  completedAt?: Date
  logs?: string
  artifacts?: string[]
  rollbackInfo?: any
}

interface BuildConfig {
  framework: string
  platform: string
  environment: string
  buildCommand: string
  outputDir: string
  installCommand: string
  envVars: Record<string, string>
  docker?: {
    enabled: boolean
    dockerfile: string
    image: string
  }
}

interface FrameworkDeploymentManagerProps {
  project: any
  onDeploy?: (deployment: any) => void
  onRollback?: (deploymentId: string) => void
}

export default function FrameworkDeploymentManager({ project, onDeploy, onRollback }: FrameworkDeploymentManagerProps) {
  const [activeTab, setActiveTab] = useState('framework')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('production')
  const [buildConfig, setBuildConfig] = useState<BuildConfig>({
    framework: 'nextjs',
    platform: 'web',
    environment: 'production',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    installCommand: 'npm install',
    envVars: {
      NODE_ENV: 'production',
      API_URL: 'https://api.example.com'
    },
    docker: {
      enabled: true,
      dockerfile: 'Dockerfile',
      image: 'paam-app:latest'
    }
  })

  const [environments, setEnvironments] = useState<Environment[]>([
    {
      id: 'development',
      name: 'Development',
      type: 'development',
      status: 'active',
      url: 'https://dev-paam.example.com',
      lastDeployed: new Date(Date.now() - 3600000), // 1 hour ago
      config: {
        autoDeploy: true,
        branch: 'develop',
        notifications: true
      }
    },
    {
      id: 'staging',
      name: 'Staging',
      type: 'staging',
      status: 'active',
      url: 'https://staging-paam.example.com',
      lastDeployed: new Date(Date.now() - 7200000), // 2 hours ago
      config: {
        autoDeploy: false,
        branch: 'main',
        requiresApproval: true
      }
    },
    {
      id: 'production',
      name: 'Production',
      type: 'production',
      status: 'active',
      url: 'https://paam.example.com',
      lastDeployed: new Date(Date.now() - 86400000), // 1 day ago
      config: {
        autoDeploy: false,
        branch: 'main',
        requiresApproval: true,
        healthChecks: true
      }
    }
  ])

  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: 'deploy-1',
      environmentId: 'production',
      version: 'v1.2.3',
      status: 'success',
      startedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 86400000 + 180000), // 3 minutes
      artifacts: ['app.zip', 'config.json', 'logs.tar.gz']
    },
    {
      id: 'deploy-2',
      environmentId: 'staging',
      version: 'v1.2.4',
      status: 'deploying',
      startedAt: new Date(Date.now() - 300000), // 5 minutes ago
      logs: 'Building application...\nRunning tests...\nDeploying to staging...'
    },
    {
      id: 'deploy-3',
      environmentId: 'development',
      version: 'v1.3.0-dev',
      status: 'success',
      startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      completedAt: new Date(Date.now() - 1800000 + 120000) // 2 minutes
    }
  ])

  const [isDeploying, setIsDeploying] = useState(false)

  const frameworks = [
    {
      id: 'nextjs',
      name: 'Next.js',
      icon: <Code className="h-4 w-4" />,
      description: 'React framework with SSR/SSG',
      buildCommand: 'npm run build',
      outputDir: '.next',
      platforms: ['web']
    },
    {
      id: 'react',
      name: 'React',
      icon: <Code className="h-4 w-4" />,
      description: 'React SPA with Vite/Webpack',
      buildCommand: 'npm run build',
      outputDir: 'dist',
      platforms: ['web']
    },
    {
      id: 'vue',
      name: 'Vue.js',
      icon: <Code className="h-4 w-4" />,
      description: 'Progressive JavaScript framework',
      buildCommand: 'npm run build',
      outputDir: 'dist',
      platforms: ['web']
    },
    {
      id: 'angular',
      name: 'Angular',
      icon: <Code className="h-4 w-4" />,
      description: 'Full-stack TypeScript framework',
      buildCommand: 'ng build',
      outputDir: 'dist/angular-app',
      platforms: ['web']
    }
  ]

  const platforms = [
    {
      id: 'web',
      name: 'Web',
      icon: <Globe className="h-4 w-4" />,
      description: 'Web applications',
      environments: ['development', 'staging', 'production']
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: <Smartphone className="h-4 w-4" />,
      description: 'Native iOS applications',
      environments: ['development', 'staging', 'production']
    },
    {
      id: 'android',
      name: 'Android',
      icon: <Smartphone className="h-4 w-4" />,
      description: 'Native Android applications',
      environments: ['development', 'staging', 'production']
    },
    {
      id: 'backend',
      name: 'Backend',
      icon: <Server className="h-4 w-4" />,
      description: 'Server-side applications',
      environments: ['development', 'staging', 'production']
    }
  ]

  const deploymentTargets = [
    {
      id: 'vercel',
      name: 'Vercel',
      icon: <Cloud className="h-4 w-4" />,
      description: 'Serverless deployment platform',
      supportedPlatforms: ['web'],
      config: {
        framework: 'nextjs',
        buildCommand: 'npm run build',
        outputDir: '.next'
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: <Cloud className="h-4 w-4" />,
      description: 'JAMstack deployment platform',
      supportedPlatforms: ['web'],
      config: {
        framework: 'react',
        buildCommand: 'npm run build',
        outputDir: 'dist'
      }
    },
    {
      id: 'aws',
      name: 'AWS',
      icon: <Cloud className="h-4 w-4" />,
      description: 'Amazon Web Services',
      supportedPlatforms: ['web', 'backend'],
      config: {
        framework: 'any',
        buildCommand: 'npm run build',
        outputDir: 'dist'
      }
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: <Database className="h-4 w-4" />,
      description: 'Container-based deployment',
      supportedPlatforms: ['web', 'backend'],
      config: {
        framework: 'any',
        buildCommand: 'docker build -t paam-app .',
        outputDir: 'Dockerfile'
      }
    }
  ]

  const handleDeploy = (environmentId: string) => {
    setIsDeploying(true)
    
    const newDeployment: Deployment = {
      id: `deploy-${Date.now()}`,
      environmentId,
      version: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      status: 'deploying',
      startedAt: new Date(),
      logs: 'Starting deployment...\nBuilding application...\nRunning tests...'
    }

    setDeployments(prev => [newDeployment, ...prev])
    
    // Simulate deployment process
    setTimeout(() => {
      setDeployments(prev => prev.map(d => 
        d.id === newDeployment.id 
          ? { ...d, status: 'success', completedAt: new Date() }
          : d
      ))
      setIsDeploying(false)
    }, 5000)
  }

  const handleRollback = (deploymentId: string) => {
    setDeployments(prev => prev.map(d => 
      d.id === deploymentId 
        ? { ...d, status: 'rolled_back', rollbackInfo: { reason: 'Manual rollback initiated' } }
        : d
    ))
    onRollback?.(deploymentId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'text-green-500'
      case 'deploying':
        return 'text-blue-500'
      case 'failed':
        return 'text-red-500'
      case 'inactive':
        return 'text-gray-500'
      case 'rolled_back':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case 'deploying':
        return <Badge variant="default" className="bg-blue-500">Deploying</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'rolled_back':
        return <Badge variant="outline">Rolled Back</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="h-full bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold">Framework & Deployment Manager</h2>
          <p className="text-sm text-gray-400">Configure frameworks and manage deployments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{buildConfig.framework}</Badge>
          <Badge variant="outline">{buildConfig.platform}</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="framework" className="h-full m-0">
              <div className="h-full flex">
                {/* Framework Selection */}
                <div className="w-80 border-r border-gray-800 p-4">
                  <h3 className="text-sm font-semibold mb-4">Select Framework</h3>
                  <div className="space-y-3">
                    {frameworks.map((framework) => (
                      <div
                        key={framework.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          buildConfig.framework === framework.id 
                            ? 'bg-blue-600 border border-blue-500' 
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        onClick={() => setBuildConfig(prev => ({ ...prev, framework: framework.id }))}
                      >
                        <div className="flex items-center space-x-3">
                          {framework.icon}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{framework.name}</div>
                            <div className="text-xs text-gray-400">{framework.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold mb-4 mt-6">Select Platform</h3>
                  <div className="space-y-3">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          buildConfig.platform === platform.id 
                            ? 'bg-blue-600 border border-blue-500' 
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        onClick={() => setBuildConfig(prev => ({ ...prev, platform: platform.id }))}
                      >
                        <div className="flex items-center space-x-3">
                          {platform.icon}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{platform.name}</div>
                            <div className="text-xs text-gray-400">{platform.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Framework Configuration */}
                <div className="flex-1 p-4">
                  <h3 className="text-sm font-semibold mb-4">Framework Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400">Build Command</label>
                      <Input
                        value={buildConfig.buildCommand}
                        onChange={(e) => setBuildConfig(prev => ({ ...prev, buildCommand: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400">Output Directory</label>
                      <Input
                        value={buildConfig.outputDir}
                        onChange={(e) => setBuildConfig(prev => ({ ...prev, outputDir: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400">Install Command</label>
                      <Input
                        value={buildConfig.installCommand}
                        onChange={(e) => setBuildConfig(prev => ({ ...prev, installCommand: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Environment Variables</label>
                      <div className="space-y-2">
                        {Object.entries(buildConfig.envVars).map(([key, value]) => (
                          <div key={key} className="flex space-x-2">
                            <Input
                              value={key}
                              onChange={(e) => {
                                const newEnvVars = { ...buildConfig.envVars }
                                delete newEnvVars[key]
                                newEnvVars[e.target.value] = value
                                setBuildConfig(prev => ({ ...prev, envVars: newEnvVars }))
                              }}
                              className="h-6 text-xs flex-1"
                              placeholder="Variable name"
                            />
                            <Input
                              value={value}
                              onChange={(e) => setBuildConfig(prev => ({ 
                                ...prev, 
                                envVars: { ...prev.envVars, [key]: e.target.value }
                              }))}
                              className="h-6 text-xs flex-1"
                              placeholder="Value"
                            />
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs"
                          onClick={() => setBuildConfig(prev => ({ 
                            ...prev, 
                            envVars: { ...prev.envVars, NEW_VAR: '' }
                          }))}
                        >
                          Add Variable
                        </Button>
                      </div>
                    </div>

                    {buildConfig.docker && (
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-sm font-medium mb-3">Docker Configuration</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={buildConfig.docker.enabled}
                              onChange={(e) => setBuildConfig(prev => ({ 
                                ...prev, 
                                docker: { ...prev.docker!, enabled: e.target.checked }
                              }))}
                            />
                            <label className="text-sm">Enable Docker</label>
                          </div>
                          
                          {buildConfig.docker.enabled && (
                            <>
                              <div>
                                <label className="text-xs text-gray-400">Dockerfile Path</label>
                                <Input
                                  value={buildConfig.docker.dockerfile}
                                  onChange={(e) => setBuildConfig(prev => ({ 
                                    ...prev, 
                                    docker: { ...prev.docker!, dockerfile: e.target.value }
                                  }))}
                                  className="h-8 text-xs"
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-gray-400">Image Name</label>
                                <Input
                                  value={buildConfig.docker.image}
                                  onChange={(e) => setBuildConfig(prev => ({ 
                                    ...prev, 
                                    docker: { ...prev.docker!, image: e.target.value }
                                  }))}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="h-full m-0">
              <div className="h-full flex">
                {/* Deployment Targets */}
                <div className="w-80 border-r border-gray-800 p-4">
                  <h3 className="text-sm font-semibold mb-4">Deployment Targets</h3>
                  <div className="space-y-3">
                    {deploymentTargets.map((target) => (
                      <div key={target.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          {target.icon}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{target.name}</div>
                            <div className="text-xs text-gray-400">{target.description}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Supported: {target.supportedPlatforms.join(', ')}
                        </div>
                        <Button size="sm" className="w-full h-7 text-xs">
                          Configure
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deployment Configuration */}
                <div className="flex-1 p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    {/* Environments */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Environments</h3>
                      <div className="space-y-3">
                        {environments.map((env) => (
                          <div key={env.id} className="p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{env.name}</span>
                                {getStatusBadge(env.status)}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleDeploy(env.id)}
                                disabled={isDeploying || env.status === 'deploying'}
                                className="h-7 text-xs"
                              >
                                {env.status === 'deploying' ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Rocket className="h-3 w-3" />
                                )}
                                Deploy
                              </Button>
                            </div>
                            
                            {env.url && (
                              <div className="text-xs text-gray-400 mb-1">
                                {env.url}
                              </div>
                            )}
                            
                            {env.lastDeployed && (
                              <div className="text-xs text-gray-500">
                                Last deployed: {env.lastDeployed.toLocaleString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Deployments */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Active Deployments</h3>
                      <ScrollArea className="h-96">
                        <div className="space-y-3">
                          {deployments.slice(0, 5).map((deployment) => {
                            const environment = environments.find(e => e.id === deployment.environmentId)
                            return (
                              <div key={deployment.id} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">{deployment.version}</span>
                                    {getStatusBadge(deployment.status)}
                                  </div>
                                  {deployment.status === 'success' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRollback(deployment.id)}
                                      className="h-6 text-xs"
                                    >
                                      Rollback
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="text-xs text-gray-400 mb-1">
                                  {environment?.name}
                                </div>
                                
                                {deployment.startedAt && (
                                  <div className="text-xs text-gray-500">
                                    Started: {deployment.startedAt.toLocaleString()}
                                  </div>
                                )}
                                
                                {deployment.completedAt && (
                                  <div className="text-xs text-gray-500">
                                    Completed: {deployment.completedAt.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="environments" className="h-full m-0">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-4">Environment Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {environments.map((env) => (
                    <Card key={env.id} className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          {env.name}
                          {getStatusBadge(env.status)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="capitalize">{env.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">URL:</span>
                            <span className="truncate">{env.url}</span>
                          </div>
                          {env.lastDeployed && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Last Deployed:</span>
                              <span>{env.lastDeployed.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <Button size="sm" className="w-full h-7 text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            View Health
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="h-full m-0">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-4">Deployment History</h3>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {deployments.map((deployment) => {
                      const environment = environments.find(e => e.id === deployment.environmentId)
                      return (
                        <div key={deployment.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="font-medium">{deployment.version}</div>
                                <div className="text-sm text-gray-400">{environment?.name}</div>
                              </div>
                              {getStatusBadge(deployment.status)}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              {deployment.startedAt && (
                                <div>{deployment.startedAt.toLocaleString()}</div>
                              )}
                            </div>
                          </div>
                          
                          {deployment.logs && (
                            <div className="mt-3">
                              <div className="text-xs text-gray-400 mb-1">Deployment Logs:</div>
                              <pre className="bg-gray-900 p-2 rounded text-xs overflow-auto max-h-20">
                                {deployment.logs}
                              </pre>
                            </div>
                          )}
                          
                          {deployment.artifacts && deployment.artifacts.length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs text-gray-400 mb-1">Artifacts:</div>
                              <div className="flex flex-wrap gap-1">
                                {deployment.artifacts.map((artifact, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {artifact}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}