"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import MultiPlatformPreview from "@/components/multi-platform-preview"
import { 
  Play, 
  Square, 
  Code, 
  Eye, 
  Globe,
  Bug,
  BarChart3,
  Terminal
} from "lucide-react"

export default function SimpleWorkspace() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')

  const testCode = `
// Simple test code
console.log('Hello from simple workspace!')
  `

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 2000)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Simple Workspace {projectId}</h1>
          <Badge variant="secondary" className="text-xs">
            Next.js
          </Badge>
          <Badge variant="outline" className="text-xs">
            Web
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {isRunning ? (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleStop}
              className="text-red-400 hover:text-red-300"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleRun}
              className="text-green-400 hover:text-green-300"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Editor Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
            <div className="border-b border-gray-800 bg-gray-950">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger value="editor" className="data-[state=active]:bg-gray-800">
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800">
                  <Globe className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="debugger" className="data-[state=active]:bg-gray-800">
                  <Bug className="h-4 w-4 mr-2" />
                  Debugger
                </TabsTrigger>
                <TabsTrigger value="terminal" className="data-[state=active]:bg-gray-800">
                  <Terminal className="h-4 w-4 mr-2" />
                  Terminal
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="editor" className="h-full m-0">
                <div className="h-full flex">
                  <div className="flex-1 bg-gray-950">
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-950">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>main.tsx</span>
                          <span>TypeScript</span>
                          <span>React</span>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <pre className="text-green-400 text-sm">
                          {testCode}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full m-0">
                <MultiPlatformPreview
                  code={testCode}
                  framework="nextjs"
                  platform="web"
                  isRunning={isRunning}
                  onRun={handleRun}
                  onStop={handleStop}
                />
              </TabsContent>

              <TabsContent value="debugger" className="h-full m-0">
                <div className="h-full flex items-center justify-center">
                  <Card className="w-96">
                    <CardHeader>
                      <CardTitle>Debugger</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Debugger component would be loaded here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="terminal" className="h-full m-0">
                <div className="h-full bg-black p-4 font-mono text-sm text-green-400">
                  <div>$ npm start</div>
                  <div>Starting development server...</div>
                  <div>Server running on http://localhost:3000</div>
                  <div className="animate-pulse">_</div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}