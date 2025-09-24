"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Download, Shield, Zap, Smartphone, Globe, Lock, BarChart3, Settings, GitCompare, MessageSquare } from "lucide-react"

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "KYC/AML Verification",
      description: "Advanced identity verification and anti-money laundering screening"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Payment Processing",
      description: "Seamless payment integration with multiple payment methods"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Compliance Monitoring",
      description: "Real-time compliance monitoring and reporting"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Biometric Authentication",
      description: "Secure biometric authentication with face ID and fingerprint"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Support",
      description: "Support for 180+ countries and multiple currencies"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Offline Support",
      description: "Core functionality available even without internet connection"
    }
  ]

  const platforms = [
    {
      name: "Android SDK",
      icon: "🤖",
      version: "v2.1.0",
      size: "2.4 MB",
      compatibility: "API 21+ (Android 5.0+)",
      language: "Kotlin",
      features: ["Biometric Auth", "Payment Processing", "KYC Verification", "Offline Mode"],
      downloadUrl: "#",
      documentation: "#"
    },
    {
      name: "iOS SDK",
      icon: "🍎",
      version: "v2.1.0",
      size: "1.8 MB",
      compatibility: "iOS 13.0+",
      language: "Swift",
      features: ["Face ID", "Apple Pay", "KYC Verification", "Touch ID"],
      downloadUrl: "#",
      documentation: "#"
    }
  ]

  const techSpecs = [
    {
      category: "Security",
      items: [
        "End-to-end encryption",
        "PCI DSS compliant",
        "SOC 2 Type II certified",
        "GDPR compliant"
      ]
    },
    {
      category: "Performance",
      items: [
        "<500ms average response time",
        "<10MB memory footprint",
        "99.9% uptime SLA",
        "Automatic retry mechanisms"
      ]
    },
    {
      category: "Integration",
      items: [
        "5-minute setup",
        "Comprehensive documentation",
        "Sample projects included",
        "24/7 technical support"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <img
                  src="/logo.svg"
                  alt="PAAM Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              PAAM FinTech
              <span className="text-blue-600 dark:text-blue-400"> Mobile SDK</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Enterprise-grade mobile SDK for financial applications. Integrate KYC/AML verification, 
              payment processing, and compliance monitoring in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Download className="mr-2 h-5 w-5" />
                Download SDK
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <a href="/docs">View Documentation</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern FinTech
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to build secure, compliant, and user-friendly financial applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform SDKs Section */}
      <div className="bg-white dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Native SDKs optimized for Android and iOS platforms
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platforms.map((platform, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{platform.icon}</span>
                      <div>
                        <CardTitle className="text-xl">{platform.name}</CardTitle>
                        <Badge variant="secondary">{platform.version}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Size:</span> {platform.size}
                    </div>
                    <div>
                      <span className="font-medium">Language:</span> {platform.language}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Compatibility:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {platform.compatibility}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {platform.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" asChild>
                      <a href={`/download/${platform.name.toLowerCase().replace(' sdk', '')}`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href="/docs">Documentation</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enterprise-grade performance and security standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techSpecs.map((spec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{spec.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {spec.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-blue-50 dark:bg-blue-900/20 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers building the future of financial technology with PAAM SDK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Download className="mr-2 h-5 w-5" />
              Download SDK Package
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
              <a href="/docs">Read Documentation</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Link */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-semibold">Admin Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Manage SDK versions, monitor downloads, and view analytics
                    </p>
                  </div>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <a href="/admin">Access Admin Panel</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <h3 className="font-semibold">Analytics Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Real-time insights, performance metrics, and user analytics
                    </p>
                  </div>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <a href="/analytics">View Analytics</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <h3 className="font-semibold">API Key Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Create, manage, and secure your API authentication keys
                    </p>
                  </div>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <a href="/auth">Manage API Keys</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <GitCompare className="h-6 w-6 text-orange-600" />
                  <div className="text-left">
                    <h3 className="font-semibold">Version Comparison</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Compare SDK versions, features, and performance metrics
                    </p>
                  </div>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <a href="/compare">Compare Versions</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="inline-block border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-semibold">PAAM Dialogue</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      AI-powered deployment assistant and development chat
                    </p>
                  </div>
                </div>
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="/chat">Start Chat</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}