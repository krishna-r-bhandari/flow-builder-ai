
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Node, Edge } from '@xyflow/react';
import { NodeData } from '@/components/nodes/CustomNode';

// Define types for our node configurations
type NodeConfig = {
  model?: string;
  temperature?: number;
  toolName?: string;
  memoryType?: string;
  [key: string]: any;
};

// Define simulation results type
type SimulationResults = {
  executionTime: number;
  nodePerformance: Record<string, {
    processingTime: number;
    failureRate: number;
    throughput: number;
  }>;
  flowEfficiency: number;
  bottlenecks: string[];
};

type FlowContextType = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  nodeConfigs: Record<string, NodeConfig>;
  simulationResults: SimulationResults | null;
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  updateNodeConfig: (id: string, config: Partial<NodeConfig>) => void;
  runSimulation: () => void;
  setSimulationResults: React.Dispatch<React.SetStateAction<SimulationResults | null>>;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, NodeConfig>>({});
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  const updateNodeConfig = (id: string, config: Partial<NodeConfig>) => {
    setNodeConfigs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...config,
      },
    }));
  };

  // Run simulation function
  const runSimulation = () => {
    // In a real app, this would involve more complex simulation logic
    // For now, we'll generate mock performance data
    const mockResults: SimulationResults = {
      executionTime: Math.floor(Math.random() * 2000) + 500,
      nodePerformance: {},
      flowEfficiency: Math.random() * 100,
      bottlenecks: []
    };

    // Generate performance data for each node
    nodes.forEach(node => {
      // Generate random performance data based on node type
      let processingTime = 0;
      switch (node.type) {
        case 'llm':
          processingTime = Math.floor(Math.random() * 800) + 200;
          break;
        case 'tool':
          processingTime = Math.floor(Math.random() * 500) + 100;
          break;
        case 'memory':
          processingTime = Math.floor(Math.random() * 300) + 50;
          break;
        case 'output':
          processingTime = Math.floor(Math.random() * 100) + 20;
          break;
        default:
          processingTime = Math.floor(Math.random() * 300) + 100;
      }

      // Flag as bottleneck if processing time is high
      if (processingTime > 500) {
        mockResults.bottlenecks.push(node.id);
      }

      mockResults.nodePerformance[node.id] = {
        processingTime,
        failureRate: Math.random() * 0.1, // 0-10% failure rate
        throughput: Math.floor(60000 / processingTime) // Requests per minute based on processing time
      };
    });

    // Update nodes with analytics data
    setNodes(currentNodes => 
      currentNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          analytics: mockResults.nodePerformance[node.id]
        }
      }))
    );

    // Set simulation results
    setSimulationResults(mockResults);
  };

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        selectedNodeId,
        nodeConfigs,
        simulationResults,
        setNodes,
        setEdges,
        setSelectedNodeId,
        updateNodeConfig,
        runSimulation,
        setSimulationResults,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};
