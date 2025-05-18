import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  addEdge,
  Panel,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play, Trash2 } from "lucide-react";

import CustomNode from "./nodes/CustomNode";
import { useFlow } from "@/context/FlowContext";
import { NodeData } from "./nodes/CustomNode";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

// Define node types with proper casting
const nodeTypes: NodeTypes = {
  trigger: CustomNode as any,
  llm: CustomNode as any,
  tool: CustomNode as any,
  memory: CustomNode as any,
  output: CustomNode as any,
  documentLoader: CustomNode as any,
  textSplitter: CustomNode as any,
  vectorstore: CustomNode as any,
  retriever: CustomNode as any,
  embedding: CustomNode as any,
};

const FlowCanvas = ({ setActiveTab }) => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
    nodeConfigs,
    updateNodeConfig,
  } = useFlow();

  const defaultNodes = [
    {
      id: "trigger-1747555988475",
      type: "trigger",
      position: {
        x: -402.4980368708827,
        y: -54.90803794447229,
      },
      data: {
        label: "Trigger Node",
      },
      measured: {
        width: 155,
        height: 58,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "llm-1747555998348",
      type: "llm",
      position: {
        x: -400.9144906286682,
        y: 86.58123718982954,
      },
      data: {
        label: "Llm Node",
      },
      measured: {
        width: 150,
        height: 58,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "output-1747556232561",
      type: "output",
      position: {
        x: -440.4777260481096,
        y: 226.01999513768885,
      },
      data: {
        label: "Output Node",
      },
      measured: {
        width: 150,
        height: 76,
      },
      selected: true,
      dragging: false,
    },
  ];

  const defaultEdges = [
    {
      source: "trigger-1747555988475",
      target: "llm-1747555998348",
      id: "edge-1747556113533",
      animated: true,
    },
    {
      source: "llm-1747555998348",
      target: "output-1747556232561",
      id: "edge-1747556235975",
      animated: true,
    },
  ];

  const location = useLocation();

  useEffect(() => {
    const isAgent123 = location.pathname === "/dashboard/agent/123";

    if (isAgent123) {
      if (defaultNodes.length) setNodes(defaultNodes);
      if (defaultEdges.length) setEdges(defaultEdges);
    }
  }, [location.pathname]);

  const isOutputAvailable = nodes?.some((item) => item?.type === "output");

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Handle node changes (selection, position, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // Handle creating new connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: `edge-${Date.now()}`,
            animated: true,
          },
          eds
        )
      );
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
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle dropping new nodes on the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");

      // Check if we have node data
      if (!nodeType || !reactFlowWrapper.current) {
        return;
      }

      // Get the position of the drop
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create a new node with proper typing
      const newNode: Node<NodeData> = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
        },
      };

      // Initialize default node config based on type
      const defaultConfigs = {
        trigger: { trigger: "manual" },
        llm: { model: "gpt-4", temperature: 0.7 },
        tool: { toolName: "web-search" },
        memory: { memoryType: "buffer", window: 10 },
        output: { format: "text" },
        documentLoader: { loaderType: "pdf", sourceUrl: "" },
        textSplitter: { chunkSize: 500, overlap: 50 },
        vectorstore: { type: "pinecone", indexName: "default" },
        retriever: { topK: 5 },
        embedding: { model: "openai-ada" },
      };

      // Update node configs
      updateNodeConfig(
        newNode.id,
        defaultConfigs[nodeType as keyof typeof defaultConfigs] || {}
      );

      // Add the new node with proper typing
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes, updateNodeConfig]
  );

  // Handle background click (deselect nodes)
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Handle node deletion
  const handleRemoveNode = useCallback(() => {
    if (!selectedNodeId) {
      toast.error("No node selected");
      return;
    }

    // Remove node
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));

    // Remove connected edges
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    );

    // Clear selection
    setSelectedNodeId(null);

    toast.success("Node removed");
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId]);

  // const hideMiniMap = Object?.keys(nodeConfigs).length > 0;
  // console.log("hideMiniMap", hideMiniMap);

  return (
    <div className="flex-1 h-full relative relative" ref={reactFlowWrapper}>
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
        <Background gap={16} color="#343434" />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          bgColor="#181818"
          nodeColor="#242424"
          maskColor="#242424"
          maskStrokeWidth={1}
        />
        <Panel position="top-right">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveNode}
            disabled={!selectedNodeId}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} />
            <span>Remove Node</span>
          </Button>
        </Panel>
      </ReactFlow>

      {isOutputAvailable && (
        <div className="absolute bottom-6 left-16">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            size="sm"
            onClick={() => setActiveTab("simulation")}
          >
            <Play fill="#ffffff" className="w-4 h-4 mr-2" /> Run Test
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlowCanvas;
