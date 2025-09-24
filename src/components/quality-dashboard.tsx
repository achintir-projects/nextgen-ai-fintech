"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  FileText,
  Code,
  Database,
  Eye,
  Settings,
  RefreshCw,
  Award,
  Star,
  Gauge,
  LineChart,
  PieChart
} from 'lucide-react'

interface QualityMetric {
  name: string
  value: number
  target: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface ComplianceIssue {
  id: string
  rule: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'security' | 'performance' | 'maintainability' | 'accessibility'
  description: string
  file: string
  line?: number
  suggestion: string
  status: 'open' | 'in-progress' | 'resolved' | 'dismissed'
  createdAt: Date
  resolvedAt?: Date
}

interface SecurityVulnerability {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  impact: string
  remediation: string
  cve?: string
  score: number
  status: 'open' | 'fixed' | 'accepted'
  discovered: Date
  fixed?: Date
}

interface TestResult {
  id: string
  name: string
  type: 'unit' | 'integration' | 'e2e' | 'security'
  status: 'passed' | 'failed' | 'skipped' | 'running'
  duration: number
  coverage: number
  lastRun: Date
  output?: string
}

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  threshold: number
  status: 'good' | 'warning' | 'critical'
  trend: 'improving' | 'stable' | 'degrading'
  history: Array<{ timestamp: Date; value: number }>
}

interface QualityDashboardProps {
  project: any
  code: string
  spec: any
}

export default function QualityDashboard({ project, code, spec }: QualityDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([
    {
      name: 'Code Quality',
      value: 87,
      target: 90,
      status: 'good',
      trend: 'up',
      description: 'Overall code health and maintainability'
    },
    {
      name: 'Security Score',
      value: 78,
      target: 85,
      status: 'fair',
      trend: 'stable',
      description: 'Security vulnerabilities and compliance'
    },
    {
      name: 'Performance',
      value: 92,
      target: 80,
      status: 'excellent',
      trend: 'up',
      description: 'Application performance and efficiency'
    },
    {
      name: 'Test Coverage',
      value: 74,
      target: 80,
      status: 'fair',
      trend: 'up',
      description: 'Test coverage and quality'
    },
    {
      name: 'Documentation',
      value: 68,
      target: 75,
      status: 'fair',
      trend: 'stable',
      description: 'Code documentation and API docs'
    },
    {
      name: 'Accessibility',
      value: 85,
      target: 90,
      status: 'good',
      trend: 'up',
      description: 'WCAG compliance and accessibility'
    }
  ])

  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([
    {
      id: 'comp-1',
      rule: 'CWE-79: XSS Prevention',
      severity: 'high',
      category: 'security',
      description: 'Potential cross-site scripting vulnerability in user input handling',
      file: 'components/UserForm.tsx',
      line: 45,
      suggestion: 'Implement proper input sanitization and use React\'s built-in XSS protection',
      status: 'open',
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: 'comp-2',
      rule: 'Performance: Large Bundle Size',
      severity: 'medium',
      category: 'performance',
      description: 'JavaScript bundle size exceeds recommended limits',
      file: 'app/page.tsx',
      suggestion: 'Implement code splitting and lazy loading for large components',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 172800000) // 2 days ago
    },
    {
      id: 'comp-3',
      rule: 'Accessibility: Missing Alt Text',
      severity: 'medium',
      category: 'accessibility',
      description: 'Images missing alternative text descriptions',
      file: 'components/Header.tsx',
      line: 23,
      suggestion: 'Add descriptive alt text to all images for screen readers',
      status: 'resolved',
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      resolvedAt: new Date(Date.now() - 86400000)
    }
  ])

  const [securityVulnerabilities, setSecurityVulnerabilities] = useState<SecurityVulnerability[]>([
    {
      id: 'sec-1',
      type: 'SQL Injection',
      severity: 'critical',
      description: 'Potential SQL injection in database query',
      impact: 'Could allow attackers to execute arbitrary SQL commands',
      remediation: 'Use parameterized queries or ORM with proper input validation',
      score: 9.8,
      status: 'open',
      discovered: new Date(Date.now() - 432000000) // 5 days ago
    },
    {
      id: 'sec-2',
      type: 'Insecure Random',
      severity: 'medium',
      description: 'Use of cryptographically insecure random number generator',
      impact: 'Could compromise session tokens or encryption keys',
      remediation: 'Use crypto.getRandomValues() for secure random generation',
      score: 5.4,
      status: 'fixed',
      discovered: new Date(Date.now() - 604800000), // 1 week ago
      fixed: new Date(Date.now() - 172800000)
    }
  ])

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: 'test-1',
      name: 'User Authentication Flow',
      type: 'e2e',
      status: 'passed',
      duration: 2400,
      coverage: 95,
      lastRun: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: 'test-2',
      name: 'Payment Processing',
      type: 'integration',
      status: 'failed',
      duration: 1800,
      coverage: 88,
      lastRun: new Date(Date.now() - 7200000), // 2 hours ago
      output: 'AssertionError: Expected payment status to be "completed"'
    },
    {
      id: 'test-3',
      name: 'Input Validation',
      type: 'unit',
      status: 'passed',
      duration: 450,
      coverage: 100,
      lastRun: new Date(Date.now() - 10800000) // 3 hours ago
    },
    {
      id: 'test-4',
      name: 'Security Headers',
      type: 'security',
      status: 'running',
      duration: 0,
      coverage: 0,
      lastRun: new Date(Date.now() - 60000) // 1 minute ago
    }
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Page Load Time',
      value: 1.2,
      unit: 's',
      threshold: 2.0,
      status: 'good',
      trend: 'improving',
      history: [
        { timestamp: new Date(Date.now() - 86400000), value: 1.8 },
        { timestamp: new Date(Date.now() - 43200000), value: 1.5 },
        { timestamp: new Date(), value: 1.2 }
      ]
    },
    {
      name: 'Time to Interactive',
      value: 2.1,
      unit: 's',
      threshold: 3.0,
      status: 'good',
      trend: 'stable',
      history: [
        { timestamp: new Date(Date.now() - 86400000), value: 2.3 },
        { timestamp: new Date(Date.now() - 43200000), value: 2.0 },
        { timestamp: new Date(), value: 2.1 }
      ]
    },
    {
      name: 'Bundle Size',
      value: 245,
      unit: 'KB',
      threshold: 300,
      status: 'good',
      trend: 'improving',
      history: [
        { timestamp: new Date(Date.now() - 86400000), value: 280 },
        { timestamp: new Date(Date.now() - 43200000), value: 260 },
        { timestamp: new Date(), value: 245 }
      ]
    }
  ])

  const refreshData = async () => {
    setIsRefreshing(true)
    
    // Simulate data refresh
    setTimeout(() => {
      setQualityMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.min(100, metric.value + (Math.random() * 10 - 5))
      })))
      setIsRefreshing(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return 'text-green-500'
      case 'fair':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-900/20'
      case 'high':
        return 'text-orange-600 bg-orange-900/20'
      case 'medium':
        return 'text-yellow-600 bg-yellow-900/20'
      case 'low':
        return 'text-blue-600 bg-blue-900/20'
      default:
        return 'text-gray-600 bg-gray-900/20'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-500">Passed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'skipped':
        return <Badge variant="secondary">Skipped</Badge>
      case 'running':
        return <Badge variant="default" className="bg-blue-500">Running</Badge>
      case 'open':
        return <Badge variant="destructive">Open</Badge>
      case 'in-progress':
        return <Badge variant="default" className="bg-yellow-500">In Progress</Badge>
      case 'resolved':
        return <Badge variant="default" className="bg-green-500">Resolved</Badge>
      case 'dismissed':
        return <Badge variant="secondary">Dismissed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getOverallHealthScore = () => {
    const totalScore = qualityMetrics.reduce((sum, metric) => sum + metric.value, 0)
    return Math.round(totalScore / qualityMetrics.length)
  }

  const overallScore = getOverallHealthScore()
  const overallStatus = overallScore >= 85 ? 'excellent' : overallScore >= 70 ? 'good' : overallScore >= 55 ? 'fair' : 'poor'

  return (
    <div className="h-full bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold">Quality Dashboard</h2>
            <p className="text-sm text-gray-400">Comprehensive quality metrics and compliance monitoring</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-2xl font-bold">{overallScore}</div>
              <div className="text-xs text-gray-400">Overall Score</div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(overallStatus)} bg-opacity-20`}>
              {overallScore >= 85 ? <Award className="h-6 w-6" /> : 
               overallScore >= 70 ? <Star className="h-6 w-6" /> : 
               overallScore >= 55 ? <CheckCircle className="h-6 w-6" /> : 
               <AlertTriangle className="h-6 w-6" />}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={refreshData} disabled={isRefreshing} size="sm">
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-5 h-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="overview" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {/* Quality Metrics Grid */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {qualityMetrics.map((metric, index) => (
                        <Card key={index} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Gauge className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">{metric.name}</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${getStatusColor(metric.status)}`}>
                                {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                                 metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
                                 <Activity className="h-4 w-4" />}
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{metric.value}%</span>
                                <span className="text-gray-400">Target: {metric.target}%</span>
                              </div>
                              <Progress value={metric.value} className="h-2" />
                            </div>
                            
                            <p className="text-xs text-gray-400">{metric.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Recent Issues */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Compliance Issues</h3>
                      <div className="space-y-3">
                        {complianceIssues.slice(0, 3).map((issue) => (
                          <Card key={issue.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm">{issue.rule}</span>
                                    {getStatusBadge(issue.status)}
                                  </div>
                                  <p className="text-xs text-gray-300 mb-1">{issue.description}</p>
                                  <div className="text-xs text-gray-500">
                                    {issue.file}{issue.line && `:${issue.line}`}
                                  </div>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getSeverityColor(issue.severity)}`}
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                      <div className="space-y-3">
                        {testResults.map((test) => (
                          <Card key={test.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{test.name}</span>
                                  {getStatusBadge(test.status)}
                                </div>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {test.type}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-400">Duration:</span>
                                  <span className="ml-1">{test.duration}ms</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Coverage:</span>
                                  <span className="ml-1">{test.coverage}%</span>
                                </div>
                              </div>
                              
                              {test.output && (
                                <div className="mt-2 text-xs text-red-400">
                                  {test.output}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="compliance" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {/* Compliance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Shield className="h-8 w-8 text-green-500" />
                          <Badge variant="default" className="bg-green-500">Compliant</Badge>
                        </div>
                        <div className="text-2xl font-bold">87%</div>
                        <div className="text-xs text-gray-400">Overall Compliance</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <AlertTriangle className="h-8 w-8 text-yellow-500" />
                          <Badge variant="secondary">Open</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {complianceIssues.filter(i => i.status === 'open').length}
                        </div>
                        <div className="text-xs text-gray-400">Open Issues</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <CheckCircle className="h-8 w-8 text-blue-500" />
                          <Badge variant="default" className="bg-blue-500">In Progress</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {complianceIssues.filter(i => i.status === 'in-progress').length}
                        </div>
                        <div className="text-xs text-gray-400">In Progress</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Award className="h-8 w-8 text-purple-500" />
                          <Badge variant="default" className="bg-green-500">Resolved</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {complianceIssues.filter(i => i.status === 'resolved').length}
                        </div>
                        <div className="text-xs text-gray-400">Resolved Today</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Compliance Issues Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Compliance Issues</h3>
                    <div className="space-y-3">
                      {complianceIssues.map((issue) => (
                        <Card key={issue.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-medium">{issue.rule}</h4>
                                  {getStatusBadge(issue.status)}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getSeverityColor(issue.severity)}`}
                                  >
                                    {issue.severity}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {issue.category}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-300 mb-2">{issue.description}</p>
                                <p className="text-xs text-blue-400 mb-2">
                                  💡 {issue.suggestion}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{issue.file}{issue.line && `:${issue.line}`}</span>
                                  <span>Created: {issue.createdAt.toLocaleDateString()}</span>
                                  {issue.resolvedAt && (
                                    <span>Resolved: {issue.resolvedAt.toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="ml-4">
                                <Button size="sm" variant="outline" className="h-8 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="security" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {/* Security Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Shield className="h-8 w-8 text-red-500" />
                          <Badge variant="destructive">Critical</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {securityVulnerabilities.filter(v => v.severity === 'critical').length}
                        </div>
                        <div className="text-xs text-gray-400">Critical Vulnerabilities</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <XCircle className="h-8 w-8 text-orange-500" />
                          <Badge variant="secondary">Open</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {securityVulnerabilities.filter(v => v.status === 'open').length}
                        </div>
                        <div className="text-xs text-gray-400">Open Vulnerabilities</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                          <Badge variant="default" className="bg-green-500">Fixed</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {securityVulnerabilities.filter(v => v.status === 'fixed').length}
                        </div>
                        <div className="text-xs text-gray-400">Fixed This Week</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Security Vulnerabilities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Security Vulnerabilities</h3>
                    <div className="space-y-3">
                      {securityVulnerabilities.map((vuln) => (
                        <Card key={vuln.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-medium">{vuln.type}</h4>
                                  {getStatusBadge(vuln.status)}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getSeverityColor(vuln.severity)}`}
                                  >
                                    {vuln.severity} (CVSS: {vuln.score})
                                  </Badge>
                                  {vuln.cve && (
                                    <Badge variant="outline" className="text-xs">
                                      {vuln.cve}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-300 mb-2">{vuln.description}</p>
                                <p className="text-sm text-red-400 mb-2">
                                  🚨 Impact: {vuln.impact}
                                </p>
                                <p className="text-xs text-blue-400 mb-2">
                                  🔧 {vuln.remediation}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Discovered: {vuln.discovered.toLocaleDateString()}</span>
                                  {vuln.fixed && (
                                    <span>Fixed: {vuln.fixed.toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="ml-4">
                                <Button size="sm" variant="outline" className="h-8 text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="testing" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {/* Testing Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                          <Badge variant="default" className="bg-green-500">Passed</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {testResults.filter(t => t.status === 'passed').length}
                        </div>
                        <div className="text-xs text-gray-400">Tests Passed</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <XCircle className="h-8 w-8 text-red-500" />
                          <Badge variant="destructive">Failed</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {testResults.filter(t => t.status === 'failed').length}
                        </div>
                        <div className="text-xs text-gray-400">Tests Failed</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Activity className="h-8 w-8 text-blue-500" />
                          <Badge variant="default" className="bg-blue-500">Running</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {testResults.filter(t => t.status === 'running').length}
                        </div>
                        <div className="text-xs text-gray-400">Currently Running</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Target className="h-8 w-8 text-purple-500" />
                          <Badge variant="outline">Coverage</Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          {Math.round(testResults.reduce((sum, t) => sum + t.coverage, 0) / testResults.length)}%
                        </div>
                        <div className="text-xs text-gray-400">Average Coverage</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Test Results */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                    <div className="space-y-3">
                      {testResults.map((test) => (
                        <Card key={test.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-medium">{test.name}</h4>
                                  {getStatusBadge(test.status)}
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {test.type}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                                  <div>
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="ml-1">{test.duration}ms</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Coverage:</span>
                                    <span className="ml-1">{test.coverage}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Last Run:</span>
                                    <span className="ml-1">{test.lastRun.toLocaleTimeString()}</span>
                                  </div>
                                </div>
                                
                                {test.output && (
                                  <div className="mt-2 p-2 bg-red-900/20 border border-red-800 rounded">
                                    <div className="text-xs text-red-400 font-medium mb-1">Output:</div>
                                    <div className="text-xs text-red-300">{test.output}</div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="ml-4 flex space-x-2">
                                <Button size="sm" variant="outline" className="h-8 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 text-xs">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Re-run
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="performance" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {/* Performance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Zap className="h-8 w-8 text-green-500" />
                          <Badge variant="default" className="bg-green-500">Good</Badge>
                        </div>
                        <div className="text-2xl font-bold">1.2s</div>
                        <div className="text-xs text-gray-400">Page Load Time</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Database className="h-8 w-8 text-blue-500" />
                          <Badge variant="default" className="bg-blue-500">Stable</Badge>
                        </div>
                        <div className="text-2xl font-bold">245KB</div>
                        <div className="text-xs text-gray-400">Bundle Size</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <LineChart className="h-8 w-8 text-purple-500" />
                          <Badge variant="outline">Improving</Badge>
                        </div>
                        <div className="text-2xl font-bold">+15%</div>
                        <div className="text-xs text-gray-400">Performance Gain</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      {performanceMetrics.map((metric) => (
                        <Card key={metric.name} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">{metric.name}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold">{metric.value}{metric.unit}</span>
                                <Badge 
                                  variant={metric.status === 'good' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}
                                  className={metric.status === 'good' ? 'bg-green-500' : 
                                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}
                                >
                                  {metric.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Current: {metric.value}{metric.unit}</span>
                                <span className="text-gray-400">Threshold: {metric.threshold}{metric.unit}</span>
                              </div>
                              <Progress 
                                value={Math.min(100, (metric.value / metric.threshold) * 100)} 
                                className="h-2" 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-400">
                                  {metric.trend === 'improving' ? 'Improving' : 
                                   metric.trend === 'stable' ? 'Stable' : 'Degrading'}
                                </span>
                              </div>
                              
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                <LineChart className="h-3 w-3 mr-1" />
                                View History
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}