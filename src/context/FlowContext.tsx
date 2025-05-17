
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Node, Edge } from '@xyflow/react';

// Define types for our node configurations
type NodeConfig = {
  model?: string;
  temperature?: number;
  toolName?: string;
  memoryType?: string;
  [key: string]: any;
};

type FlowContextType = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  nodeConfigs: Record<string, NodeConfig>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  updateNodeConfig: (id: string, config: Partial<NodeConfig>) => void;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, NodeConfig>>({});

  const updateNodeConfig = (id: string, config: Partial<NodeConfig>) => {
    setNodeConfigs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...config,
      },
    }));
  };

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        selectedNodeId,
        nodeConfigs,
        setNodes,
        setEdges,
        setSelectedNodeId,
        updateNodeConfig,
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
