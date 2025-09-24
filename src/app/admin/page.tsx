"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Download, 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  Key,
  Database,
  Upload
} from "lucide-react"

interface SdkVersion {
  id: string
  version: string
  platform: string
  filename: string
  size: string
  checksum: string
  downloadUrl: string
  releaseDate: string
  isActive: boolean
  downloads: Download[]
}

interface Download {
  id: string
  userId: string
  sdkVersionId: string
  downloadedAt: string
  user: User
}

interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

interface ApiKey {
  id: string
  userId: string
  key: string
  name: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

interface Customer {
  id: string
  customerId: string
  email: string
  firstName: string
  lastName: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED' | 'BLOCKED'
  createdAt: string
  kycProfiles?: Array<{
    id: string
    profileType: 'INDIVIDUAL' | 'BUSINESS' | 'TRUST'
    verificationStatus: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED'
    createdAt: string
  }>
  accounts?: Array<{
    id: string
    accountType: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CRYPTO'
    balance: number
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED' | 'SUSPENDED'
  }>
  _count?: {
    kycProfiles: number
    accounts: number
    transactions: number
  }
}

interface KYCProfile {
  id: string
  customerId: string
  profileType: 'INDIVIDUAL' | 'BUSINESS' | 'TRUST'
  verificationStatus: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED'
  riskScore?: number
  createdAt: string
  customer: {
    id: string
    email: string
    firstName: string
    lastName: string
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }
  documents?: Array<{
    id: string
    documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'UTILITY_BILL' | 'BANK_STATEMENT' | 'PROOF_OF_ADDRESS' | 'BUSINESS_REGISTRATION' | 'TAX_ID'
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW'
    createdAt: string
  }>
  checks?: Array<{
    id: string
    checkType: 'SANCTIONS' | 'PEP' | 'WATCHLIST' | 'ID_VERIFICATION' | 'AGE_VERIFICATION' | 'ADDRESS_VERIFICATION'
    status: 'PENDING' | 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED' | 'ERROR'
    riskScore?: number
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [sdkVersions, setSdkVersions] = useState<SdkVersion[]>([])
  const [downloads, setDownloads] = useState<Download[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [kycProfiles, setKycProfiles] = useState<KYCProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSdk, setShowAddSdk] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showAddKyc, setShowAddKyc] = useState(false)
  const [newSdk, setNewSdk] = useState({
    version: '',
    platform: '',
    filename: '',
    size: '',
    checksum: '',
    downloadUrl: '',
    changelog: ''
  })
  const [newCustomer, setNewCustomer] = useState({
    customerId: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    countryOfResidence: '',
    riskLevel: 'MEDIUM'
  })
  const [newKyc, setNewKyc] = useState({
    customerId: '',
    profileType: 'INDIVIDUAL',
    documents: [{ type: 'PASSPORT', documentNumber: '' }],
    checks: ['SANCTIONS', 'PEP', 'ID_VERIFICATION']
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [sdkRes, downloadRes, userRes, apiKeyRes, customerRes, kycRes] = await Promise.all([
        fetch('/api/sdk'),
        fetch('/api/admin/downloads'),
        fetch('/api/admin/users'),
        fetch('/api/admin/apikeys'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/kyc')
      ])

      const sdkData = await sdkRes.json()
      const downloadData = await downloadRes.json()
      const userData = await userRes.json()
      const apiKeyData = await apiKeyRes.json()
      const customerData = await customerRes.json()
      const kycData = await kycRes.json()

      if (sdkData.success) setSdkVersions(sdkData.data)
      if (downloadData.success) setDownloads(downloadData.data)
      if (userData.success) setUsers(userData.data)
      if (apiKeyData.success) setApiKeys(apiKeyData.data)
      if (customerData.success) setCustomers(customerData.data)
      if (kycData.success) setKycProfiles(kycData.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSdk = async () => {
    try {
      const response = await fetch('/api/sdk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSdk)
      })

      const data = await response.json()
      if (data.success) {
        setShowAddSdk(false)
        setNewSdk({
          version: '',
          platform: '',
          filename: '',
          size: '',
          checksum: '',
          downloadUrl: '',
          changelog: ''
        })
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error adding SDK version:', error)
    }
  }

  const toggleSdkStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/sdk/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error toggling SDK status:', error)
    }
  }

  const handleAddCustomer = async () => {
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer)
      })

      const data = await response.json()
      if (data.success) {
        setShowAddCustomer(false)
        setNewCustomer({
          customerId: '',
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          dateOfBirth: '',
          nationality: '',
          countryOfResidence: '',
          riskLevel: 'MEDIUM'
        })
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error adding customer:', error)
    }
  }

  const handleAddKyc = async () => {
    try {
      const response = await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newKyc,
          documents: newKyc.documents.map(doc => ({
            type: doc.type,
            documentNumber: doc.documentNumber
          }))
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowAddKyc(false)
        setNewKyc({
          customerId: '',
          profileType: 'INDIVIDUAL',
          documents: [{ type: 'PASSPORT', documentNumber: '' }],
          checks: ['SANCTIONS', 'PEP', 'ID_VERIFICATION']
        })
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error adding KYC profile:', error)
    }
  }

  const updateKycStatus = async (kycId: string, status: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/kyc/${kycId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason })
      })

      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating KYC status:', error)
    }
  }

  const stats = {
    totalDownloads: downloads.length,
    totalUsers: users.length,
    activeApiKeys: apiKeys.filter(key => key.isActive).length,
    activeSdkVersions: sdkVersions.filter(sdk => sdk.isActive).length,
    totalCustomers: customers.length,
    pendingKyc: kycProfiles.filter(kyc => kyc.verificationStatus === 'PENDING' || kyc.verificationStatus === 'IN_PROGRESS').length,
    approvedKyc: kycProfiles.filter(kyc => kyc.verificationStatus === 'APPROVED').length,
    highRiskCustomers: customers.filter(cust => cust.riskLevel === 'HIGH' || cust.riskLevel === 'CRITICAL').length
  }

  const platformStats = {
    android: sdkVersions.filter(sdk => sdk.platform === 'android').length,
    ios: sdkVersions.filter(sdk => sdk.platform === 'ios').length
  }

  const recentDownloads = downloads.slice(0, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage PAAM SDK platform</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowAddSdk(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add SDK Version
              </Button>
              <Button variant="outline" asChild>
                <a href="/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
              <p className="text-xs text-muted-foreground">
                All time downloads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered developers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeApiKeys}</div>
              <p className="text-xs text-muted-foreground">
                Active API keys
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SDK Versions</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSdkVersions}</div>
              <p className="text-xs text-muted-foreground">
                Active versions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingKyc}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Distribution & Compliance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>SDK versions by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🤖</span>
                    <span>Android</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{platformStats.android} versions</Badge>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🍎</span>
                    <span>iOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{platformStats.ios} versions</Badge>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>KYC/AML verification overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">✅</span>
                    <span>Approved KYC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">{stats.approvedKyc}</Badge>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⚠️</span>
                    <span>High Risk Customers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">{stats.highRiskCustomers}</Badge>
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setShowAddSdk(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add SDK Version
              </Button>
              <Button className="w-full justify-start" onClick={() => setShowAddCustomer(true)}>
                <Users className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
              <Button className="w-full justify-start" onClick={() => setShowAddKyc(true)}>
                <Shield className="mr-2 h-4 w-4" />
                Start KYC Verification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="sdk" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="sdk">SDK Versions</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="apikeys">API Keys</TabsTrigger>
            <TabsTrigger value="kyc">KYC/AML</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="sdk">
            <Card>
              <CardHeader>
                <CardTitle>SDK Versions</CardTitle>
                <CardDescription>Manage SDK versions and their availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sdkVersions.map((sdk) => (
                      <TableRow key={sdk.id}>
                        <TableCell className="font-medium">{sdk.version}</TableCell>
                        <TableCell>
                          <Badge variant={sdk.platform === 'android' ? 'default' : 'secondary'}>
                            {sdk.platform}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{sdk.filename}</TableCell>
                        <TableCell>{sdk.size}</TableCell>
                        <TableCell>
                          <Badge variant={sdk.isActive ? 'default' : 'destructive'}>
                            {sdk.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{sdk.downloads.length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSdkStatus(sdk.id, !sdk.isActive)}
                            >
                              {sdk.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>Recent Downloads</CardTitle>
                <CardDescription>Latest SDK downloads by users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>SDK Version</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Downloaded At</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDownloads.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{download.user.email}</div>
                            <div className="text-sm text-gray-500">{download.user.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{download.sdkVersionId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Unknown</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(download.downloadedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {download.id.substring(0, 8)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Registered developers and their activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>API Keys</TableHead>
                      <TableHead>Downloads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const userApiKeys = apiKeys.filter(key => key.userId === user.id)
                      const userDownloads = downloads.filter(download => download.userId === user.id)
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{userApiKeys.length}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{userDownloads.length}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apikeys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => {
                      const user = users.find(u => u.id === apiKey.userId)
                      
                      return (
                        <TableRow key={apiKey.id}>
                          <TableCell className="font-medium">{apiKey.name}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {apiKey.key.substring(0, 20)}...
                          </TableCell>
                          <TableCell>{user?.email || 'Unknown'}</TableCell>
                          <TableCell>
                            {new Date(apiKey.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {apiKey.lastUsed 
                              ? new Date(apiKey.lastUsed).toLocaleDateString() 
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={apiKey.isActive ? 'default' : 'destructive'}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>KYC/AML Verification</CardTitle>
                    <CardDescription>Manage customer verification and compliance checks</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddKyc(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add KYC Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Profile Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Checks</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycProfiles.map((kyc) => (
                      <TableRow key={kyc.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{kyc.customer.firstName} {kyc.customer.lastName}</div>
                            <div className="text-sm text-gray-500">{kyc.customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{kyc.profileType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            kyc.verificationStatus === 'APPROVED' ? 'default' :
                            kyc.verificationStatus === 'REJECTED' ? 'destructive' :
                            kyc.verificationStatus === 'REVIEW_REQUIRED' ? 'secondary' : 'outline'
                          }>
                            {kyc.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {kyc.riskScore ? (
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                kyc.riskScore > 0.7 ? 'bg-red-500' :
                                kyc.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className="text-sm">{(kyc.riskScore * 100).toFixed(0)}%</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{kyc.documents?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{kyc.checks?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(kyc.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {kyc.verificationStatus === 'REVIEW_REQUIRED' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateKycStatus(kyc.id, 'APPROVED', 'Manual approval')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => updateKycStatus(kyc.id, 'REJECTED', 'Manual rejection')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>Manage customer accounts and risk levels</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddCustomer(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>KYC Profiles</TableHead>
                      <TableHead>Accounts</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.customerId}</TableCell>
                        <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            customer.riskLevel === 'LOW' ? 'default' :
                            customer.riskLevel === 'MEDIUM' ? 'secondary' :
                            customer.riskLevel === 'HIGH' ? 'destructive' : 'destructive'
                          }>
                            {customer.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            customer.status === 'ACTIVE' ? 'default' :
                            customer.status === 'SUSPENDED' ? 'secondary' :
                            customer.status === 'CLOSED' ? 'destructive' : 'outline'
                          }>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer._count?.kycProfiles || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer._count?.accounts || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer._count?.transactions || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add SDK Modal */}
      {showAddSdk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New SDK Version</CardTitle>
              <CardDescription>Enter the details for the new SDK version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={newSdk.version}
                  onChange={(e) => setNewSdk({...newSdk, version: e.target.value})}
                  placeholder="2.1.0"
                />
              </div>
              
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select onValueChange={(value) => setNewSdk({...newSdk, platform: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="android">Android</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={newSdk.filename}
                  onChange={(e) => setNewSdk({...newSdk, filename: e.target.value})}
                  placeholder="paam-fintech-sdk-android-2.1.0.aar"
                />
              </div>

              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={newSdk.size}
                  onChange={(e) => setNewSdk({...newSdk, size: e.target.value})}
                  placeholder="2.4 MB"
                />
              </div>

              <div>
                <Label htmlFor="checksum">Checksum</Label>
                <Input
                  id="checksum"
                  value={newSdk.checksum}
                  onChange={(e) => setNewSdk({...newSdk, checksum: e.target.value})}
                  placeholder="sha256:..."
                />
              </div>

              <div>
                <Label htmlFor="downloadUrl">Download URL</Label>
                <Input
                  id="downloadUrl"
                  value={newSdk.downloadUrl}
                  onChange={(e) => setNewSdk({...newSdk, downloadUrl: e.target.value})}
                  placeholder="https://cdn.paam.com/sdk/..."
                />
              </div>

              <div>
                <Label htmlFor="changelog">Changelog</Label>
                <Textarea
                  id="changelog"
                  value={newSdk.changelog}
                  onChange={(e) => setNewSdk({...newSdk, changelog: e.target.value})}
                  placeholder="What's new in this version?"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleAddSdk} className="flex-1">
                  Add SDK Version
                </Button>
                <Button variant="outline" onClick={() => setShowAddSdk(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <CardDescription>Enter the details for the new customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={newCustomer.customerId}
                  onChange={(e) => setNewCustomer({...newCustomer, customerId: e.target.value})}
                  placeholder="CUST-001"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="customer@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="+1-555-0123"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newCustomer.dateOfBirth}
                  onChange={(e) => setNewCustomer({...newCustomer, dateOfBirth: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={newCustomer.nationality}
                    onChange={(e) => setNewCustomer({...newCustomer, nationality: e.target.value})}
                    placeholder="US"
                  />
                </div>
                <div>
                  <Label htmlFor="countryOfResidence">Country of Residence</Label>
                  <Input
                    id="countryOfResidence"
                    value={newCustomer.countryOfResidence}
                    onChange={(e) => setNewCustomer({...newCustomer, countryOfResidence: e.target.value})}
                    placeholder="US"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select onValueChange={(value) => setNewCustomer({...newCustomer, riskLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleAddCustomer} className="flex-1">
                  Add Customer
                </Button>
                <Button variant="outline" onClick={() => setShowAddCustomer(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add KYC Modal */}
      {showAddKyc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add KYC Profile</CardTitle>
              <CardDescription>Initiate KYC verification for a customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={newKyc.customerId}
                  onChange={(e) => setNewKyc({...newKyc, customerId: e.target.value})}
                  placeholder="CUST-001"
                />
              </div>
              
              <div>
                <Label htmlFor="profileType">Profile Type</Label>
                <Select onValueChange={(value) => setNewKyc({...newKyc, profileType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profile type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="TRUST">Trust</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Documents</Label>
                <div className="space-y-2">
                  {newKyc.documents.map((doc, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Select onValueChange={(value) => {
                        const docs = [...newKyc.documents]
                        docs[index].type = value
                        setNewKyc({...newKyc, documents: docs})
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PASSPORT">Passport</SelectItem>
                          <SelectItem value="DRIVERS_LICENSE">Driver's License</SelectItem>
                          <SelectItem value="NATIONAL_ID">National ID</SelectItem>
                          <SelectItem value="UTILITY_BILL">Utility Bill</SelectItem>
                          <SelectItem value="BANK_STATEMENT">Bank Statement</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Document number"
                        value={doc.documentNumber}
                        onChange={(e) => {
                          const docs = [...newKyc.documents]
                          docs[index].documentNumber = e.target.value
                          setNewKyc({...newKyc, documents: docs})
                        }}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewKyc({
                      ...newKyc, 
                      documents: [...newKyc.documents, { type: 'PASSPORT', documentNumber: '' }]
                    })}
                  >
                    Add Document
                  </Button>
                </div>
              </div>

              <div>
                <Label>Checks</Label>
                <div className="space-y-2">
                  {['SANCTIONS', 'PEP', 'WATCHLIST', 'ID_VERIFICATION', 'AGE_VERIFICATION', 'ADDRESS_VERIFICATION'].map((check) => (
                    <div key={check} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={check}
                        checked={newKyc.checks.includes(check)}
                        onChange={(e) => {
                          const checks = e.target.checked 
                            ? [...newKyc.checks, check]
                            : newKyc.checks.filter(c => c !== check)
                          setNewKyc({...newKyc, checks})
                        }}
                      />
                      <Label htmlFor={check} className="text-sm">
                        {check.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleAddKyc} className="flex-1">
                  Start KYC Verification
                </Button>
                <Button variant="outline" onClick={() => setShowAddKyc(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}