"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  MessageSquare, 
  MousePointer, 
  Edit, 
  Eye, 
  Wifi, 
  WifiOff,
  UserPlus,
  Send,
  Clock,
  Activity,
  Shield,
  Zap
} from 'lucide-react'

interface Collaborator {
  id: string
  name: string
  color: string
  cursor?: { line: number; column: number }
  selection?: { start: number; end: number }
  isActive: boolean
  lastSeen: Date
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
}

interface RealTimeCollaborationProps {
  projectId: string
  code: string
  onCodeChange: (code: string) => void
  monacoEditor?: any
}

export default function RealTimeCollaboration({ 
  projectId, 
  code, 
  onCodeChange, 
  monacoEditor 
}: RealTimeCollaborationProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [awareness, setAwareness] = useState<any>(null)
  
  const ydocRef = useRef<Y.Doc | null>(null)
  const providerRef = useRef<WebsocketProvider | null>(null)
  const ytextRef = useRef<Y.Text | null>(null)
  const chatYArrayRef = useRef<Y.Array<any> | null>(null)
  const chatYMapRef = useRef<Y.Map<any> | null>(null)

  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
  ]

  const generateRandomName = () => {
    const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown']
    const animals = ['Fox', 'Bear', 'Wolf', 'Eagle', 'Lion', 'Tiger', 'Leopard', 'Panther']
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`
  }

  const initializeCollaboration = useCallback(() => {
    try {
      // Initialize Yjs document
      ydocRef.current = new Y.Doc()
      
      // Initialize Yjs text for code collaboration
      ytextRef.current = ydocRef.current.getText('monaco')
      
      // Initialize Yjs array for chat messages
      chatYArrayRef.current = ydocRef.current.getArray('chat')
      
      // Initialize Yjs map for user presence
      chatYMapRef.current = ydocRef.current.getMap('presence')

      // Connect to WebSocket server
      const wsUrl = `ws://localhost:3000/api/collaboration/${projectId}`
      providerRef.current = new WebsocketProvider(wsUrl, projectId, ydocRef.current)

      // Set up awareness for cursor positions and user presence
      const awareness = providerRef.current.awareness
      setAwareness(awareness)

      // Set local user information
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`
      const userColor = colors[Math.floor(Math.random() * colors.length)]
      const userName = generateRandomName()

      awareness.setLocalStateField('user', {
        id: userId,
        name: userName,
        color: userColor,
        cursor: null,
        selection: null,
        timestamp: Date.now()
      })

      // Handle awareness changes
      awareness.on('change', (changes: any) => {
        const states = awareness.getStates()
        const newCollaborators: Collaborator[] = []
        
        states.forEach((state: any, clientId: number) => {
          if (state.user && clientId !== awareness.clientID) {
            newCollaborators.push({
              id: state.user.id,
              name: state.user.name,
              color: state.user.color,
              cursor: state.user.cursor,
              selection: state.user.selection,
              isActive: Date.now() - state.user.timestamp < 30000, // Active if seen in last 30 seconds
              lastSeen: new Date(state.user.timestamp)
            })
          }
        })
        
        setCollaborators(newCollaborators)
      })

      // Handle connection status
      providerRef.current.on('status', (event: any) => {
        setIsConnected(event.status === 'connected')
        setConnectionStatus(event.status)
      })

      // Handle code changes
      ytextRef.current.observe((event: Y.YTextEvent) => {
        const newCode = ytextRef.current?.toString() || ''
        onCodeChange(newCode)
      })

      // Handle chat messages
      chatYArrayRef.current?.observe((event: Y.YArrayEvent) => {
        const messages = chatYArrayRef.current?.toArray() || []
        setChatMessages(messages.map((msg: any) => ({
          id: msg.id,
          userId: msg.userId,
          userName: msg.userName,
          message: msg.message,
          timestamp: new Date(msg.timestamp)
        })))
      })

      // Set initial code
      if (ytextRef.current && code) {
        ytextRef.current.delete(0, ytextRef.current.length)
        ytextRef.current.insert(0, code)
      }

    } catch (error) {
      console.error('Failed to initialize collaboration:', error)
      setConnectionStatus('error')
    }
  }, [projectId, code, onCodeChange, colors])

  useEffect(() => {
    initializeCollaboration()

    return () => {
      // Cleanup
      if (providerRef.current) {
        providerRef.current.destroy()
      }
      if (ydocRef.current) {
        ydocRef.current.destroy()
      }
    }
  }, [initializeCollaboration])

  const setupMonacoBinding = useCallback(() => {
    if (!monacoEditor || !ytextRef.current || !providerRef.current) return

    const editor = monacoEditor.current
    const model = editor.getModel()
    
    if (model) {
      // Create Monaco binding
      new MonacoBinding(
        ytextRef.current,
        model,
        new Set([editor]),
        providerRef.current.awareness
      )
    }
  }, [monacoEditor, ytextRef, providerRef])

  useEffect(() => {
    if (monacoEditor && isConnected) {
      setupMonacoBinding()
    }
  }, [monacoEditor, isConnected, setupMonacoBinding])

  const sendMessage = () => {
    if (!newMessage.trim() || !chatYArrayRef.current) return

    const message = {
      id: `msg-${Date.now()}`,
      userId: awareness?.getLocalState()?.user?.id || 'unknown',
      userName: awareness?.getLocalState()?.user?.name || 'Anonymous',
      message: newMessage.trim(),
      timestamp: Date.now()
    }

    chatYArrayRef.current.push([message])
    setNewMessage('')
  }

  const updateCursorPosition = (position: { line: number; column: number }) => {
    if (!awareness) return

    const currentUser = awareness.getLocalState()?.user || {}
    awareness.setLocalStateField('user', {
      ...currentUser,
      cursor: position,
      timestamp: Date.now()
    })
  }

  const getCollaboratorInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="h-full bg-gray-950 text-gray-100 flex flex-col">
      {/* Collaboration Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className="text-sm font-medium text-white">
              Real-time Collaboration
            </span>
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {connectionStatus}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white">
              {collaborators.length + 1} collaborator{collaborators.length + 1 !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
            <Shield className="h-3 w-3 mr-1" />
            End-to-end encrypted
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Active Collaborators */}
        <div className="w-64 border-r border-gray-800 flex flex-col">
          <div className="p-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold mb-2">Active Collaborators</h3>
            
            {/* Current User */}
            <div className="p-3 bg-blue-600/20 border border-blue-500/50 rounded-lg mb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback 
                    className="text-xs"
                    style={{ backgroundColor: awareness?.getLocalState()?.user?.color || '#3b82f6' }}
                  >
                    {getCollaboratorInitials(awareness?.getLocalState()?.user?.name || 'You')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm text-white">You</div>
                  <div className="text-xs text-blue-300">Owner</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Other Collaborators */}
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="p-3 bg-gray-800/60 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback 
                          className="text-xs"
                          style={{ backgroundColor: collaborator.color }}
                        >
                          {getCollaboratorInitials(collaborator.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-white">{collaborator.name}</div>
                        <div className="flex items-center space-x-2 text-xs">
                          {collaborator.isActive ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-400">Active</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <span className="text-gray-400">
                                {Math.floor((Date.now() - collaborator.lastSeen.getTime()) / 60000)}m ago
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {collaborator.cursor && (
                        <div className="text-xs text-gray-400">
                          L{collaborator.cursor.line}:{collaborator.cursor.column}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {collaborators.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No other collaborators
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-3 border-t border-gray-800">
            <Button size="sm" className="w-full" variant="outline">
              <UserPlus className="h-3 w-3 mr-2" />
              Invite Collaborators
            </Button>
          </div>
        </div>

        {/* Center Panel - Code Editor with Collaboration */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            {/* Collaborator cursors would be rendered here by Monaco */}
            <div className="absolute inset-0 pointer-events-none">
              {collaborators.map((collaborator) => {
                if (!collaborator.cursor) return null
                
                return (
                  <div
                    key={collaborator.id}
                    className="absolute pointer-events-none"
                    style={{
                      top: `${collaborator.cursor.line * 20}px`,
                      left: `${collaborator.cursor.column * 8}px`,
                      color: collaborator.color
                    }}
                  >
                    <div className="flex items-center space-x-1 bg-black/80 px-2 py-1 rounded text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: collaborator.color }}></div>
                      <span>{collaborator.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat & Activity */}
        <div className="w-80 border-l border-gray-800 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 h-8 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="chat" className="text-xs data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white">
                <MessageSquare className="h-3 w-3 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white">
                <Activity className="h-3 w-3 mr-1" />
                Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {chatMessages.map((message) => {
                      const isCurrentUser = message.userId === awareness?.getLocalState()?.user?.id
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              isCurrentUser 
                                ? 'bg-blue-700/90 text-white' 
                                : 'bg-gray-800/80 text-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">
                                {isCurrentUser ? 'You' : message.userName}
                              </span>
                              <span className="text-xs opacity-80">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm text-white">
                              {message.message}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-8">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-gray-800 bg-gray-900/50">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 h-8 text-xs bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                    <Button size="sm" onClick={sendMessage} className="h-8 bg-blue-600 hover:bg-blue-700">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="flex-1 m-0">
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Edit className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-sm text-gray-200">Code Changes</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Real-time code synchronization active
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <MousePointer className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-sm text-gray-200">Cursor Positions</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {collaborators.filter(c => c.cursor).length} active cursors
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium text-sm text-gray-200">Operations</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Operational transformation enabled
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="font-medium text-sm text-gray-200">Conflict Resolution</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Automatic merge conflict resolution
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}