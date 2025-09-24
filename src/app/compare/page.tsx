"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  ArrowRight, 
  GitCompare, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  Smartphone,
  Shield,
  Zap,
  Database,
  Globe,
  Activity
} from "lucide-react"

interface SdkVersion {
  id: string
  version: string
  platform: string
  filename: string
  size: string
  releaseDate: string
  changelog: string[]
  features: {
    name: string
    supported: boolean
    description: string
  }[]
  compatibility: {
    minOsVersion: string
    supportedDevices: string[]
  }
  performance: {
    startupTime: string
    memoryUsage: string
    responseTime: string
  }
}

export default function ComparePage() {
  const [versions, setVersions] = useState<SdkVersion[]>([])
  const [selectedVersions, setSelectedVersions] = useState<[string | null, string | null]>([null, null])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVersions()
  }, [])

  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/sdk')
      const data = await response.json()
      
      if (data.success) {
        const formattedVersions = data.data.map((sdk: any) => ({
          id: sdk.id,
          version: sdk.version,
          platform: sdk.platform,
          filename: sdk.filename,
          size: sdk.size,
          releaseDate: new Date(sdk.releaseDate).toLocaleDateString(),
          changelog: typeof sdk.changelog === 'string' ? JSON.parse(sdk.changelog) : sdk.changelog || [],
          features: generateFeaturesForVersion(sdk.platform, sdk.version),
          compatibility: generateCompatibilityForVersion(sdk.platform),
          performance: generatePerformanceForVersion(sdk.platform, sdk.version)
        }))
        setVersions(formattedVersions)
      }
    } catch (error) {
      console.error('Error fetching versions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateFeaturesForVersion = (platform: string, version: string) => {
    const baseFeatures = [
      { name: "KYC Verification", supported: true, description: "Identity verification with document scanning" },
      { name: "Payment Processing", supported: true, description: "Secure payment transaction handling" },
      { name: "Biometric Authentication", supported: true, description: "Face ID and fingerprint authentication" },
      { name: "Offline Support", supported: true, description: "Core functionality without internet" },
      { name: "Real-time Sync", supported: version >= "2.0.0", description: "Real-time data synchronization" },
      { name: "Advanced Analytics", supported: version >= "2.1.0", description: "Detailed analytics and reporting" },
      { name: "Multi-currency", supported: version >= "2.1.0", description: "Support for 180+ currencies" },
      { name: "Webhook Support", supported: version >= "2.1.0", description: "Custom webhook integration" }
    ]

    return baseFeatures
  }

  const generateCompatibilityForVersion = (platform: string) => {
    return {
      minOsVersion: platform === 'android' ? 'Android 5.0+' : 'iOS 13.0+',
      supportedDevices: platform === 'android' 
        ? ['Phones', 'Tablets', 'Android TV', 'Wear OS']
        : ['iPhone', 'iPad', 'Apple Watch', 'Apple TV']
    }
  }

  const generatePerformanceForVersion = (platform: string, version: string) => {
    return {
      startupTime: version >= "2.1.0" ? '<500ms' : '<800ms',
      memoryUsage: version >= "2.1.0" ? '<10MB' : '<15MB',
      responseTime: version >= "2.1.0" ? '<200ms' : '<350ms'
    }
  }

  const selectedVersion1 = versions.find(v => v.id === selectedVersions[0])
  const selectedVersion2 = versions.find(v => v.id === selectedVersions[1])

  const compareVersions = () => {
    if (!selectedVersion1 || !selectedVersion2) return null

    return {
      basic: [
        { label: 'Version', v1: selectedVersion1.version, v2: selectedVersion2.version },
        { label: 'Platform', v1: selectedVersion1.platform, v2: selectedVersion2.platform },
        { label: 'File Size', v1: selectedVersion1.size, v2: selectedVersion2.size },
        { label: 'Release Date', v1: selectedVersion1.releaseDate, v2: selectedVersion2.releaseDate }
      ],
      features: selectedVersion1.features.map((feature, index) => {
        const feature2 = selectedVersion2.features[index]
        return {
          name: feature.name,
          v1: feature.supported,
          v2: feature2?.supported || false,
          description: feature.description
        }
      }),
      compatibility: [
        { label: 'Min OS Version', v1: selectedVersion1.compatibility.minOsVersion, v2: selectedVersion2.compatibility.minOsVersion },
        { label: 'Supported Devices', v1: selectedVersion1.compatibility.supportedDevices.join(', '), v2: selectedVersion2.compatibility.supportedDevices.join(', ') }
      ],
      performance: [
        { label: 'Startup Time', v1: selectedVersion1.performance.startupTime, v2: selectedVersion2.performance.startupTime },
        { label: 'Memory Usage', v1: selectedVersion1.performance.memoryUsage, v2: selectedVersion2.performance.memoryUsage },
        { label: 'Response Time', v1: selectedVersion1.performance.responseTime, v2: selectedVersion2.performance.responseTime }
      ]
    }
  }

  const comparison = compareVersions()

  const renderComparisonValue = (v1: any, v2: any, type: 'boolean' | 'string' = 'string') => {
    if (type === 'boolean') {
      return (
        <div className="flex space-x-4">
          <div className="flex items-center justify-center w-8 h-8">
            {v1 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
          </div>
          <div className="flex items-center justify-center w-8 h-8">
            {v2 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
          </div>
        </div>
      )
    } else {
      const isDifferent = v1 !== v2
      return (
        <div className="flex space-x-4">
          <div className={`flex-1 text-center p-2 rounded ${isDifferent ? 'bg-blue-50 font-medium' : ''}`}>
            {v1}
          </div>
          <div className={`flex-1 text-center p-2 rounded ${isDifferent ? 'bg-blue-50 font-medium' : ''}`}>
            {v2}
          </div>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading versions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <GitCompare className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SDK Version Comparison</h1>
              <p className="text-gray-600">Compare features, performance, and compatibility across SDK versions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Version Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Versions to Compare</CardTitle>
            <CardDescription>Choose two SDK versions to compare their features and specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">First Version</label>
                <Select onValueChange={(value) => setSelectedVersions([value, selectedVersions[1]])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        <div className="flex items-center space-x-2">
                          <span>{version.platform === 'android' ? '🤖' : '🍎'}</span>
                          <span>{version.version}</span>
                          <Badge variant="outline" className="text-xs">{version.platform}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Second Version</label>
                <Select onValueChange={(value) => setSelectedVersions([selectedVersions[0], value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        <div className="flex items-center space-x-2">
                          <span>{version.platform === 'android' ? '🤖' : '🍎'}</span>
                          <span>{version.version}</span>
                          <Badge variant="outline" className="text-xs">{version.platform}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparison && selectedVersion1 && selectedVersion2 && (
          <div className="space-y-8">
            {/* Version Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{selectedVersion1.platform === 'android' ? '🤖' : '🍎'}</span>
                      <span>{selectedVersion1.version}</span>
                    </CardTitle>
                    <Badge variant="outline">{selectedVersion1.platform}</Badge>
                  </div>
                  <CardDescription>Released {selectedVersion1.releaseDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Size:</span>
                    <span className="font-medium">{selectedVersion1.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Platform:</span>
                    <span className="font-medium">{selectedVersion1.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Features:</span>
                    <span className="font-medium">{selectedVersion1.features.filter(f => f.supported).length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{selectedVersion2.platform === 'android' ? '🤖' : '🍎'}</span>
                      <span>{selectedVersion2.version}</span>
                    </CardTitle>
                    <Badge variant="outline">{selectedVersion2.platform}</Badge>
                  </div>
                  <CardDescription>Released {selectedVersion2.releaseDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Size:</span>
                    <span className="font-medium">{selectedVersion2.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Platform:</span>
                    <span className="font-medium">{selectedVersion2.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Features:</span>
                    <span className="font-medium">{selectedVersion2.features.filter(f => f.supported).length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison */}
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
              </TabsList>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Comparison</CardTitle>
                    <CardDescription>Compare supported features between versions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Feature</TableHead>
                          <TableHead className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span>{selectedVersion1.version}</span>
                              <span>({selectedVersion1.platform})</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span>{selectedVersion2.version}</span>
                              <span>({selectedVersion2.platform})</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comparison.features.map((feature, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{feature.name}</p>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {renderComparisonValue(feature.v1, feature.v2, 'boolean')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compatibility">
                <Card>
                  <CardHeader>
                    <CardTitle>Compatibility Comparison</CardTitle>
                    <CardDescription>System requirements and device support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {comparison.compatibility.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-medium mb-2">{item.label}</h4>
                          {renderComparisonValue(item.v1, item.v2)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Comparison</CardTitle>
                    <CardDescription>Speed and resource usage metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {comparison.performance.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-medium mb-2">{item.label}</h4>
                          {renderComparisonValue(item.v1, item.v2)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="changelog">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{selectedVersion1.platform === 'android' ? '🤖' : '🍎'}</span>
                        <span>{selectedVersion1.version} Changelog</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedVersion1.changelog.map((change, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{selectedVersion2.platform === 'android' ? '🤖' : '🍎'}</span>
                        <span>{selectedVersion2.version} Changelog</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedVersion2.changelog.map((change, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!comparison && (
          <Card>
            <CardContent className="text-center py-12">
              <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Versions to Compare</h3>
              <p className="text-gray-600">Choose two SDK versions from the dropdown above to see a detailed comparison.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}