// import React from "react";
// import { ReactFlowProvider } from "@xyflow/react";
// import { Play, Save } from "lucide-react";
// import { toast } from "sonner";

// import { FlowProvider, useFlow } from "@/context/FlowContext";
// import Sidebar from "@/components/Sidebar";
// import PropertiesPanel from "@/components/PropertiesPanel";
// import FlowCanvas from "@/components/FlowCanvas";
// import { Button } from "@/components/ui/button";

// // Top navbar component
// const Navbar = () => {
//   const { nodes, edges, runSimulation, nodeConfigs } = useFlow();

//   const handleRunSimulation = () => {
//     if (nodes.length === 0) {
//       toast.error("Please add nodes to your flow before running a simulation");
//       return;
//     }

//     if (edges.length === 0) {
//       toast.warning("Your flow has no connections between nodes");
//     }

//     toast.promise(
//       // In a real app, this would be an async function
//       () =>
//         new Promise((resolve) => {
//           setTimeout(() => {
//             runSimulation();
//             resolve({});
//           }, 1000);
//         }),
//       {
//         loading: "Running simulation...",
//         success: "Simulation completed! Check the Analytics tab for results",
//         error: "Error running simulation",
//       }
//     );
//   };

//   const handleSaveNodes = () => {
//     console.log("nodes", nodeConfigs);
//   };

//   const disabledSave = Object?.keys(nodeConfigs).length > 0;

//   return (
//     <header className="h-12 bg-sidebar border-b border-border flex items-center justify-between px-4">
//       <h1 className="font-semibold text-base">Agent Studio</h1>

//       <div className="flex items-center space-x-2">
//         <Button
//           onClick={handleSaveNodes}
//           className="text-xs"
//           size="sm"
//           disabled={!disabledSave}
//         >
//           {/* <Save className="w-4 h-4 mr-2" /> */}
//           Save
//         </Button>

//         <Button
//           onClick={handleRunSimulation}
//           className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
//           size="sm"
//         >
//           <Play className="w-4 h-4 mr-2" />
//           Run Simulation
//         </Button>
//       </div>
//     </header>
//   );
// };

// // Main layout wrapper component
// const AgentBuilderLayout = () => (
//   <div className="min-h-screen max-h-screen h-screen flex flex-col">
//     <Navbar />
//     <div className="flex flex-1 overflow-hidden">
//       <Sidebar />
//       <FlowCanvas />
//       <PropertiesPanel />
//     </div>
//   </div>
// );

// // Main page component with providers
// const Index = () => (
//   <ReactFlowProvider>
//     <FlowProvider>
//       <AgentBuilderLayout />
//     </FlowProvider>
//   </ReactFlowProvider>
// );

// export default Index;

// import React, { useState } from "react";
// import { ReactFlowProvider } from "@xyflow/react";
// import { Play, Save, MessageSquare, Workflow, ArrowRight } from "lucide-react";
// import { toast } from "sonner";

// import { FlowProvider, useFlow } from "@/context/FlowContext";
// import Sidebar from "@/components/Sidebar";
// import PropertiesPanel from "@/components/PropertiesPanel";
// import FlowCanvas from "@/components/FlowCanvas";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // Simulation environment component
// const SimulationEnvironment = () => {
//   const { nodes, edges, nodeConfigs } = useFlow();
//   const [messages, setMessages] = useState([
//     {
//       role: "system",
//       content:
//         "You are now chatting with a simulated agent. This is a test environment.",
//     },
//     {
//       role: "assistant",
//       content: "Hello! I'm your simulated agent. How can I help you today?",
//     },
//   ]);
//   const [userInput, setUserInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendMessage = () => {
//     if (!userInput.trim()) return;

//     // Add user message
//     const updatedMessages = [...messages, { role: "user", content: userInput }];
//     setMessages(updatedMessages);
//     setIsLoading(true);

//     // Simulate agent response (would connect to actual agent logic in production)
//     setTimeout(() => {
//       const simulatedResponse = generateSimulatedResponse(
//         userInput,
//         nodeConfigs
//       );
//       setMessages([
//         ...updatedMessages,
//         { role: "assistant", content: simulatedResponse },
//       ]);
//       setIsLoading(false);
//     }, 1000);

//     setUserInput("");
//   };

//   // Generate a simulated response based on user input and agent configuration
//   const generateSimulatedResponse = (input, config) => {
//     // In a real implementation, this would process the input through the agent flow
//     // For now, we'll return a simple response that references the node configuration

//     const nodeCount = Object.keys(config).length;
//     if (nodeCount === 0) {
//       return "No agent configuration detected. Try building an agent flow first!";
//     }

//     const responses = [
//       `I processed your message "${input}" through ${nodeCount} configured nodes.`,
//       `Based on your input, I would typically route this through our knowledge base and response formulation nodes.`,
//       `I've analyzed your request and determined the appropriate action based on my configuration.`,
//       `According to my current setup, I would classify this input and generate a response using my defined parameters.`,
//     ];

//     return responses[Math.floor(Math.random() * responses.length)];
//   };

//   return (
//     <div className="flex-1 flex flex-col h-full border-l border-border">
//       <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//         <div className="max-w-3xl mx-auto space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`p-3 rounded-lg ${
//                 message.role === "user"
//                   ? "bg-blue-100 ml-12"
//                   : message.role === "assistant"
//                   ? "bg-white border border-gray-200 mr-12 shadow-sm"
//                   : "bg-gray-100 text-gray-500 text-sm italic"
//               }`}
//             >
//               {message.content}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="bg-white border border-gray-200 mr-12 p-3 rounded-lg shadow-sm">
//               <div className="flex space-x-1 items-center">
//                 <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
//                 <div
//                   className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
//                   style={{ animationDelay: "0.4s" }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="p-4 border-t border-border bg-white">
//         <div className="max-w-3xl mx-auto flex">
//           <input
//             type="text"
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             placeholder="Type a message to test your agent..."
//             className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Button
//             onClick={handleSendMessage}
//             className="bg-blue-600 hover:bg-blue-700 rounded-l-none"
//           >
//             <ArrowRight className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Analytics Panel Component
// const AnalyticsPanel = () => {
//   return (
//     <div className="flex-1 flex flex-col h-full border-l border-border">
//       <div className="p-4">
//         <h2 className="text-lg font-medium mb-4">Simulation Analytics</h2>

//         <div className="space-y-4">
//           <div className="border rounded-md p-4">
//             <h3 className="text-sm font-medium mb-2">Conversation Summary</h3>
//             <div className="text-sm text-gray-500">
//               <p>Run the simulation to see analytics here</p>
//             </div>
//           </div>

//           <div className="border rounded-md p-4">
//             <h3 className="text-sm font-medium mb-2">Node Performance</h3>
//             <div className="text-sm text-gray-500">
//               <p>No data available yet</p>
//             </div>
//           </div>

//           <div className="border rounded-md p-4">
//             <h3 className="text-sm font-medium mb-2">Response Times</h3>
//             <div className="text-sm text-gray-500">
//               <p>No data available yet</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Top navbar component with tabs
// const Navbar = () => {
//   const { nodes, edges, runSimulation, nodeConfigs } = useFlow();

//   const handleRunSimulation = () => {
//     if (nodes.length === 0) {
//       toast.error("Please add nodes to your flow before running a simulation");
//       return;
//     }

//     if (edges.length === 0) {
//       toast.warning("Your flow has no connections between nodes");
//     }

//     toast.promise(
//       // In a real app, this would be an async function
//       () =>
//         new Promise((resolve) => {
//           setTimeout(() => {
//             runSimulation();
//             resolve({});
//           }, 1000);
//         }),
//       {
//         loading: "Running simulation...",
//         success: "Simulation completed! Check the Analytics tab for results",
//         error: "Error running simulation",
//       }
//     );
//   };

//   const handleSaveNodes = () => {
//     console.log("nodes", nodeConfigs);
//     toast.success("Configuration saved successfully");
//   };

//   const disabledSave = Object.keys(nodeConfigs).length === 0;

//   return (
//     <header className="h-12 bg-sidebar border-b border-border flex items-center justify-between px-4">
//       <h1 className="font-semibold text-base">Agent Studio</h1>

//       <div className="flex items-center space-x-2">
//         <Button
//           onClick={handleSaveNodes}
//           className="text-xs"
//           size="sm"
//           disabled={disabledSave}
//         >
//           <Save className="w-4 h-4 mr-1" />
//           Save
//         </Button>

//         <Button
//           onClick={handleRunSimulation}
//           className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
//           size="sm"
//         >
//           <Play className="w-4 h-4 mr-1" />
//           Run Simulation
//         </Button>
//       </div>
//     </header>
//   );
// };

// // Main workspace component with tabbed content
// const Workspace = () => {
//   const [activeTab, setActiveTab] = useState("builder");

//   return (
//     <div className="flex-1 flex flex-col overflow-hidden">
//       <div className="border-b border-border bg-secondary">
//         <TabsList className="bg-transparent border-b-0">
//           <TabsTrigger
//             value="builder"
//             className="data-[state=active]:bg-white rounded-b-none"
//             onClick={() => setActiveTab("builder")}
//           >
//             <Workflow className="w-4 h-4 mr-2" />
//             Flow Builder
//           </TabsTrigger>
//           <TabsTrigger
//             value="simulation"
//             className="data-[state=active]:bg-white rounded-b-none"
//             onClick={() => setActiveTab("simulation")}
//           >
//             <MessageSquare className="w-4 h-4 mr-2" />
//             Simulation
//           </TabsTrigger>
//         </TabsList>
//       </div>

//       <div className="flex-1 flex overflow-hidden">
//         <Sidebar />

//         {activeTab === "builder" ? (
//           <>
//             <FlowCanvas />
//             <PropertiesPanel />
//           </>
//         ) : (
//           <>
//             <SimulationEnvironment />
//             <AnalyticsPanel />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Main layout wrapper component
// const AgentBuilderLayout = () => (
//   <div className="min-h-screen max-h-screen h-screen flex flex-col">
//     <Navbar />
//     <Workspace />
//   </div>
// );

// // Main page component with providers
// const Index = () => (
//   <ReactFlowProvider>
//     <FlowProvider>
//       <Tabs defaultValue="builder">
//         <AgentBuilderLayout />
//       </Tabs>
//     </FlowProvider>
//   </ReactFlowProvider>
// );

// export default Index;

import React, { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Play,
  Save,
  MessageSquare,
  Workflow,
  ArrowRight,
  Cross,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { FlowProvider, useFlow } from "@/context/FlowContext";
import Sidebar from "@/components/Sidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import FlowCanvas from "@/components/FlowCanvas";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

// Simulation environment component
const SimulationEnvironment = ({ setActiveTab }) => {
  const { nodes, edges, nodeConfigs } = useFlow();
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are now chatting with a simulated agent. This is a test environment.",
    },
    {
      role: "assistant",
      content: "Hello! I'm your simulated agent. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { role: "user", content: userInput }];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Simulate agent response (would connect to actual agent logic in production)
    setTimeout(() => {
      const simulatedResponse = generateSimulatedResponse(
        userInput,
        nodeConfigs
      );
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: simulatedResponse },
      ]);
      setIsLoading(false);
    }, 1000);

    setUserInput("");
  };

  // Generate a simulated response based on user input and agent configuration
  const generateSimulatedResponse = (input, config) => {
    // In a real implementation, this would process the input through the agent flow
    // For now, we'll return a simple response that references the node configuration

    const nodeCount = Object.keys(config).length;
    if (nodeCount === 0) {
      return "No agent configuration detected. Try building an agent flow first!";
    }

    const responses = [
      `I processed your message "${input}" through ${nodeCount} configured nodes.`,
      `Based on your input, I would typically route this through our knowledge base and response formulation nodes.`,
      `I've analyzed your request and determined the appropriate action based on my configuration.`,
      `According to my current setup, I would classify this input and generate a response using my defined parameters.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex-1 flex flex-col h-full border-l border-border relative">
      <div className="flex-1 p-4 overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`px-2 py-1.5 rounded-md text-sm ${
                message.role === "user"
                  ? "bg-accent border border-border ml-20 text-accent-foreground"
                  : message.role === "assistant"
                  ? "border border-border mr-20 text-white"
                  : "bg-red-900 text-red-400 text-sm italic"
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="mr-12 rounded-lg space-y-2 animate-pulse">
              <div className="h-4 bg-primary/20 rounded w-4/5"></div>
              <div className="h-4 bg-primary/20 rounded w-3/5"></div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="max-w-2xl mx-auto flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message to test your agent..."
            className="flex-1 bg-muted border border-border rounded-l-md px-4 py-2 text-sm text-foreground focus:outline-none"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-none"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <button
          type="button"
          className="w-8 h-8 rounded-md flex justify-center items-center bg-accent hover:bg-card ml-12 text-accent-foreground text-xs"
          onClick={() => setActiveTab("builder")}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Analytics Panel Component
const AnalyticsPanel = () => {
  return (
    <div className="flex-1 flex flex-col h-full border-l border-border bg-background">
      <div className="p-4">
        <h2 className="text-lg font-medium mb-4 text-foreground">
          Simulation Analytics
        </h2>

        <div className="space-y-4">
          <div className="border border-border rounded-md p-4 bg-card">
            <h3 className="text-sm font-medium mb-2 text-card-foreground">
              Conversation Summary
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>Run the simulation to see analytics here</p>
            </div>
          </div>

          <div className="border border-border rounded-md p-4 bg-card">
            <h3 className="text-sm font-medium mb-2 text-card-foreground">
              Node Performance
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>No data available yet</p>
            </div>
          </div>

          <div className="border border-border rounded-md p-4 bg-card">
            <h3 className="text-sm font-medium mb-2 text-card-foreground">
              Response Times
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>No data available yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Top navbar component with tabs
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
    toast.success("Configuration saved successfully");
  };

  const disabledSave = Object.keys(nodeConfigs).length === 0;

  return (
    <header className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Link
          type="button"
          className="w-8 h-8 rounded-md flex justify-center items-center bg-accent hover:bg-card text-accent-foreground text-xs"
          to={"/dashboard"}
        >
          <ArrowLeft size={20} />
        </Link>

        <h1 className="font-semibold text-base text-sidebar-foreground">
          Agent Studio
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={handleSaveNodes}
          className="text-xs"
          size="sm"
          disabled={disabledSave}
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>

        <Button
          onClick={handleRunSimulation}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          size="sm"
        >
          <Play className="w-4 h-4 mr-1" />
          Run Simulation
        </Button>
      </div>
    </header>
  );
};

// Main workspace component with tabbed content
const Workspace = () => {
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* <div className="border-b border-border">
        <TabsList className="bg-transparent border-b-0 p-0">
          <TabsTrigger
            value="builder"
            className="data-[state=active]:border-blue-600 h-full border-b-2 border-transparent rounded-b-none text-foreground"
            onClick={() => setActiveTab("builder")}
          >
            <Workflow className="w-4 h-4 mr-2" />
            Flow Builder
          </TabsTrigger>

          <TabsTrigger
            value="simulation"
            className="data-[state=active]:border-blue-600 hf border-b-2 border-transparent rounded-b-none text-foreground"
            onClick={() => setActiveTab("simulation")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Simulation
          </TabsTrigger>
        </TabsList>
      </div> */}

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        {activeTab === "builder" ? (
          <>
            <FlowCanvas setActiveTab={setActiveTab} />
            <PropertiesPanel />
          </>
        ) : (
          <>
            <SimulationEnvironment setActiveTab={setActiveTab} />
            {/* <AnalyticsPanel /> */}
          </>
        )}
      </div>
    </div>
  );
};

// Main layout wrapper component
const AgentBuilderLayout = () => (
  <div className="min-h-screen max-h-screen h-screen flex flex-col bg-background text-foreground">
    <Navbar />
    <Workspace />
  </div>
);

// Main page component with providers
const Index = () => (
  <ReactFlowProvider>
    <FlowProvider>
      <Tabs defaultValue="builder">
        <AgentBuilderLayout />
      </Tabs>
    </FlowProvider>
  </ReactFlowProvider>
);

export default Index;
