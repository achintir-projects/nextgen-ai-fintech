"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  Zap, 
  Code, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  GitBranch,
  Eye,
  Edit,
  Save,
  RefreshCw,
  Sparkles,
  Target,
  Lightbulb,
  Activity,
  Database
} from 'lucide-react'
import ZAI from 'z-ai-web-dev-sdk'

interface Patch {
  id: string
  description: string
  type: 'bugfix' | 'feature' | 'refactor' | 'optimization' | 'security'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'analyzing' | 'generating' | 'applying' | 'applied' | 'failed'
  originalCode: string
  patchedCode?: string
  explanation?: string
  confidence: number
  risk: number
  dependencies?: string[]
  createdAt: Date
  appliedAt?: Date
}

interface AIAnalysis {
  issues: Array<{
    type: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    line?: number
    suggestion?: string
  }>
  improvements: Array<{
    type: string
    description: string
    impact: 'low' | 'medium' | 'high'
    code?: string
  }>
  metrics: {
    complexity: number
    maintainability: number
    security: number
    performance: number
  }
}

interface AIAgentPatchProps {
  code: string
  spec: any
  onPatchApply?: (patch: Patch) => void
  onCodeUpdate?: (newCode: string) => void
}

export default function AIAgentPatch({ code, spec, onPatchApply, onCodeUpdate }: AIAgentPatchProps) {
  const [activeTab, setActiveTab] = useState('analysis')
  const [patches, setPatches] = useState<Patch[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPatch, setSelectedPatch] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [zaiInstance, setZaiInstance] = useState<any>(null)

  const analysisRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize ZAI SDK
    const initializeZAI = async () => {
      try {
        const zai = await ZAI.create()
        setZaiInstance(zai)
      } catch (error) {
        console.error('Failed to initialize ZAI:', error)
      }
    }

    initializeZAI()
  }, [])

  const analyzeCode = async () => {
    if (!zaiInstance) return

    setIsAnalyzing(true)
    
    try {
      // Mock AI analysis - in real implementation, this would use ZAI
      const mockAnalysis: AIAnalysis = {
        issues: [
          {
            type: 'Security',
            description: 'Potential XSS vulnerability in user input handling',
            severity: 'high',
            line: 45,
            suggestion: 'Implement proper input sanitization'
          },
          {
            type: 'Performance',
            description: 'Inefficient database query in loop',
            severity: 'medium',
            line: 78,
            suggestion: 'Use batch operations or caching'
          },
          {
            type: 'Code Quality',
            description: 'Missing error handling for API calls',
            severity: 'medium',
            line: 23,
            suggestion: 'Add try-catch blocks and proper error handling'
          }
        ],
        improvements: [
          {
            type: 'Refactoring',
            description: 'Extract duplicate code into reusable functions',
            impact: 'medium'
          },
          {
            type: 'Optimization',
            description: 'Implement memoization for expensive computations',
            impact: 'high',
            code: '// Before\nfunction expensiveCalculation(data) {\n  // Complex computation\n}\n\n// After\nconst memoizedCalculation = useMemo(() => expensiveCalculation(data), [data]);'
          }
        ],
        metrics: {
          complexity: 65,
          maintainability: 72,
          security: 58,
          performance: 81
        }
      }

      setCurrentAnalysis(mockAnalysis)
      
      // Generate automatic patches for issues
      const autoPatches: Patch[] = mockAnalysis.issues.map((issue, index) => ({
        id: `patch-${Date.now()}-${index}`,
        description: `Fix: ${issue.description}`,
        type: issue.type.toLowerCase() as Patch['type'],
        priority: issue.severity === 'critical' ? 'critical' : issue.severity as Patch['priority'],
        status: 'pending',
        originalCode: code,
        confidence: 0.8 + (Math.random() * 0.2),
        risk: issue.severity === 'high' ? 0.7 : 0.3,
        createdAt: new Date()
      }))

      setPatches(autoPatches)
      
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generatePatch = async (prompt: string) => {
    if (!zaiInstance || !prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Mock patch generation - in real implementation, this would use ZAI
      const newPatch: Patch = {
        id: `patch-${Date.now()}`,
        description: `AI-generated patch: ${prompt.substring(0, 50)}...`,
        type: 'refactor',
        priority: 'medium',
        status: 'analyzing',
        originalCode: code,
        confidence: 0.85,
        risk: 0.4,
        createdAt: new Date()
      }

      setPatches(prev => [newPatch, ...prev])
      setAiPrompt('')
      
      // Simulate patch generation process
      setTimeout(() => {
        setPatches(prev => prev.map(p => 
          p.id === newPatch.id 
            ? { 
                ...p, 
                status: 'generating',
                patchedCode: code.replace(
                  '// Your PAAM specification will be compiled here',
                  `// AI-generated improvement: ${prompt}\n// Your PAAM specification will be compiled here`
                ),
                explanation: `This patch addresses the following: ${prompt}. The changes improve code quality and maintainability.`
              }
            : p
        ))
        
        setTimeout(() => {
          setPatches(prev => prev.map(p => 
            p.id === newPatch.id 
              ? { ...p, status: 'applied' }
              : p
          ))
        }, 2000)
      }, 1000)
      
    } catch (error) {
      console.error('Patch generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const applyPatch = async (patchId: string) => {
    const patch = patches.find(p => p.id === patchId)
    if (!patch || !patch.patchedCode) return

    setPatches(prev => prev.map(p => 
      p.id === patchId 
        ? { ...p, status: 'applying' }
        : p
    ))

    // Simulate patch application
    setTimeout(() => {
      setPatches(prev => prev.map(p => 
        p.id === patchId 
          ? { ...p, status: 'applied', appliedAt: new Date() }
          : p
      ))
      
      if (patch.patchedCode) {
        onCodeUpdate?.(patch.patchedCode)
      }
      
      onPatchApply?.(patch)
    }, 1500)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="default" className="bg-green-500">Applied</Badge>
      case 'applying':
        return <Badge variant="default" className="bg-blue-500">Applying</Badge>
      case 'generating':
        return <Badge variant="default" className="bg-purple-500">Generating</Badge>
      case 'analyzing':
        return <Badge variant="default" className="bg-yellow-500">Analyzing</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="h-full bg-gray-950 text-gray-100 flex flex-col">
      {/* AI Agent Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <span className="font-medium">AI Agent</span>
            {zaiInstance ? (
              <Badge variant="default" className="bg-green-500">Connected</Badge>
            ) : (
              <Badge variant="secondary">Connecting...</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm">
              {patches.filter(p => p.status === 'applied').length} patches applied
            </span>
          </div>
        </div>

        <Button onClick={analyzeCode} disabled={isAnalyzing || !zaiInstance}>
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Target className="h-4 w-4 mr-2" />
          )}
          Analyze Code
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="patches">Patches</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="analysis" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                {currentAnalysis ? (
                  <div className="space-y-6">
                    {/* Metrics Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Code Quality Metrics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Complexity</span>
                              <Database className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold">{currentAnalysis.metrics.complexity}%</div>
                            <Progress value={currentAnalysis.metrics.complexity} className="mt-2" />
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Maintainability</span>
                              <Code className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-2xl font-bold">{currentAnalysis.metrics.maintainability}%</div>
                            <Progress value={currentAnalysis.metrics.maintainability} className="mt-2" />
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Security</span>
                              <Shield className="h-4 w-4 text-red-500" />
                            </div>
                            <div className="text-2xl font-bold">{currentAnalysis.metrics.security}%</div>
                            <Progress value={currentAnalysis.metrics.security} className="mt-2" />
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Performance</span>
                              <Zap className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold">{currentAnalysis.metrics.performance}%</div>
                            <Progress value={currentAnalysis.metrics.performance} className="mt-2" />
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Issues */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Identified Issues</h3>
                      <div className="space-y-3">
                        {currentAnalysis.issues.map((issue, index) => (
                          <Card key={index} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium">{issue.type}</span>
                                    <Badge 
                                      variant={issue.severity === 'critical' ? 'destructive' : 'default'}
                                      className={getSeverityColor(issue.severity)}
                                    >
                                      {issue.severity}
                                    </Badge>
                                    {issue.line && (
                                      <span className="text-xs text-gray-400">Line {issue.line}</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{issue.description}</p>
                                  {issue.suggestion && (
                                    <div className="text-xs text-blue-400">
                                      💡 {issue.suggestion}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Improvements */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Suggested Improvements</h3>
                      <div className="space-y-3">
                        {currentAnalysis.improvements.map((improvement, index) => (
                          <Card key={index} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium">{improvement.type}</span>
                                    <Badge variant="outline" className="text-xs">
                                      Impact: {improvement.impact}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{improvement.description}</p>
                                  {improvement.code && (
                                    <pre className="bg-gray-900 p-2 rounded text-xs overflow-auto max-h-32">
                                      {improvement.code}
                                    </pre>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">AI Code Analysis</h3>
                    <p className="text-gray-400 mb-4">
                      Click "Analyze Code" to start AI-powered code analysis and generate intelligent patches
                    </p>
                    <Button onClick={analyzeCode} disabled={isAnalyzing || !zaiInstance}>
                      {isAnalyzing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Target className="h-4 w-4 mr-2" />
                      )}
                      Start Analysis
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="patches" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {patches.map((patch) => (
                    <Card key={patch.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <GitBranch className="h-4 w-4" />
                            <span>{patch.description}</span>
                            {getStatusBadge(patch.status)}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {patch.type}
                            </Badge>
                            <Badge 
                              variant={patch.priority === 'critical' ? 'destructive' : 'default'}
                              className="text-xs"
                            >
                              {patch.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Confidence:</span>
                              <span className="ml-2">{Math.round(patch.confidence * 100)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Risk:</span>
                              <span className="ml-2">{Math.round(patch.risk * 100)}%</span>
                            </div>
                          </div>
                          
                          {patch.explanation && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Explanation</h4>
                              <p className="text-sm text-gray-300">{patch.explanation}</p>
                            </div>
                          )}
                          
                          {patch.patchedCode && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Proposed Changes</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Original</div>
                                  <pre className="bg-gray-900 p-2 rounded text-xs overflow-auto max-h-32">
                                    {patch.originalCode.substring(0, 200)}...
                                  </pre>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Patched</div>
                                  <pre className="bg-green-900/20 p-2 rounded text-xs overflow-auto max-h-32 border border-green-800">
                                    {patch.patchedCode.substring(0, 200)}...
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              Created: {patch.createdAt.toLocaleString()}
                              {patch.appliedAt && (
                                <span className="ml-4">
                                  Applied: {patch.appliedAt.toLocaleString()}
                                </span>
                              )}
                            </div>
                            
                            {patch.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => applyPatch(patch.id)}
                                disabled={patch.status === 'applying'}
                              >
                                Apply Patch
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {patches.length === 0 && (
                    <div className="text-center py-12">
                      <GitBranch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Patches Available</h3>
                      <p className="text-gray-400 mb-4">
                        Analyze your code to generate intelligent patches or create custom patches with AI
                      </p>
                      <Button onClick={analyzeCode} disabled={isAnalyzing || !zaiInstance}>
                        Analyze Code
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="generate" className="h-full m-0">
              <div className="h-full flex flex-col p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Generate Custom Patch</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Describe the changes you want the AI to make to your code
                  </p>
                  
                  <div className="space-y-4">
                    <Textarea
                      placeholder="e.g., 'Add proper error handling to all API calls', 'Optimize the database query for better performance', 'Implement input validation for security'..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="min-h-24"
                    />
                    
                    <Button 
                      onClick={() => generatePatch(aiPrompt)}
                      disabled={isGenerating || !aiPrompt.trim() || !zaiInstance}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Lightbulb className="h-4 w-4 mr-2" />
                      )}
                      Generate Patch
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <ScrollArea className="h-full">
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-medium mb-2">Patch Suggestions</h4>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div>• "Add TypeScript types for better type safety"</div>
                          <div>• "Extract magic numbers into constants"</div>
                          <div>• "Add JSDoc comments for documentation"</div>
                          <div>• "Implement proper error boundaries"</div>
                          <div>• "Add unit tests for critical functions"</div>
                          <div>• "Optimize React component re-renders"</div>
                          <div>• "Add input validation and sanitization"</div>
                          <div>• "Implement proper logging system"</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-medium mb-2">Best Practices</h4>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div>• Be specific about what you want to change</div>
                          <div>• Include context about the codebase</div>
                          <div>• Mention any specific requirements or constraints</div>
                          <div>• Review generated patches before applying</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Patch History</h3>
                  
                  {patches.filter(p => p.status === 'applied').map((patch) => (
                    <Card key={patch.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{patch.description}</span>
                          </div>
                          <Badge variant="default" className="bg-green-500">Applied</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                          <div>
                            <span className="text-gray-400">Type:</span>
                            <span className="ml-2 capitalize">{patch.type}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Confidence:</span>
                            <span className="ml-2">{Math.round(patch.confidence * 100)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Applied:</span>
                            <span className="ml-2">
                              {patch.appliedAt ? patch.appliedAt.toLocaleString() : 'Unknown'}
                            </span>
                          </div>
                        </div>
                        
                        {patch.explanation && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-400 mb-1">Explanation:</div>
                            <p className="text-sm text-gray-300">{patch.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {patches.filter(p => p.status === 'applied').length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Applied Patches</h3>
                      <p className="text-gray-400">
                        Patches that have been applied will appear here
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}