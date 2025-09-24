"use client"

import React, { useCallback, useState, useRef, useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  NodeTypes,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  CreditCard, 
  Shield, 
  GitBranch, 
  Database,
  Settings,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react'

interface PAAMEntity {
  id: string
  type: 'user' | 'transaction' | 'account' | 'compliance' | 'flow'
  name: string
  properties: Record<string, any>
  position: { x: number; y: number }
}

interface PAAMFlow {
  id: string
  source: string
  target: string
  type: 'data' | 'control' | 'compliance'
  label?: string
}

interface PAAMSpecDesignerProps {
  entities: PAAMEntity[]
  flows: PAAMFlow[]
  onEntitiesChange: (entities: PAAMEntity[]) => void
  onFlowsChange: (flows: PAAMFlow[]) => void
}

// Custom node component
const EntityNode = ({ data, type }: { data: any; type: string }) => {
  const getIcon = () => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />
      case 'transaction': return <GitBranch className="h-4 w-4" />
      case 'account': return <Database className="h-4 w-4" />
      case 'compliance': return <Shield className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getColor = () => {
    switch (type) {
      case 'user': return 'bg-blue-500'
      case 'transaction': return 'bg-green-500'
      case 'account': return 'bg-purple-500'
      case 'compliance': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="min-w-[160px] shadow-lg border-2">
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-1 rounded ${getColor()} text-white`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{data.label}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              {data.type}
            </Badge>
          </div>
        </div>
        {data.properties && Object.keys(data.properties).length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            {Object.keys(data.properties).length} properties
          </div>
        )}
      </div>
    </Card>
  )
}

const nodeTypes: NodeTypes = {
  user: EntityNode,
  transaction: EntityNode,
  account: EntityNode,
  compliance: EntityNode,
  default: EntityNode
}

export function PAAMSpecDesigner({ entities, flows, onEntitiesChange, onFlowsChange }: PAAMSpecDesignerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Convert entities to ReactFlow nodes
  useEffect(() => {
    const flowNodes: Node[] = entities.map(entity => ({
      id: entity.id,
      type: entity.type,
      position: entity.position,
      data: {
        label: entity.name,
        type: entity.type,
        properties: entity.properties
      }
    }))
    setNodes(flowNodes)
  }, [entities, setNodes])

  // Convert flows to ReactFlow edges
  useEffect(() => {
    const flowEdges: Edge[] = flows.map(flow => ({
      id: flow.id,
      source: flow.source,
      target: flow.target,
      label: flow.label,
      type: 'smoothstep',
      animated: flow.type === 'control',
      style: { 
        stroke: flow.type === 'compliance' ? '#ef4444' : flow.type === 'control' ? '#3b82f6' : '#6b7280',
        strokeWidth: 2 
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: flow.type === 'compliance' ? '#ef4444' : flow.type === 'control' ? '#3b82f6' : '#6b7280'
      }
    }))
    setEdges(flowEdges)
  }, [flows, setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newFlow: PAAMFlow = {
          id: `flow-${Date.now()}`,
          source: params.source,
          target: params.target,
          type: 'data'
        }
        onFlowsChange([...flows, newFlow])
      }
    },
    [flows, onFlowsChange]
  )

  const addEntity = (type: PAAMEntity['type']) => {
    const newEntity: PAAMEntity = {
      id: `${type}-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Entity`,
      properties: {},
      position: { x: Math.random() * 400, y: Math.random() * 300 }
    }
    onEntitiesChange([...entities, newEntity])
  }

  const deleteSelected = () => {
    if (selectedNode) {
      onEntitiesChange(entities.filter(e => e.id !== selectedNode))
      onFlowsChange(flows.filter(f => f.source !== selectedNode && f.target !== selectedNode))
      setSelectedNode(null)
    }
    if (selectedEdge) {
      onFlowsChange(flows.filter(f => f.id !== selectedEdge))
      setSelectedEdge(null)
    }
  }

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
    setSelectedEdge(null)
  }, [])

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id)
    setSelectedNode(null)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  return (
    <div className="h-full flex">
      {/* Left Panel - Entity Palette */}
      <div className="w-64 border-r border-gray-800 bg-gray-950 p-4">
        <h3 className="text-sm font-semibold mb-4">Entity Palette</h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-xs text-gray-400 mb-2">Core Entities</h4>
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full justify-start h-8 text-xs"
                onClick={() => addEntity('user')}
              >
                <User className="h-3 w-3 mr-2" />
                User Entity
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full justify-start h-8 text-xs"
                onClick={() => addEntity('transaction')}
              >
                <GitBranch className="h-3 w-3 mr-2" />
                Transaction
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full justify-start h-8 text-xs"
                onClick={() => addEntity('account')}
              >
                <Database className="h-3 w-3 mr-2" />
                Account
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 mb-2">Compliance</h4>
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full justify-start h-8 text-xs"
                onClick={() => addEntity('compliance')}
              >
                <Shield className="h-3 w-3 mr-2" />
                Compliance Rule
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 mb-2">Actions</h4>
            <div className="space-y-2">
              {(selectedNode || selectedEdge) && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="w-full justify-start h-8 text-xs"
                  onClick={deleteSelected}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete Selected
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="mt-6 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-xs font-semibold mb-2">Selected Entity</h4>
            <div className="text-xs text-gray-300">
              {entities.find(e => e.id === selectedNode)?.name}
            </div>
          </div>
        )}

        {selectedEdge && (
          <div className="mt-6 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-xs font-semibold mb-2">Selected Flow</h4>
            <div className="text-xs text-gray-300">
              {flows.find(f => f.id === selectedEdge)?.label || 'Unnamed Flow'}
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-gray-900"
        >
          <Controls className="bg-gray-800 border-gray-700" />
          <MiniMap 
            className="bg-gray-800" 
            nodeColor={(node) => {
              switch (node.type) {
                case 'user': return '#3b82f6'
                case 'transaction': return '#10b981'
                case 'account': return '#8b5cf6'
                case 'compliance': return '#ef4444'
                default: return '#6b7280'
              }
            }}
          />
          <Background color="#374151" gap={16} />
        </ReactFlow>
      </div>

      {/* Right Panel - Properties */}
      <div className="w-64 border-l border-gray-800 bg-gray-950 p-4">
        <h3 className="text-sm font-semibold mb-4">Properties</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs text-gray-400 mb-2">Specification Stats</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Entities:</span>
                <span>{entities.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Flows:</span>
                <span>{flows.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Compliance Rules:</span>
                <span>{entities.filter(e => e.type === 'compliance').length}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 mb-2">Validation</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Structure valid</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">3 warnings</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                <Edit3 className="h-3 w-3 mr-2" />
                Edit Properties
              </Button>
              <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                <Plus className="h-3 w-3 mr-2" />
                Add Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component for ReactFlow provider
export default function PAAMSpecDesignerWrapper(props: PAAMSpecDesignerProps) {
  return (
    <ReactFlowProvider>
      <PAAMSpecDesigner {...props} />
    </ReactFlowProvider>
  )
}