"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, CheckCircle, Clock, AlertCircle, ExternalLink, FileText, Code, Shield, BookOpen } from "lucide-react"

export default function DownloadPage() {
  const params = useParams()
  const router = useRouter()
  const [platform, setPlatform] = useState<string>("")
  const [downloadInfo, setDownloadInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloadStarted, setDownloadStarted] = useState(false)

  useEffect(() => {
    const platformParam = params.platform as string
    if (platformParam && ['android', 'ios'].includes(platformParam)) {
      setPlatform(platformParam)
      fetchDownloadInfo(platformParam)
    } else {
      router.push('/')
    }
  }, [params.platform, router])

  const fetchDownloadInfo = async (platform: string) => {
    try {
      const response = await fetch(`/api/download?platform=${platform}&version=2.1.0`)
      const data = await response.json()
      
      if (data.success) {
        setDownloadInfo(data.data)
      }
    } catch (error) {
      console.error('Error fetching download info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!downloadInfo) return

    try {
      setDownloadStarted(true)
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: platform,
          version: '2.1.0',
          developerInfo: {
            email: 'developer@example.com', // In real app, get from user session
            appName: 'FinTech App'
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // In a real implementation, this would redirect to the actual download
        // For now, we'll simulate the download
        window.open(data.data.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error('Error starting download:', error)
      setDownloadStarted(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading download information...</p>
        </div>
      </div>
    )
  }

  if (!downloadInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load download information. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const platformIcon = platform === 'android' ? '🤖' : '🍎'
  const platformName = platform === 'android' ? 'Android' : 'iOS'
  const platformColor = platform === 'android' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{platformIcon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Download {platformName} SDK
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Version {downloadInfo.version} • Released {downloadInfo.releaseDate}
                </p>
              </div>
            </div>
            <Badge className={platformColor}>
              {platformName}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Download Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download SDK</span>
                </CardTitle>
                <CardDescription>
                  Get the latest {platformName} SDK for your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{downloadInfo.filename}</span>
                    <Badge variant="outline">{downloadInfo.size}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>SHA256: {downloadInfo.checksum}</p>
                    <p>Minimum Requirements: {downloadInfo.minimumRequirements}</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleDownload}
                  disabled={downloadStarted}
                >
                  {downloadStarted ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download {platformName} SDK
                    </>
                  )}
                </Button>

                {downloadStarted && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your download is being prepared. You will be redirected to the download page shortly.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Installation Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Installation Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {downloadInfo.instructions?.steps?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dependencies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Dependencies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {downloadInfo.dependencies?.map((dep: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{dep}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={downloadInfo.documentation} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/docs" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Integration Guide
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Version Info */}
            <Card>
              <CardHeader>
                <CardTitle>Version Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Version:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{downloadInfo.version}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Released:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{downloadInfo.releaseDate}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Compatibility:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{downloadInfo.minimumRequirements}</p>
                </div>
              </CardContent>
            </Card>

            {/* Changelog */}
            <Card>
              <CardHeader>
                <CardTitle>What's New</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {downloadInfo.changelog?.map((change: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Having trouble with the SDK? Our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}