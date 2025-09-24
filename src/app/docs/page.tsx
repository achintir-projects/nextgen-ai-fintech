"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Copy, Download, Code, CheckCircle, Clock, AlertCircle, BookOpen } from "lucide-react"

export default function Documentation() {
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const quickStart = [
    {
      platform: "Android",
      language: "Kotlin",
      gradle: `// build.gradle (Project level)
buildscript {
    repositories {
        google()
        mavenCentral()
    }
}

// build.gradle (App level)
dependencies {
    implementation 'com.paam:fintech-sdk:2.1.0'
}`,
      manifest: `<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />`,
      initialization: `// Application.kt
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        PAAMSDK.initialize(
            context = this,
            apiKey = "your-api-key",
            environment = Environment.SANDBOX
        )
    }
}`,
      usage: `// MainActivity.kt
class MainActivity : AppCompatActivity() {
    private lateinit var paamSDK: PAAMSDK
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        paamSDK = PAAMSDK.getInstance()
        
        // Start KYC verification
        btnKyc.setOnClickListener {
            paamSDK.startKYCVerification(
                userId = "user123",
                callback = object : KYCCallback {
                    override fun onSuccess(result: KYCResult) {
                        // Handle success
                    }
                    
                    override fun onError(error: PAAMError) {
                        // Handle error
                    }
                }
            )
        }
    }
}`
    },
    {
      platform: "iOS",
      language: "Swift",
      podfile: `# Podfile
platform :ios, '13.0'
use_frameworks!

target 'YourApp' do
  pod 'PAAMFinTechSDK', '~> 2.1.0'
end`,
      info: `<!-- Info.plist -->
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera for KYC verification</string>
<key>NSFaceIDUsageDescription</key>
<string>This app needs Face ID for secure authentication</string>`,
      initialization: `// AppDelegate.swift
import PAAMFinTechSDK

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    PAAMSDK.initialize(
        apiKey: "your-api-key",
        environment: .sandbox
    )
    return true
}`,
      usage: `// ViewController.swift
import PAAMFinTechSDK

class ViewController: UIViewController {
    private let paamSDK = PAAMSDK.shared
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Start KYC verification
        kycButton.addTarget(self, action: #selector(startKYC), for: .touchUpInside)
    }
    
    @objc private func startKYC() {
        paamSDK.startKYCVerification(
            userId: "user123"
        ) { [weak self] result in
            switch result {
            case .success(let kycResult):
                // Handle success
                break
            case .failure(let error):
                // Handle error
                break
            }
        }
    }
}`
    }
  ]

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v2/kyc/verify",
      description: "Start KYC verification process",
      parameters: [
        { name: "userId", type: "string", required: true, description: "Unique user identifier" },
        { name: "documentType", type: "string", required: true, description: "Type of document (passport, id_card, etc.)" },
        { name: "callbackUrl", type: "string", required: false, description: "Webhook URL for results" }
      ],
      response: `{
  "success": true,
  "data": {
    "verificationId": "ver_123456",
    "status": "pending",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}`
    },
    {
      method: "GET",
      endpoint: "/api/v2/kyc/status/{verificationId}",
      description: "Check KYC verification status",
      parameters: [
        { name: "verificationId", type: "string", required: true, description: "Verification ID from initial request" }
      ],
      response: `{
  "success": true,
  "data": {
    "verificationId": "ver_123456",
    "status": "completed",
    "result": {
      "approved": true,
      "riskScore": 0.15,
      "checks": [
        {
          "type": "document_verification",
          "status": "passed"
        },
        {
          "type": "facial_recognition",
          "status": "passed"
        }
      ]
    }
  }
}`
    },
    {
      method: "POST",
      endpoint: "/api/v2/payments/process",
      description: "Process payment transaction",
      parameters: [
        { name: "amount", type: "number", required: true, description: "Transaction amount" },
        { name: "currency", type: "string", required: true, description: "3-letter currency code" },
        { name: "paymentMethod", type: "string", required: true, description: "Payment method type" },
        { name: "customerId", type: "string", required: true, description: "Customer identifier" }
      ],
      response: `{
  "success": true,
  "data": {
    "transactionId": "txn_789012",
    "status": "success",
    "amount": 100.00,
    "currency": "USD",
    "processedAt": "2024-01-15T10:30:00Z"
  }
}`
    }
  ]

  const features = [
    {
      name: "KYC Verification",
      description: "Complete identity verification with document scanning and facial recognition",
      codeExamples: [
        {
          title: "Start KYC Flow",
          language: "Kotlin",
          code: `paamSDK.startKYCVerification(
    userId = "user123",
    documentType = DocumentType.PASSPORT,
    callback = object : KYCCallback {
        override fun onSuccess(result: KYCResult) {
            // Verification completed successfully
            Log.d("KYC", "Verification approved: \${result.isApproved}")
        }
        
        override fun onError(error: PAAMError) {
            // Handle verification error
            Log.e("KYC", "Error: \${error.message}")
        }
    }
)`
        },
        {
          title: "Check KYC Status",
          language: "Swift",
          code: `paamSDK.getKYCStatus(verificationId: "ver_123456") { result in
    switch result {
    case .success(let status):
        print("KYC Status: \\(status.rawValue)")
    case .failure(let error):
        print("Error: \\(error.localizedDescription)")
    }
}`
        }
      ]
    },
    {
      name: "Payment Processing",
      description: "Secure payment processing with multiple payment methods",
      codeExamples: [
        {
          title: "Process Payment",
          language: "Kotlin",
          code: `val paymentRequest = PaymentRequest(
    amount = 100.0,
    currency = "USD",
    paymentMethod = PaymentMethod.CREDIT_CARD,
    cardNumber = "4111111111111111",
    expiryDate = "12/25",
    cvv = "123"
)

paamSDK.processPayment(paymentRequest, object : PaymentCallback {
    override fun onSuccess(result: PaymentResult) {
        // Payment successful
        Log.d("Payment", "Transaction ID: \${result.transactionId}")
    }
    
    override fun onError(error: PAAMError) {
        // Payment failed
        Log.e("Payment", "Error: \${error.message}")
    }
})`
        },
        {
          title: "Apple Pay Integration",
          language: "Swift",
          code: `let paymentRequest = PKPaymentRequest()
paymentRequest.merchantIdentifier = "merchant.com.yourapp"
paymentRequest.supportedNetworks = [.visa, .masterCard, .amex]
paymentRequest.countryCode = "US"
paymentRequest.currencyCode = "USD"

paamSDK.processApplePay(paymentRequest) { result in
    switch result {
    case .success(let transaction):
        print("Payment successful: \\(transaction.transactionId)")
    case .failure(let error):
        print("Payment failed: \\(error.localizedDescription)")
    }
}`
        }
      ]
    },
    {
      name: "Biometric Authentication",
      description: "Secure biometric authentication with Face ID and fingerprint",
      codeExamples: [
        {
          title: "Biometric Auth",
          language: "Kotlin",
          code: `paamSDK.authenticateWithBiometrics(
    title = "Confirm Identity",
    subtitle = "Use your fingerprint to continue",
    callback = object : BiometricCallback {
        override fun onSuccess() {
            // Authentication successful
            navigateToSecureArea()
        }
        
        override fun onError(error: PAAMError) {
            // Authentication failed
            showError("Authentication failed")
        }
    }
)`
        },
        {
          title: "Face ID Authentication",
          language: "Swift",
          code: `paamSDK.authenticateWithFaceID(
    reason: "Authenticate to access secure features"
) { [weak self] result in
    switch result {
    case .success:
        self?.showSecureContent()
    case .failure(let error):
        self?.showError(error.localizedDescription)
    }
}`
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                PAAM SDK Documentation
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Complete guide to integrating PAAM FinTech SDK into your mobile applications
              </p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download SDK
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="mt-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Quick Start Guide
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Get PAAM SDK integrated in your app in under 5 minutes
                </p>
              </div>

              <Tabs defaultValue="android" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="ios">iOS</TabsTrigger>
                </TabsList>

                {quickStart.map((platform, index) => (
                  <TabsContent key={index} value={platform.platform.toLowerCase()} className="mt-6">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Code className="h-5 w-5" />
                            <span>1. Add Dependencies</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{platform.gradle || platform.podfile}</code>
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(platform.gradle || platform.podfile)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5" />
                            <span>2. Update Permissions</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{platform.manifest || platform.info}</code>
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(platform.manifest || platform.info)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>3. Initialize SDK</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{platform.initialization}</code>
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(platform.initialization)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <span>4. Use SDK Features</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{platform.usage}</code>
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(platform.usage)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  SDK Features
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive documentation for all PAAM SDK features
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {features.map((feature, index) => (
                  <AccordionItem key={index} value={feature.name}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-semibold">{feature.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-4">
                        {feature.codeExamples.map((example, idx) => (
                          <Card key={idx}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{example.title}</CardTitle>
                                <Badge variant="outline">{example.language}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                  <code>{example.code}</code>
                                </pre>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => copyToClipboard(example.code)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  API Reference
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete API documentation for PAAM SDK endpoints
                </p>
              </div>

              <div className="space-y-6">
                {apiEndpoints.map((endpoint, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Badge variant={endpoint.method === "POST" ? "default" : "secondary"}>
                          {endpoint.method}
                        </Badge>
                        <CardTitle className="font-mono text-lg">{endpoint.endpoint}</CardTitle>
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-left p-2">Required</th>
                                <th className="text-left p-2">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.parameters.map((param, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-2 font-mono">{param.name}</td>
                                  <td className="p-2">{param.type}</td>
                                  <td className="p-2">
                                    <Badge variant={param.required ? "destructive" : "secondary"}>
                                      {param.required ? "Yes" : "No"}
                                    </Badge>
                                  </td>
                                  <td className="p-2">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Response</h4>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <code>{endpoint.response}</code>
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(endpoint.response)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Example Projects
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete example projects to help you get started
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Android Example App</CardTitle>
                    <CardDescription>
                      Complete Android app demonstrating all PAAM SDK features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Features Included:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>KYC verification flow</li>
                        <li>Payment processing</li>
                        <li>Biometric authentication</li>
                        <li>Real-time compliance monitoring</li>
                      </ul>
                    </div>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Android Example
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>iOS Example App</CardTitle>
                    <CardDescription>
                      Complete iOS app demonstrating all PAAM SDK features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Features Included:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>KYC verification with Face ID</li>
                        <li>Apple Pay integration</li>
                        <li>Touch ID authentication</li>
                        <li>Real-time compliance monitoring</li>
                      </ul>
                    </div>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download iOS Example
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}