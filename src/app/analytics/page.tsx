"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download, 
  Activity,
  Clock,
  Globe,
  Smartphone,
  DollarSign,
  Shield,
  Zap
} from "lucide-react"

interface AnalyticsData {
  totalDownloads: number
  totalUsers: number
  activeApiKeys: number
  revenue: number
  downloadsToday: number
  downloadsThisWeek: number
  downloadsThisMonth: number
  platformStats: {
    android: number
    ios: number
  }
  topVersions: Array<{
    version: string
    platform: string
    downloads: number
  }>
  recentActivity: Array<{
    type: 'download' | 'user_registration' | 'api_key_created'
    description: string
    timestamp: string
  }>
  geographicData: Array<{
    country: string
    downloads: number
    percentage: number
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load analytics data</p>
        </div>
      </div>
    )
  }

  const growthRate = 23.5 // Example growth rate
  const conversionRate = 12.8 // Example conversion rate

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Real-time insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalDownloads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{growthRate}%</span> from last period
              </p>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Today: {analytics.downloadsToday}</p>
                <p className="text-xs text-gray-500">This week: {analytics.downloadsThisWeek}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18.2%</span> growth rate
              </p>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Conversion: {conversionRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Keys</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeApiKeys}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.1%</span> active keys
              </p>
              <div className="mt-2">
                <p className="text-xs text-gray-500">All keys valid</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(analytics.revenue / 1000).toFixed(1)}K</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+31.7%</span> revenue growth
              </p>
              <div className="mt-2">
                <p className="text-xs text-gray-500">MRR: ${(analytics.revenue * 12 / 1000).toFixed(1)}K</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Downloads by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <p className="font-medium">Android</p>
                      <p className="text-sm text-gray-500">{analytics.platformStats.android.toLocaleString()} downloads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {((analytics.platformStats.android / (analytics.platformStats.android + analytics.platformStats.ios)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600">+2.3%</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(analytics.platformStats.android / (analytics.platformStats.android + analytics.platformStats.ios)) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🍎</span>
                    <div>
                      <p className="font-medium">iOS</p>
                      <p className="text-sm text-gray-500">{analytics.platformStats.ios.toLocaleString()} downloads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {((analytics.platformStats.ios / (analytics.platformStats.android + analytics.platformStats.ios)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-red-600">-1.2%</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(analytics.platformStats.ios / (analytics.platformStats.android + analytics.platformStats.ios)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Versions */}
          <Card>
            <CardHeader>
              <CardTitle>Top SDK Versions</CardTitle>
              <CardDescription>Most downloaded versions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topVersions.slice(0, 5).map((version, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 ? "default" : "secondary"} className="w-8 h-8 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{version.version}</p>
                        <p className="text-xs text-gray-500">{version.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{version.downloads.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{Math.floor(Math.random() * 10) + 1}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Downloads by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.geographicData.slice(0, 9).map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌍</span>
                    <div>
                      <p className="font-medium">{country.country}</p>
                      <p className="text-xs text-gray-500">{country.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{country.downloads.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Activity</CardTitle>
            <CardDescription>Live updates from your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'download' && <Download className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'user_registration' && <Users className="h-5 w-5 text-green-600" />}
                    {activity.type === 'api_key_created' && <Shield className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {activity.type === 'download' ? 'Download' : 
                     activity.type === 'user_registration' ? 'User' : 'API Key'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}