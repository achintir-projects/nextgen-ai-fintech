"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Globe, 
  Smartphone, 
  Terminal, 
  Play, 
  Square, 
  RefreshCw,
  Copy,
  Download,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface PreviewData {
  html: string
  css: string
  js: string
  apiEndpoints: APIEndpoint[]
}

interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters: Parameter[]
  response: any
}

interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
}

interface MultiPlatformPreviewProps {
  code: string
  framework: string
  platform: string
  isRunning: boolean
  onRun: () => void
  onStop: () => void
}

export default function MultiPlatformPreview({ 
  code, 
  framework, 
  platform, 
  isRunning, 
  onRun, 
  onStop 
}: MultiPlatformPreviewProps) {
  const [activePreview, setActivePreview] = useState<'web' | 'mobile' | 'api'>('web')
  const [previewData, setPreviewData] = useState<PreviewData>({
    html: '',
    css: '',
    js: '',
    apiEndpoints: []
  })
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('')
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isApiLoading, setIsApiLoading] = useState(false)

  useEffect(() => {
    compilePreview()
  }, [code, framework])

  const compilePreview = () => {
    const mockPreviewData: PreviewData = {
      html: `
        <div class="min-h-screen bg-gray-50">
          <nav class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between h-16">
                <div class="flex items-center">
                  <h1 class="text-xl font-semibold text-gray-900">PAAM Application</h1>
                </div>
                <div class="flex items-center space-x-4">
                  <button class="text-gray-500 hover:text-gray-700">Login</button>
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Get Started</button>
                </div>
              </div>
            </div>
          </nav>
          
          <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
              <div class="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to PAAM Studio</h2>
                <p class="text-gray-600 mb-6">Your PAAM specification is running live</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-blue-600 mb-2">👥 Users</div>
                    <div class="text-2xl font-bold">1,234</div>
                    <div class="text-sm text-gray-500">Active users</div>
                  </div>
                  <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-green-600 mb-2">💰 Transactions</div>
                    <div class="text-2xl font-bold">5,678</div>
                    <div class="text-sm text-gray-500">Today</div>
                  </div>
                  <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-purple-600 mb-2">📊 Analytics</div>
                    <div class="text-2xl font-bold">98.5%</div>
                    <div class="text-sm text-gray-500">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      `,
      css: '',
      js: '',
      apiEndpoints: [
        {
          id: '1',
          method: 'GET',
          path: '/api/users',
          description: 'Get all users',
          parameters: [],
          response: { users: [{ id: 1, name: 'John Doe', email: 'john@example.com' }] }
        },
        {
          id: '2',
          method: 'POST',
          path: '/api/transactions',
          description: 'Create a new transaction',
          parameters: [
            { name: 'amount', type: 'number', required: true, description: 'Transaction amount' },
            { name: 'currency', type: 'string', required: true, description: 'Currency code' }
          ],
          response: { id: 'tx_123', status: 'success', amount: 100 }
        }
      ]
    }
    
    setPreviewData(mockPreviewData)
    if (mockPreviewData.apiEndpoints.length > 0) {
      setSelectedEndpoint(mockPreviewData.apiEndpoints[0].id)
    }
  }

  const testAPIEndpoint = async (endpointId: string) => {
    const endpoint = previewData.apiEndpoints.find(e => e.id === endpointId)
    if (!endpoint) return

    setIsApiLoading(true)
    
    setTimeout(() => {
      setApiResponse({
        status: 200,
        data: endpoint.response,
        headers: {
          'Content-Type': 'application/json',
          'X-PAAM-Framework': framework,
          'X-PAAM-Version': '1.0.0'
        },
        duration: Math.floor(Math.random() * 200) + 50
      })
      setIsApiLoading(false)
    }, 1000)
  }

  const getMobileFrame = () => {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="relative">
          <div className="w-80 h-[700px] bg-black rounded-[3rem] p-4 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 flex items-center justify-between text-xs">
                <span>9:41</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-3 bg-black rounded-sm"></div>
                  <div className="w-1 h-3 bg-black rounded-sm"></div>
                  <div className="w-6 h-3 bg-black rounded-sm"></div>
                </div>
              </div>
              <div className="h-[calc(100%-32px)] overflow-auto">
                <iframe
                  srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }</style>
</head>
<body>
  ${previewData.html}
</body>
</html>`}
                  className="w-full h-full"
                  title="Mobile Preview"
                  style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rounded-full"></div>
        </div>
      </div>
    )
  }

  const getWebPreview = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4">
          <iframe
            srcDoc={`<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }</style>
</head>
<body>
  ${previewData.html}
</body>
</html>`}
            className="w-full h-full border rounded"
            title="Web Preview"
          />
        </div>
      </div>
    )
  }

  const getAPIExplorer = () => {
    const selectedEndpointData = previewData.apiEndpoints.find(e => e.id === selectedEndpoint)
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
            <div className="space-y-3">
              {previewData.apiEndpoints.map(endpoint => (
                <Card 
                  key={endpoint.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedEndpoint === endpoint.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedEndpoint(endpoint.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        endpoint.method === 'GET' ? 'default' : 
                        endpoint.method === 'POST' ? 'secondary' : 'destructive'
                      }>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-sm text-gray-600">{endpoint.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            {selectedEndpointData && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Test Endpoint</h3>
                  <Button 
                    size="sm" 
                    onClick={() => testAPIEndpoint(selectedEndpointData.id)}
                    disabled={isApiLoading}
                  >
                    {isApiLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Test
                  </Button>
                </div>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Badge variant={
                        selectedEndpointData.method === 'GET' ? 'default' : 
                        selectedEndpointData.method === 'POST' ? 'secondary' : 'destructive'
                      } className="mr-2">
                        {selectedEndpointData.method}
                      </Badge>
                      {selectedEndpointData.path}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedEndpointData.description}
                    </p>
                  </CardContent>
                </Card>

                {apiResponse && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Response
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Badge variant="default">{apiResponse.status}</Badge>
                          </span>
                          <span>{apiResponse.duration}ms</span>
                        </div>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(apiResponse.data, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium">Preview</h3>
            <Tabs value={activePreview} onValueChange={(value: any) => setActivePreview(value)}>
              <TabsList className="h-8">
                <TabsTrigger value="web" className="h-7 text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Web
                </TabsTrigger>
                <TabsTrigger value="mobile" className="h-7 text-xs">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="api" className="h-7 text-xs">
                  <Terminal className="h-3 w-3 mr-1" />
                  API
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {isRunning ? (
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Running
                </span>
              ) : (
                <span className="flex items-center text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                  Stopped
                </span>
              )}
            </div>
            
            {isRunning ? (
              <Button size="sm" variant="outline" onClick={onStop}>
                <Square className="h-3 w-3 mr-1" />
                Stop
              </Button>
            ) : (
              <Button size="sm" onClick={onRun}>
                <Play className="h-3 w-3 mr-1" />
                Run
              </Button>
            )}
            
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activePreview === 'web' && getWebPreview()}
          {activePreview === 'mobile' && getMobileFrame()}
          {activePreview === 'api' && getAPIExplorer()}
        </div>

        <div className="border-t bg-gray-50 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Framework: {framework}</span>
              <span>Platform: {platform}</span>
              <span>Compiled: Just now</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="h-6 text-xs">
                <Copy className="h-3 w-3 mr-1" />
                Copy URL
              </Button>
              <Button size="sm" variant="ghost" className="h-6 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}