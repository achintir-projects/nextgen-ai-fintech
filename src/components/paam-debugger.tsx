"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Play, 
  Square, 
  SkipForward, 
  SkipBack, 
  Pause, 
  Bug, 
  Settings, 
  Eye,
  Terminal,
  Variable,
  Layers,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  GitBranch,
  X
} from 'lucide-react'

interface Breakpoint {
  id: string
  line: number
  file: string
  condition?: string
  enabled: boolean
}

interface DebugVariable {
  name: string
  value: any
  type: string
  scope: 'local' | 'global' | 'closure'
}

interface DebugFrame {
  id: string
  function: string
  file: string
  line: number
  variables: DebugVariable[]
}

interface DebugSession {
  id: string
  isActive: boolean
  currentFrame?: DebugFrame
  frames: DebugFrame[]
  breakpoints: Breakpoint[]
  consoleOutput: string[]
  error?: string
  startTime?: Date
}

interface PAAMDebuggerProps {
  code: string
  spec: any
  onBreakpointChange?: (breakpoints: Breakpoint[]) => void
  onVariableInspect?: (variable: DebugVariable) => void
}

export default function PAAMDebugger({ code, spec, onBreakpointChange, onVariableInspect }: PAAMDebuggerProps) {
  const [session, setSession] = useState<DebugSession>({
    id: 'debug-1',
    isActive: false,
    frames: [],
    breakpoints: [],
    consoleOutput: []
  })
  
  const [selectedFrame, setSelectedFrame] = useState<string>('')
  const [debugExpression, setDebugExpression] = useState('')
  const [evaluationResult, setEvaluationResult] = useState<any>(null)
  const [isStepping, setIsStepping] = useState(false)

  const addBreakpoint = (line: number, file: string = 'main.tsx') => {
    const newBreakpoint: Breakpoint = {
      id: `bp-${Date.now()}`,
      line,
      file,
      enabled: true
    }
    const updatedBreakpoints = [...session.breakpoints, newBreakpoint]
    setSession(prev => ({ ...prev, breakpoints: updatedBreakpoints }))
    onBreakpointChange?.(updatedBreakpoints)
  }

  const removeBreakpoint = (breakpointId: string) => {
    const updatedBreakpoints = session.breakpoints.filter(bp => bp.id !== breakpointId)
    setSession(prev => ({ ...prev, breakpoints: updatedBreakpoints }))
    onBreakpointChange?.(updatedBreakpoints)
  }

  const toggleBreakpoint = (breakpointId: string) => {
    const updatedBreakpoints = session.breakpoints.map(bp => 
      bp.id === breakpointId ? { ...bp, enabled: !bp.enabled } : bp
    )
    setSession(prev => ({ ...prev, breakpoints: updatedBreakpoints }))
    onBreakpointChange?.(updatedBreakpoints)
  }

  const startDebugging = () => {
    setSession(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date(),
      consoleOutput: ['Starting PAAM compilation debug session...', 'Loading specification...'],
      frames: [
        {
          id: 'frame-1',
          function: 'compilePAAMSpec',
          file: 'compiler.ts',
          line: 45,
          variables: [
            { name: 'spec', value: spec, type: 'object', scope: 'local' },
            { name: 'options', value: { framework: 'nextjs', platform: 'web' }, type: 'object', scope: 'local' }
          ]
        },
        {
          id: 'frame-2',
          function: 'validateEntities',
          file: 'validator.ts',
          line: 23,
          variables: [
            { name: 'entities', value: spec.entities || [], type: 'array', scope: 'local' },
            { name: 'isValid', value: true, type: 'boolean', scope: 'local' }
          ]
        }
      ]
    }))
    setSelectedFrame('frame-1')
  }

  const stopDebugging = () => {
    setSession(prev => ({
      ...prev,
      isActive: false,
      currentFrame: undefined,
      frames: [],
      consoleOutput: [...prev.consoleOutput, 'Debug session ended.']
    }))
    setSelectedFrame('')
  }

  const stepOver = () => {
    if (!session.isActive) return
    
    setIsStepping(true)
    setTimeout(() => {
      setSession(prev => ({
        ...prev,
        consoleOutput: [...prev.consoleOutput, `Step over at line ${session.currentFrame?.line || 45}`]
      }))
      setIsStepping(false)
    }, 500)
  }

  const stepInto = () => {
    if (!session.isActive) return
    
    setIsStepping(true)
    setTimeout(() => {
      const newFrame: DebugFrame = {
        id: `frame-${Date.now()}`,
        function: 'processEntity',
        file: 'processor.ts',
        line: 67,
        variables: [
          { name: 'entity', value: { type: 'user', name: 'User Entity' }, type: 'object', scope: 'local' },
          { name: 'index', value: 0, type: 'number', scope: 'local' }
        ]
      }
      
      setSession(prev => ({
        ...prev,
        frames: [...prev.frames, newFrame],
        currentFrame: newFrame,
        consoleOutput: [...prev.consoleOutput, `Step into ${newFrame.function} at line ${newFrame.line}`]
      }))
      setSelectedFrame(newFrame.id)
      setIsStepping(false)
    }, 500)
  }

  const stepOut = () => {
    if (!session.isActive || session.frames.length <= 1) return
    
    setIsStepping(true)
    setTimeout(() => {
      const newFrames = session.frames.slice(0, -1)
      const newCurrentFrame = newFrames[newFrames.length - 1]
      
      setSession(prev => ({
        ...prev,
        frames: newFrames,
        currentFrame: newCurrentFrame,
        consoleOutput: [...prev.consoleOutput, `Step out to ${newCurrentFrame?.function}`]
      }))
      setSelectedFrame(newCurrentFrame?.id || '')
      setIsStepping(false)
    }, 500)
  }

  const evaluateExpression = () => {
    if (!debugExpression.trim()) return
    
    try {
      // Mock evaluation - in real implementation, this would evaluate in debug context
      const result = {
        expression: debugExpression,
        value: `Result of: ${debugExpression}`,
        type: 'string'
      }
      setEvaluationResult(result)
      setSession(prev => ({
        ...prev,
        consoleOutput: [...prev.consoleOutput, `> ${debugExpression}`, `= ${result.value}`]
      }))
    } catch (error) {
      setEvaluationResult({
        expression: debugExpression,
        value: `Error: ${error}`,
        type: 'error'
      })
      setSession(prev => ({
        ...prev,
        consoleOutput: [...prev.consoleOutput, `> ${debugExpression}`, `Error: ${error}`]
      }))
    }
  }

  const currentFrame = session.frames.find(f => f.id === selectedFrame) || session.currentFrame

  return (
    <div className="h-full bg-gray-950 text-gray-100 flex flex-col">
      {/* Debug Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          {session.isActive ? (
            <>
              <Button size="sm" variant="ghost" onClick={stopDebugging} className="text-red-400">
                <Square className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={stepOver} disabled={isStepping}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={stepInto} disabled={isStepping}>
                <Bug className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={stepOut} disabled={isStepping}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <div className="text-sm text-gray-400 ml-2">
                {currentFrame ? `${currentFrame.function}:${currentFrame.line}` : 'Debugging...'}
              </div>
            </>
          ) : (
            <Button size="sm" onClick={startDebugging}>
              <Play className="h-4 w-4 mr-2" />
              Start Debugging
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={session.isActive ? "default" : "secondary"}>
            {session.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {session.startTime && (
            <span className="text-xs text-gray-400">
              {Math.floor((Date.now() - session.startTime.getTime()) / 1000)}s
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Call Stack & Breakpoints */}
        <div className="w-64 border-r border-gray-800 flex flex-col">
          <Tabs defaultValue="callstack" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="callstack" className="text-xs">Call Stack</TabsTrigger>
              <TabsTrigger value="breakpoints" className="text-xs">Breakpoints</TabsTrigger>
            </TabsList>
            
            <TabsContent value="callstack" className="flex-1 m-0">
              <ScrollArea className="h-full p-3">
                <div className="space-y-2">
                  {session.frames.map((frame, index) => (
                    <div
                      key={frame.id}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        selectedFrame === frame.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedFrame(frame.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{frame.function}</span>
                        <Badge variant="outline" className="text-xs">
                          {index}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {frame.file}:{frame.line}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="breakpoints" className="flex-1 m-0">
              <ScrollArea className="h-full p-3">
                <div className="space-y-2">
                  {session.breakpoints.map((breakpoint) => (
                    <div key={breakpoint.id} className="p-2 bg-gray-800 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded cursor-pointer ${
                              breakpoint.enabled ? 'bg-red-500' : 'bg-gray-600'
                            }`}
                            onClick={() => toggleBreakpoint(breakpoint.id)}
                          />
                          <span className="text-sm">{breakpoint.file}:{breakpoint.line}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => removeBreakpoint(breakpoint.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {breakpoint.condition && (
                        <div className="text-xs text-gray-400 mt-1">
                          Condition: {breakpoint.condition}
                        </div>
                      )}
                    </div>
                  ))}
                  {session.breakpoints.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No breakpoints set
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Variables & Console */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="variables" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="variables" className="text-xs">
                <Variable className="h-3 w-3 mr-1" />
                Variables
              </TabsTrigger>
              <TabsTrigger value="console" className="text-xs">
                <Terminal className="h-3 w-3 mr-1" />
                Console
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="variables" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b border-gray-800">
                  <h3 className="text-sm font-semibold">Variables</h3>
                  <p className="text-xs text-gray-400">
                    {currentFrame ? currentFrame.function : 'No frame selected'}
                  </p>
                </div>
                
                <ScrollArea className="flex-1 p-3">
                  {currentFrame ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-blue-400 mb-2">Local Variables</h4>
                        <div className="space-y-2">
                          {currentFrame.variables
                            .filter(v => v.scope === 'local')
                            .map((variable) => (
                            <div key={variable.name} className="p-2 bg-gray-800 rounded">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{variable.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {variable.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {typeof variable.value === 'object' 
                                  ? JSON.stringify(variable.value, null, 2)
                                  : String(variable.value)
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-green-400 mb-2">Global Variables</h4>
                        <div className="space-y-2">
                          {currentFrame.variables
                            .filter(v => v.scope === 'global')
                            .map((variable) => (
                            <div key={variable.name} className="p-2 bg-gray-800 rounded">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{variable.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {variable.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {typeof variable.value === 'object' 
                                  ? JSON.stringify(variable.value, null, 2)
                                  : String(variable.value)
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-8">
                      Select a frame to inspect variables
                    </div>
                  )}
                </ScrollArea>
                
                {/* Expression Evaluator */}
                <div className="p-3 border-t border-gray-800">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Evaluate expression..."
                      value={debugExpression}
                      onChange={(e) => setDebugExpression(e.target.value)}
                      className="flex-1 h-8 text-xs"
                      onKeyPress={(e) => e.key === 'Enter' && evaluateExpression()}
                    />
                    <Button size="sm" onClick={evaluateExpression} className="h-8">
                      Evaluate
                    </Button>
                  </div>
                  {evaluationResult && (
                    <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                      <div className="text-gray-400">{evaluationResult.expression}</div>
                      <div className="text-green-400">{evaluationResult.value}</div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="console" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Console Output</h3>
                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                    Clear
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 p-3 font-mono text-xs">
                  <div className="space-y-1">
                    {session.consoleOutput.map((output, index) => (
                      <div key={index} className="text-gray-300">
                        {output}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Debug Info */}
        <div className="w-64 border-l border-gray-800 p-3 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Debug Session</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge variant={session.isActive ? "default" : "secondary"}>
                  {session.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {session.startTime && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span>{Math.floor((Date.now() - session.startTime.getTime()) / 1000)}s</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Frames:</span>
                <span>{session.frames.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Breakpoints:</span>
                <span>{session.breakpoints.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">PAAM Compilation</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Spec Validation:</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Entity Processing:</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Flow Generation:</span>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Code Output:</span>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                <Eye className="h-3 w-3 mr-2" />
                Inspect Spec
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                <Layers className="h-3 w-3 mr-2" />
                View Call Hierarchy
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                <Database className="h-3 w-3 mr-2" />
                Memory Usage
              </Button>
            </div>
          </div>

          {session.error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded">
              <h3 className="text-sm font-semibold text-red-400 mb-1">Error</h3>
              <p className="text-xs text-red-300">{session.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}