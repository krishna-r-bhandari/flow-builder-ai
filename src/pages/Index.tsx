
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Play } from 'lucide-react';
import { toast } from "sonner";

import { FlowProvider, useFlow } from '@/context/FlowContext';
import Sidebar from '@/components/Sidebar';
import PropertiesPanel from '@/components/PropertiesPanel';
import FlowCanvas from '@/components/FlowCanvas';
import { Button } from '@/components/ui/button';

// Top navbar component
const Navbar = () => {
  const { nodes, edges, runSimulation } = useFlow();
  
  const handleRunSimulation = () => {
    if (nodes.length === 0) {
      toast.error("Please add nodes to your flow before running a simulation");
      return;
    }
    
    if (edges.length === 0) {
      toast.warning("Your flow has no connections between nodes");
    }
    
    toast.promise(
      // In a real app, this would be an async function
      () => new Promise((resolve) => {
        setTimeout(() => {
          runSimulation();
          resolve({});
        }, 1000);
      }),
      {
        loading: "Running simulation...",
        success: "Simulation completed! Check the Analytics tab for results",
        error: "Error running simulation"
      }
    );
  };
  
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
