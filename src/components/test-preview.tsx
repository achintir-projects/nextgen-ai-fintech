"use client"

import { useState } from "react"
import MultiPlatformPreview from "@/components/multi-platform-preview"
import { Button } from "@/components/ui/button"

export default function TestPreview() {
  const [isRunning, setIsRunning] = useState(false)
  
  const testCode = `
// Test code
console.log('Hello from preview!')
  `

  return (
    <div className="h-screen">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Preview Test</h1>
        <div className="mt-2">
          <Button 
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? "Stop" : "Start"} Preview
          </Button>
        </div>
      </div>
      <div className="h-[calc(100%-80px)]">
        <MultiPlatformPreview
          code={testCode}
          framework="nextjs"
          platform="web"
          isRunning={isRunning}
          onRun={() => setIsRunning(true)}
          onStop={() => setIsRunning(false)}
        />
      </div>
    </div>
  )
}