
import React, { useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  NodeTypes,
  Connection, 
  Edge, 
  Node,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './nodes/CustomNode';
import { useFlow } from '@/context/FlowContext';

// Define node types
const nodeTypes: NodeTypes = {
  llm: CustomNode,
  tool: CustomNode,
  memory: CustomNode,
  output: CustomNode,
};

const FlowCanvas = () => {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    setSelectedNodeId,
    updateNodeConfig 
  } = useFlow();
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  
  // Handle node changes (selection, position, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  
  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  // Handle creating new connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => [...eds, { ...connection, animated: true }]);
    },
    [setEdges]
  );
  
  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );
  
  // Handle drag over for new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle dropping new nodes on the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      // Check if we have node data
      if (!nodeType || !reactFlowWrapper.current) {
        return;
      }
      
      // Get the position of the drop
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) as XYPosition;
      
      // Create a new node
      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
        },
      };
      
      // Initialize default node config based on type
      const defaultConfigs = {
        llm: { model: 'gpt-4', temperature: 0.7 },
        tool: { toolName: 'web-search' },
        memory: { memoryType: 'buffer', window: 10 },
        output: { format: 'text' },
      };
      
      // Update node configs
      updateNodeConfig(newNode.id, defaultConfigs[nodeType as keyof typeof defaultConfigs] || {});
      
      // Add the new node
      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes, updateNodeConfig]
  );
  
  // Handle background click (deselect nodes)
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Background gap={16} color="#334155" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
