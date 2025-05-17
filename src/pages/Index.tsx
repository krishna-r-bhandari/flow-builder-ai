import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Play, Save } from "lucide-react";
import { toast } from "sonner";

import { FlowProvider, useFlow } from "@/context/FlowContext";
import Sidebar from "@/components/Sidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import FlowCanvas from "@/components/FlowCanvas";
import { Button } from "@/components/ui/button";

// Top navbar component
const Navbar = () => {
  const { nodes, edges, runSimulation, nodeConfigs } = useFlow();

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
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            runSimulation();
            resolve({});
          }, 1000);
        }),
      {
        loading: "Running simulation...",
        success: "Simulation completed! Check the Analytics tab for results",
        error: "Error running simulation",
      }
    );
  };

  const handleSaveNodes = () => {
    console.log("nodes", nodeConfigs);
  };

  const disabledSave = Object?.keys(nodeConfigs).length > 0;

  return (
    <header className="h-12 bg-sidebar border-b border-border flex items-center justify-between px-4">
      <h1 className="font-semibold text-lg">Agent Builder Studio</h1>

      <div className="flex items-center space-x-2">
        <Button
          onClick={handleSaveNodes}
          className="text-xs"
          size="sm"
          disabled={!disabledSave}
        >
          {/* <Save className="w-4 h-4 mr-2" /> */}
          Save
        </Button>

        <Button
          onClick={handleRunSimulation}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Run Simulation
        </Button>
      </div>
    </header>
  );
};

// Main layout wrapper component
const AgentBuilderLayout = () => (
  <div className="min-h-screen max-h-screen h-screen flex flex-col">
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
