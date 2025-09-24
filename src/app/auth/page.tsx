"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  User, 
  Key, 
  Shield, 
  Plus, 
  Copy, 
  Trash2, 
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

interface ApiKey {
  id: string
  name: string
  key: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export default function AuthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState("")
  const [showKey, setShowKey] = useState<{[key: string]: boolean}>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Mock API keys data
  const mockApiKeys: ApiKey[] = [
    {
      id: "1",
      name: "Production App",
      key: "paam_pk_live_51N8z4f2F4h7j9k1m3n5q7s9w1y3b5d7x9z2c4v6b8n0m2k4j6h8g0f1d3s5",
      isActive: true,
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20"
    },
    {
      id: "2", 
      name: "Development App",
      key: "paam_pk_test_51N8z4f2F4h7j9k1m3n5q7s9w1y3b5d7x9z2c4v6b8n0m2k4j6h8g0f1d3s5",
      isActive: true,
      createdAt: "2024-01-10",
      lastUsed: "2024-01-19"
    },
    {
      id: "3",
      name: "Testing Key",
      key: "paam_pk_test_51N8z4f2F4h7j9k1m3n5q7s9w1y3b5d7x9z2c4v6b8n0m2k4j6h8g0f1d3s5",
      isActive: false,
      createdAt: "2024-01-05"
    }
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication
    if (email && password) {
      setIsLoggedIn(true)
      setApiKeys(mockApiKeys)
    }
  }

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `paam_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
  }

  const handleToggleKeyStatus = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, isActive: !key.isActive } : key
    ))
  }

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId))
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const toggleShowKey = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your PAAM SDK dashboard and manage your API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="developer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button className="text-blue-600 hover:underline">
                    Sign up
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
                <p className="text-gray-600">Manage your authentication keys</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Authenticated
              </Badge>
              <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Creation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Generate a new API key for your application. Keep it secure and never share it publicly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter key name (e.g., Production App, Development App)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateApiKey} disabled={!newKeyName.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Key
              </Button>
            </div>
            
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Note:</strong> API keys are sensitive information. Store them securely and never commit them to version control.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              Manage your existing API keys and monitor their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {showKey[apiKey.id] 
                            ? apiKey.key 
                            : `${apiKey.key.substring(0, 20)}...${apiKey.key.substring(apiKey.key.length - 10)}`
                          }
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleShowKey(apiKey.id)}
                        >
                          {showKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {copiedKey === apiKey.key && (
                          <span className="text-xs text-green-600">Copied!</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{apiKey.createdAt}</TableCell>
                    <TableCell>
                      {apiKey.lastUsed || (
                        <span className="text-gray-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleKeyStatus(apiKey.id)}
                        >
                          {apiKey.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Key Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Best Practices</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Use different keys for development and production</li>
                  <li>• Rotate keys regularly for security</li>
                  <li>• Monitor usage and set up alerts</li>
                  <li>• Revoke unused keys immediately</li>
                  <li>• Store keys in environment variables</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security Measures</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Never commit keys to version control</li>
                  <li>• Use HTTPS for all API requests</li>
                  <li>• Implement rate limiting</li>
                  <li>• Set key expiration dates</li>
                  <li>• Use IP whitelisting when possible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}