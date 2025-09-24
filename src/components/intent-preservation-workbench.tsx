"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Eye, 
  GitBranch, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  Lightbulb,
  Users,
  Database
} from 'lucide-react'

interface Requirement {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'satisfied' | 'partial' | 'not-satisfied' | 'unknown'
  mappedTo: string[]
  confidence: number
}

interface ImpactAnalysis {
  changeId: string
  changeType: 'entity' | 'flow' | 'compliance' | 'code'
  description: string
  impact: 'high' | 'medium' | 'low'
  affectedRequirements: string[]
  affectedComponents: string[]
  riskScore: number
  recommendations: string[]
}

interface BusinessLogic {
  id: string
  name: string
  description: string
  source: 'spec' | 'code' | 'both'
  complexity: 'simple' | 'medium' | 'complex'
  coverage: number
  mappedRequirements: string[]
}

interface IntentPreservationWorkbenchProps {
  entities: any[]
  flows: any[]
  requirements: Requirement[]
  onAnalysisRequest?: () => void
}

export default function IntentPreservationWorkbench({ 
  entities, 
  flows, 
  requirements,
  onAnalysisRequest 
}: IntentPreservationWorkbenchProps) {
  const [activeTab, setActiveTab] = useState('requirements')
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis[]>([])
  const [businessLogic, setBusinessLogic] = useState<BusinessLogic[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    analyzeIntentPreservation()
  }, [entities, flows, requirements])

  const analyzeIntentPreservation = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis
    setTimeout(() => {
      const mockImpactAnalysis: ImpactAnalysis[] = [
        {
          changeId: '1',
          changeType: 'entity',
          description: 'User entity structure modification',
          impact: 'high',
          affectedRequirements: ['REQ-001', 'REQ-003'],
          affectedComponents: ['Authentication', 'Profile Management'],
          riskScore: 0.8,
          recommendations: [
            'Update authentication flows to match new user structure',
            'Verify data migration compatibility',
            'Test profile management functionality'
          ]
        },
        {
          changeId: '2',
          changeType: 'flow',
          description: 'Payment flow optimization',
          impact: 'medium',
          affectedRequirements: ['REQ-002'],
          affectedComponents: ['Payment Processing', 'Transaction History'],
          riskScore: 0.5,
          recommendations: [
            'Validate transaction integrity',
            'Ensure compliance with payment regulations',
            'Test with various payment methods'
          ]
        }
      ]

      const mockBusinessLogic: BusinessLogic[] = [
        {
          id: '1',
          name: 'User Authentication',
          description: 'Multi-factor authentication with biometric support',
          source: 'both',
          complexity: 'medium',
          coverage: 95,
          mappedRequirements: ['REQ-001']
        },
        {
          id: '2',
          name: 'Payment Processing',
          description: 'Secure transaction processing with fraud detection',
          source: 'both',
          complexity: 'complex',
          coverage: 88,
          mappedRequirements: ['REQ-002']
        },
        {
          id: '3',
          name: 'Data Privacy',
          description: 'GDPR-compliant data handling and storage',
          source: 'spec',
          complexity: 'medium',
          coverage: 72,
          mappedRequirements: ['REQ-003']
        }
      ]

      setImpactAnalysis(mockImpactAnalysis)
      setBusinessLogic(mockBusinessLogic)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'satisfied': return 'bg-green-500'
      case 'partial': return 'bg-yellow-500'
      case 'not-satisfied': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 border-red-200'
      case 'medium': return 'text-yellow-600 border-yellow-200'
      case 'low': return 'text-green-600 border-green-200'
      default: return 'text-gray-600 border-gray-200'
    }
  }

  const overallCompliance = requirements.length > 0 
    ? (requirements.filter(r => r.status === 'satisfied').length / requirements.length) * 100 
    : 0

  return (
    <div className="h-full bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Intent Preservation Workbench</h2>
            <p className="text-gray-400">
              Trace requirements, analyze impact, and ensure business logic consistency across your PAAM specification
            </p>
          </div>
          <Button onClick={analyzeIntentPreservation} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            Analyze Intent
          </Button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Requirements</p>
                  <p className="text-2xl font-bold">{requirements.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Compliance</p>
                  <p className="text-2xl font-bold">{Math.round(overallCompliance)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={overallCompliance} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Business Logic</p>
                  <p className="text-2xl font-bold">{businessLogic.length}</p>
                </div>
                <GitBranch className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Impact Alerts</p>
                  <p className="text-2xl font-bold">{impactAnalysis.filter(ia => ia.impact === 'high').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
            <TabsTrigger value="business-logic">Business Logic</TabsTrigger>
            <TabsTrigger value="consistency">Consistency</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Requirement Tracing Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requirements.map((req) => (
                    <div key={req.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{req.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {req.id}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(req.priority)}`}></div>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{req.description}</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(req.status)}`}></div>
                              {req.status.replace('-', ' ')}
                            </span>
                            <span>Confidence: {Math.round(req.confidence * 100)}%</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-xs text-gray-500">
                            {req.mappedTo.length} mapping{req.mappedTo.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      {req.mappedTo.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Mapped to:</div>
                          <div className="flex flex-wrap gap-1">
                            {req.mappedTo.map((mapping, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {mapping}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Change Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactAnalysis.map((impact) => (
                    <div key={impact.changeId} className={`border rounded-lg p-4 ${getImpactColor(impact.impact)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{impact.description}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {impact.changeType}
                            </Badge>
                            <Badge variant={impact.impact === 'high' ? 'destructive' : impact.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {impact.impact} impact
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                            <span>Risk Score: {Math.round(impact.riskScore * 100)}%</span>
                            <span>{impact.affectedRequirements.length} requirements affected</span>
                            <span>{impact.affectedComponents.length} components affected</span>
                          </div>
                        </div>
                      </div>
                      
                      {impact.affectedRequirements.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Affected Requirements:</div>
                          <div className="flex flex-wrap gap-1">
                            {impact.affectedRequirements.map((req, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {impact.recommendations.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Recommendations:</div>
                          <ul className="text-xs space-y-1">
                            {impact.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start">
                                <Lightbulb className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-yellow-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business-logic" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="h-5 w-5 mr-2" />
                  Business Logic Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessLogic.map((logic) => (
                    <div key={logic.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{logic.name}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {logic.complexity}
                            </Badge>
                            <Badge variant={logic.source === 'both' ? 'default' : 'secondary'} className="text-xs">
                              {logic.source}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{logic.description}</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span>Coverage: {logic.coverage}%</span>
                            <Progress value={logic.coverage} className="w-24 h-2" />
                          </div>
                        </div>
                      </div>
                      
                      {logic.mappedRequirements.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Mapped Requirements:</div>
                          <div className="flex flex-wrap gap-1">
                            {logic.mappedRequirements.map((req, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consistency" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Consistency Validation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Specification Consistency</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Valid</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Code-Spec Alignment</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Partial</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Requirement Coverage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{Math.round(overallCompliance)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compliance Adherence</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Architecture Quality</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Maintainability</span>
                        <span className="text-sm">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Test Coverage</span>
                        <span className="text-sm">74%</span>
                      </div>
                      <Progress value={74} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Documentation</span>
                        <span className="text-sm">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}