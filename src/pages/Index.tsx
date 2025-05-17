
import React, { useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Play } from 'lucide-react';

import { FlowProvider, useFlow } from '@/context/FlowContext';
import Sidebar from '@/components/Sidebar';
import PropertiesPanel from '@/components/PropertiesPanel';
import FlowCanvas from '@/components/FlowCanvas';
import { Button } from '@/components/ui/button';

// Top navbar component
const Navbar = () => {
  const { nodes, edges, nodeConfigs } = useFlow();
  
  const handleRunSimulation = useCallback(() => {
    console.log('Running simulation with:', {
      nodes,
      edges,
      nodeConfigs,
    });
  }, [nodes, edges, nodeConfigs]);
  
  return (
    <header className="h-12 bg-sidebar border-b border-border flex items-center justify-between px-4">
      <h1 className="font-semibold text-lg">Agent Builder Studio</h1>
      <Button 
        onClick={handleRunSimulation}
        className="bg-secondary hover:bg-accent text-white"
        size="sm"
      >
        <Play className="w-4 h-4 mr-2" />
        Run Simulation
      </Button>
    </header>
  );
};

// Main layout wrapper component
const AgentBuilderLayout = () => (
  <div className="h-screen flex flex-col">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <FlowCanvas />
      <PropertiesPanel />
    </div>
  </div>
);

// Main page component with providers
const Index = () => (
  <ReactFlowProvider>
    <FlowProvider>
      <AgentBuilderLayout />
    </FlowProvider>
  </ReactFlowProvider>
);

export default Index;
