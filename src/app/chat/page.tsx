"use client"

import { useState, useEffect, useRef } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Virtuoso } from "react-virtuoso"
import { 
  Play, 
  Square, 
  RotateCcw, 
  FileText, 
  FolderOpen, 
  Settings, 
  Send,
  Bot,
  User,
  File,
  Link,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Copy,
  Download,
  Keyboard,
  Eye,
  X,
  Smartphone,
  Code,
  ExternalLink,
  PlayCircle
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'assistant'
  status: string
  outputs: Array<{
    type: 'file' | 'endpoint' | 'check' | 'link' | 'run' | 'app'
    content: string
    status?: 'pass' | 'warn' | 'fail'
    method?: string
    path?: string
    size?: string
    appData?: {
      name: string
      platform: 'android' | 'ios'
      version: string
      description: string
      previewUrl?: string
      downloadUrl?: string
      code?: string
    }
  }>
  run?: Array<{
    command: string
    copyable: boolean
    runnable?: boolean
  }>
  next?: Array<{
    label: string
    primary?: boolean
  }>
  timestamp: Date
  expanded?: boolean
}

interface Artifact {
  id: string
  name: string
  type: 'file' | 'endpoint' | 'check'
  status: 'pass' | 'warn' | 'fail'
  size?: string
  path?: string
  method?: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedTab, setSelectedTab] = useState("artifacts")
  const [summaryMode, setSummaryMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<{name: string, content: string, size: string} | null>(null)
  const [previewApp, setPreviewApp] = useState<{
    name: string
    platform: 'android' | 'ios'
    version: string
    description: string
    previewUrl?: string
    downloadUrl?: string
    code?: string
  } | null>(null)

  // Mock file content for demonstration
  const mockFileContent = `// PAAM FinTech SDK - Android Implementation
package com.paam.fintech.sdk

import android.content.Context
import android.util.Log
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat

/**
 * PAAM FinTech SDK main class
 * Provides KYC verification, payment processing, and biometric authentication
 */
class PAAMSDK private constructor() {
    
    companion object {
        private const val TAG = "PAAMSDK"
        private var instance: PAAMSDK? = null
        
        fun getInstance(): PAAMSDK {
            return instance ?: PAAMSDK().also { instance = it }
        }
        
        /**
         * Initialize the SDK with API key
         */
        fun initialize(context: Context, apiKey: String, environment: Environment) {
            Log.d(TAG, "Initializing PAAM SDK...")
            // Initialize SDK components
        }
    }
    
    /**
     * Start KYC verification process
     */
    fun startKYCVerification(userId: String, callback: KYCCallback) {
        Log.d(TAG, "Starting KYC verification for user: $userId")
        // Implement KYC flow
    }
    
    /**
     * Process payment transaction
     */
    fun processPayment(request: PaymentRequest, callback: PaymentCallback) {
        Log.d(TAG, "Processing payment: $request.amount $request.currency")
        // Implement payment processing
    }
}

// SDK Configuration
data class PAAMConfig(
    val apiKey: String,
    val environment: Environment,
    val enableLogging: Boolean = true
)

// Environment enum
enum class Environment {
    SANDBOX,
    PRODUCTION
}`

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus input with / key
      if (event.key === '/' && document.activeElement !== inputRef.current) {
        event.preventDefault()
        inputRef.current?.focus()
        return
      }

      // Command palette with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        // In a real app, this would open a command palette
        console.log("Command palette opened")
        return
      }

      // Send message with Enter (allow Shift+Enter for new line)
      if (event.key === 'Enter' && !event.shiftKey && document.activeElement === inputRef.current) {
        event.preventDefault()
        handleSend()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [inputValue, isRunning])

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        type: "user",
        status: "Deploy Android SDK v2.1.0 to production",
        outputs: [],
        run: [],
        next: [],
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: "2",
        type: "assistant",
        status: "🚀 Starting deployment process",
        outputs: [
          {
            type: "check",
            content: "SDK version validation",
            status: "pass"
          },
          {
            type: "file",
            content: "paam-fintech-sdk-android-2.1.0.aar",
            size: "2.4 MB"
          }
        ],
        run: [
          {
            command: "gradle build",
            copyable: true,
            runnable: true
          }
        ],
        next: [
          { label: "Continue", primary: true },
          { label: "View Details" }
        ],
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: "3",
        type: "assistant",
        status: "✅ Build completed successfully",
        outputs: [
          {
            type: "check",
            content: "Build verification",
            status: "pass"
          },
          {
            type: "file",
            content: "app-release.apk",
            size: "15.2 MB"
          },
          {
            type: "endpoint",
            content: "https://api.paam.com/v2/deploy",
            method: "POST"
          }
        ],
        run: [
          {
            command: "deploy to production",
            copyable: true,
            runnable: true
          }
        ],
        next: [
          { label: "Deploy Now", primary: true },
          { label: "Run Tests" }
        ],
        timestamp: new Date(Date.now() - 180000)
      }
    ]

    const mockArtifacts: Artifact[] = [
      {
        id: "1",
        name: "paam-fintech-sdk-android-2.1.0.aar",
        type: "file",
        status: "pass",
        size: "2.4 MB",
        timestamp: new Date()
      },
      {
        id: "2",
        name: "app-release.apk",
        type: "file",
        status: "pass",
        size: "15.2 MB",
        timestamp: new Date()
      },
      {
        id: "3",
        name: "Build verification",
        type: "check",
        status: "pass",
        timestamp: new Date()
      },
      {
        id: "4",
        name: "Security scan",
        type: "check",
        status: "warn",
        timestamp: new Date()
      }
    ]

    setMessages(mockMessages)
    setArtifacts(mockArtifacts)
  }, [])
  const handleSend = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      status: inputValue,
      outputs: [],
      run: [],
      next: [],
      timestamp: new Date()
    }

    setMessages([...messages, newUserMessage])
    setInputValue("")
    setIsRunning(true)

    // Check if the user wants to deploy/generate an app
    const isDeployCommand = inputValue.toLowerCase().includes('deploy') || 
                          inputValue.toLowerCase().includes('generate') ||
                          inputValue.toLowerCase().includes('create') ||
                          inputValue.startsWith('/deploy')

    setTimeout(() => {
      let aiResponse: Message

      if (isDeployCommand) {
        // Generate an actual app
        const generatedApp = {
          name: "PAAM FinTech Demo App",
          platform: inputValue.toLowerCase().includes('ios') ? 'ios' : 'android' as 'android' | 'ios',
          version: "1.0.0",
          description: "A demo FinTech application with PAAM SDK integration",
          previewUrl: "/preview/app-" + Date.now(),
          downloadUrl: "/download/app-" + Date.now(),
          code: generateAppCode(inputValue.toLowerCase().includes('ios') ? 'ios' : 'android')
        }

        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          status: "🚀 App Generated Successfully!",
          outputs: [
            {
              type: "check",
              content: "App generation completed",
              status: "pass"
            },
            {
              type: "app",
              content: generatedApp.name,
              appData: generatedApp
            }
          ],
          run: [
            {
              command: "preview app",
              copyable: true,
              runnable: true
            },
            {
              command: "download app",
              copyable: true,
              runnable: true
            }
          ],
          next: [
            { label: "Preview App", primary: true },
            { label: "Download App" }
          ],
          timestamp: new Date()
        }
      } else {
        // Regular response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          status: "🔄 Processing your request...",
          outputs: [
            {
              type: "check",
              content: "Request validation",
              status: "pass"
            }
          ],
          run: [
            {
              command: "analyze request",
              copyable: true
            }
          ],
          next: [
            { label: "Continue", primary: true }
          ],
          timestamp: new Date()
        }
      }

      setMessages(prev => [...prev, aiResponse])
      setIsRunning(false)
    }, 2000)
  }

  const handleRun = (command: string) => {
    // Special handling for "Expand History" command
    if (command === "Expand History") {
      setSummaryMode(false)
      // In a real app, this would restore the full message history
      return
    }

    // Handle app preview and download commands
    if (command === "preview app" || command === "download app") {
      // Find the most recent app in the messages
      const recentAppMessage = messages.slice().reverse().find(msg => 
        msg.type === "assistant" && msg.outputs.some(output => output.type === "app")
      )
      
      if (recentAppMessage) {
        const appOutput = recentAppMessage.outputs.find(output => output.type === "app")
        if (appOutput?.appData) {
          if (command === "preview app") {
            setPreviewApp(appOutput.appData)
          } else if (command === "download app") {
            // Simulate download
            const link = document.createElement('a')
            link.href = appOutput.appData.downloadUrl || '#'
            link.download = `${appOutput.appData.name}-${appOutput.appData.version}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      }
      return
    }

    setIsRunning(true)
    // Simulate command execution
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        status: `✅ Executed: ${command}`,
        outputs: [
          {
            type: "check",
            content: "Command completed",
            status: "pass"
          }
        ],
        run: [],
        next: [
          { label: "Continue", primary: true }
        ],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newMessage])
      setIsRunning(false)
    }, 1500)
  }

  // Generate mock app code based on platform
  const generateAppCode = (platform: 'android' | 'ios') => {
    if (platform === 'android') {
      return `// PAAM FinTech Demo App - Android
package com.paam.fintech.demo

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.paam.fintech.sdk.PAAMSDK

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize PAAM SDK
        PAAMSDK.initialize(this, "your-api-key", PAAMSDK.Environment.SANDBOX)
        
        // Start KYC verification
        PAAMSDK.getInstance().startKYCVerification("user-123") { result ->
            when (result) {
                is PAAMSDK.KYCResult.Success -> {
                    // KYC completed successfully
                    showSuccessMessage("KYC verified!")
                }
                is PAAMSDK.KYCResult.Error -> {
                    // Handle error
                    showErrorMessage(result.message)
                }
            }
        }
    }
    
    private fun showSuccessMessage(message: String) {
        // Implementation
    }
    
    private fun showErrorMessage(message: String) {
        // Implementation
    }
}`
    } else {
      return `// PAAM FinTech Demo App - iOS
import UIKit
import PAAMSDK

class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Initialize PAAM SDK
        PAAMSDK.initialize(apiKey: "your-api-key", environment: .sandbox)
        
        // Setup UI
        setupUI()
    }
    
    private func setupUI() {
        let kycButton = UIButton(type: .system)
        kycButton.setTitle("Start KYC Verification", for: .normal)
        kycButton.addTarget(self, action: #selector(startKYC), for: .touchUpInside)
        kycButton.frame = CGRect(x: 20, y: 100, width: view.frame.width - 40, height: 50)
        view.addSubview(kycButton)
        
        let paymentButton = UIButton(type: .system)
        paymentButton.setTitle("Make Payment", for: .normal)
        paymentButton.addTarget(self, action: #selector(makePayment), for: .touchUpInside)
        paymentButton.frame = CGRect(x: 20, y: 170, width: view.frame.width - 40, height: 50)
        view.addSubview(paymentButton)
    }
    
    @objc private func startKYC() {
        PAAMSDK.shared.startKYCVerification(userId: "user-123") { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self?.showAlert(title: "Success", message: "KYC verification completed!")
                case .failure(let error):
                    self?.showAlert(title: "Error", message: error.localizedDescription)
                }
            }
        }
    }
    
    @objc private func makePayment() {
        let paymentRequest = PaymentRequest(
            amount: 10.00,
            currency: "USD",
            description: "Demo payment"
        )
        
        PAAMSDK.shared.processPayment(request: paymentRequest) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self?.showAlert(title: "Success", message: "Payment processed successfully!")
                case .failure(let error):
                    self?.showAlert(title: "Error", message: error.localizedDescription)
                }
            }
        }
    }
    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}`
    }
  }

  const toggleMessageExpanded = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, expanded: !msg.expanded } : msg
    ))
  }

  const summarizeAbove = () => {
    if (messages.length <= 3) return // Don't summarize if too few messages
    
    const summaryMessage: Message = {
      id: "summary-" + Date.now(),
      type: "assistant",
      status: "📝 Conversation Summary",
      outputs: [
        {
          type: "check",
          content: "Summary generated",
          status: "pass"
        }
      ],
      run: [],
      next: [
        { label: "Expand History", primary: true }
      ],
      timestamp: new Date(),
      expanded: false
    }

    // Keep only the last 3 messages and add summary
    const recentMessages = messages.slice(-3)
    setMessages([summaryMessage, ...recentMessages])
    setSummaryMode(true)
  }

  const renderChip = (output: any, index: number) => {
    switch (output.type) {
      case "file":
        return (
          <div 
            key={index} 
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
            onClick={() => {
              // Open file diff modal
              setSelectedFile({
                name: output.content,
                content: mockFileContent,
                size: output.size || "Unknown"
              })
            }}
          >
            <File className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium">{output.content}</span>
            {output.size && <span className="text-xs text-gray-500">({output.size})</span>}
          </div>
        )
      case "app":
        return (
          <div 
            key={index} 
            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded-md cursor-pointer transition-colors"
            onClick={() => {
              if (output.appData) {
                setPreviewApp(output.appData)
              }
            }}
          >
            <Smartphone className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium">{output.content}</span>
            {output.appData && (
              <span className="text-xs text-purple-500">
                ({output.appData.platform} v{output.appData.version})
              </span>
            )}
          </div>
        )
      case "endpoint":
        return (
          <div 
            key={index} 
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(`curl -X ${output.method} ${output.content}`)
            }}
          >
            <span className="text-xs font-mono font-bold text-blue-700">{output.method}</span>
            <span className="text-xs font-mono text-blue-600">{output.content}</span>
            <Copy className="w-3 h-3 text-blue-500" />
          </div>
        )
      case "check":
        const statusIcon = output.status === "pass" ? <CheckCircle className="w-3 h-3" /> :
                         output.status === "warn" ? <AlertTriangle className="w-3 h-3" /> :
                         <XCircle className="w-3 h-3" />
        const statusColor = output.status === "pass" ? "text-green-600 bg-green-100 hover:bg-green-200" :
                          output.status === "warn" ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200" :
                          "text-red-600 bg-red-100 hover:bg-red-200"
        
        return (
          <div 
            key={index} 
            className={`inline-flex items-center gap-1 px-2 py-1 ${statusColor} rounded-md cursor-pointer transition-colors`}
          >
            {statusIcon}
            <span className="text-xs font-medium">{output.content}</span>
          </div>
        )
      case "link":
        return (
          <a 
            key={index} 
            href={output.content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
          >
            <Link className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium">{output.content}</span>
          </a>
        )
      default:
        return null
    }
  }

  const renderMessage = (message: Message) => {
    const isUser = message.type === "user"
    const visibleOutputs = message.expanded ? message.outputs : message.outputs.slice(0, 4)
    const hasMoreOutputs = message.outputs.length > 4 && !message.expanded

    return (
      <div key={message.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-600" : "bg-gray-600"
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        
        <div className={`max-w-2xl ${isUser ? "order-1" : ""}`}>
          <Card className={`${isUser ? "bg-blue-50 border-blue-200" : ""} shadow-sm hover:shadow-md transition-shadow`}>
            {/* Status Line */}
            <div className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${isUser ? "text-blue-900" : "text-gray-900"}`}>
                  {message.status}
                </p>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Output Chips */}
            {visibleOutputs.length > 0 && (
              <div className="px-3 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {visibleOutputs.map((output, index) => renderChip(output, index))}
                  {hasMoreOutputs && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMessageExpanded(message.id)}
                      className="h-6 px-2 text-xs hover:bg-gray-100"
                    >
                      +{message.outputs.length - 4} more ▾
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Run Commands */}
            {message.run && message.run.length > 0 && (
              <div className="px-3 pb-2">
                <div className="flex flex-wrap gap-2">
                  {message.run.map((cmd, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <code className="text-xs font-mono text-gray-700">{cmd.command}</code>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(cmd.command)}
                          className="h-5 w-5 p-0 hover:bg-gray-200"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {cmd.runnable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRun(cmd.command)}
                            className="h-5 w-5 p-0 hover:bg-green-200 text-green-600"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Actions */}
            {message.next && message.next.length > 0 && (
              <div className="px-3 pb-3 pt-1">
                <div className="flex gap-2">
                  {message.next.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.primary ? "default" : "outline"}
                      onClick={() => handleRun(action.label)}
                      className={action.primary ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="h-12 bg-white border-b flex items-center px-4 gap-2">
        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-700">
          <Play className="w-4 h-4 mr-1" />
          New Run
        </Button>
        <Button size="sm" variant="outline" disabled={!isRunning} className="hover:bg-red-50 hover:text-red-700 disabled:opacity-50">
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
        <Button size="sm" variant="outline" className="hover:bg-yellow-50 hover:text-yellow-700">
          <RotateCcw className="w-4 h-4 mr-1" />
          Retry
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <Button size="sm" variant="outline" className="hover:bg-gray-50 hover:text-gray-700">
          <FileText className="w-4 h-4 mr-1" />
          View Logs
        </Button>
        <Button size="sm" variant="outline" className="hover:bg-green-50 hover:text-green-700">
          <FolderOpen className="w-4 h-4 mr-1" />
          Artifacts
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {isRunning && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Running
            </div>
          )}
          <Button size="sm" variant="outline" className="hover:bg-gray-50 hover:text-gray-700">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Three-Pane Layout */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Apps/Runs/History */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-white border-r p-4">
            <h3 className="font-semibold text-sm mb-4">History</h3>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {message.type === "user" ? 
                        <User className="w-3 h-3" /> : 
                        <Bot className="w-3 h-3" />
                      }
                      <span className="truncate">{message.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Panel>

        <PanelResizeHandle withHandle />

        {/* Center Panel - Chat */}
        <Panel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
              {/* Chat Messages */}
            <div className="flex-1 p-4">
              {messages.length > 3 && !summaryMode && (
                <div className="mb-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={summarizeAbove}
                    className="text-xs"
                  >
                    📝 Summarize above ({messages.length - 3} messages)
                  </Button>
                </div>
              )}
              <Virtuoso
                data={messages}
                followOutput="smooth"
                itemContent={(index, message) => (
                  <div key={message.id} className="pb-4">
                    {renderMessage(message)}
                  </div>
                )}
                className="h-full"
                style={{ overflowY: 'auto' }}
              />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message... (Try /deploy, /build, /test, /rollback)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isRunning || !inputValue.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <div className="flex gap-1 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => setInputValue("/deploy Android SDK v2.1.0 to production")}
                  >
                    /deploy
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-green-100 hover:text-green-700"
                    onClick={() => setInputValue("/build current SDK version")}
                  >
                    /build
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-yellow-100 hover:text-yellow-700"
                    onClick={() => setInputValue("/test deployment pipeline")}
                  >
                    /test
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => setInputValue("/rollback to previous version")}
                  >
                    /rollback
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-purple-100 hover:text-purple-700"
                    onClick={() => setInputValue("/status check all systems")}
                  >
                    /status
                  </Badge>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                💡 <strong>Tip:</strong> Use slash commands for quick actions or type natural language requests
                <div className="mt-1">
                  <Keyboard className="w-3 h-3 inline mr-1" />
                  <strong>Shortcuts:</strong> Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">/</kbd> to focus, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">⌘K</kbd> for commands, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Shift+Enter</kbd> for new line
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle withHandle />

        {/* Right Panel - Artifacts & Checks */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-white border-l p-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                <TabsTrigger value="checks">Checks</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="artifacts" className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Files</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      All
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      Recent
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    {artifacts
                      .filter(a => a.type === "file")
                      .map((artifact) => (
                        <div key={artifact.id} className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium">{artifact.name}</p>
                                <p className="text-xs text-gray-500">
                                  {artifact.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {artifact.size && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                                  {artifact.size}
                                </span>
                              )}
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-blue-100">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="checks" className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Checks</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      All
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Pass
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Warn
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Fail
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    {artifacts
                      .filter(a => a.type === "check")
                      .map((artifact) => (
                        <div key={artifact.id} className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {artifact.status === "pass" && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {artifact.status === "warn" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                              {artifact.status === "fail" && <XCircle className="w-4 h-4 text-red-600" />}
                              <div>
                                <p className="text-sm">{artifact.name}</p>
                                <p className="text-xs text-gray-500">
                                  {artifact.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <Badge variant={artifact.status === "pass" ? "default" : artifact.status === "warn" ? "secondary" : "destructive"} className="text-xs">
                              {artifact.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="logs" className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Live Logs</h4>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    Clear
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-green-600">[14:32:15] INFO: Build started</div>
                    <div className="text-blue-600">[14:32:16] INFO: SDK validation passed</div>
                    <div className="text-yellow-600">[14:32:18] WARN: Security scan found 1 warning</div>
                    <div className="text-green-600">[14:32:20] INFO: Deployment completed successfully</div>
                    <div className="text-gray-500">[14:32:21] DEBUG: Cleaning up temporary files</div>
                    <div className="text-green-600">[14:32:22] INFO: Process completed</div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </Panel>
      </PanelGroup>

      {/* File Diff Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
                <Badge variant="outline" className="text-xs">{selectedFile.size}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(selectedFile.content)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <code>{selectedFile.content}</code>
                </pre>
              </ScrollArea>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  📄 {selectedFile.name} • {selectedFile.size} • Kotlin
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Preview Modal */}
      {previewApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">{previewApp.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {previewApp.platform} v{previewApp.version}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  if (previewApp.downloadUrl) {
                    const link = document.createElement('a')
                    link.href = previewApp.downloadUrl
                    link.download = `${previewApp.name}-${previewApp.version}.zip`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }
                }}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPreviewApp(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="preview" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">App Preview</TabsTrigger>
                  <TabsTrigger value="code">Source Code</TabsTrigger>
                  <TabsTrigger value="details">App Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4 p-4">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="mb-4">
                        {previewApp.platform === 'android' ? (
                          <div className="w-32 h-32 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">🤖</span>
                          </div>
                        ) : (
                          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">🍎</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{previewApp.name}</h4>
                      <p className="text-gray-600 mb-4">{previewApp.description}</p>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Run in Simulator
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4 p-4">
                  <ScrollArea className="h-full">
                    <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <code>{previewApp.code || "// App code will be displayed here"}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">App Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {previewApp.name}
                        </div>
                        <div>
                          <span className="font-medium">Platform:</span> {previewApp.platform}
                        </div>
                        <div>
                          <span className="font-medium">Version:</span> {previewApp.version}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> <Badge className="bg-green-100 text-green-800">Ready</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{previewApp.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">KYC Verification</Badge>
                        <Badge variant="outline">Payment Processing</Badge>
                        <Badge variant="outline">Biometric Auth</Badge>
                        <Badge variant="outline">Secure Storage</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Actions</h4>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download App
                        </Button>
                        <Button size="sm" variant="outline">
                          <Code className="w-4 h-4 mr-2" />
                          View Full Code
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  📱 {previewApp.name} • {previewApp.platform} • Ready to deploy
                </div>
                <Button variant="outline" size="sm" onClick={() => setPreviewApp(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}