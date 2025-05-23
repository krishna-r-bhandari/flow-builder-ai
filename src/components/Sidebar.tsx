
import React, { useState } from "react";
import {
  Database,
  Hammer,
  MemoryStick,
  ArrowRight,
  ChartBar,
  MousePointerBan,
  FileText,
  SplitSquareVertical,
  DatabaseZap,
  SearchCode,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Analytics from "./Analytics";
import { useIsMobile } from "@/hooks/use-mobile";

const nodeTypes = [
  {
    type: "trigger",
    label: "Trigger",
    icon: MousePointerBan,
    color: "#F0B100",
    description:
      "Starts the agent workflow when an event or input is received.",
  },
  {
    type: "llm",
    label: "LLM Node",
    icon: Database,
    color: "#3b82f6",
    description:
      "Uses a large language model (LLM) to analyze or generate text.",
  },
  {
    type: "tool",
    label: "Tool Node",
    icon: Hammer,
    color: "#22c55e",
    description:
      "Connects to external tools or APIs for executing specific actions.",
  },
  {
    type: "memory",
    label: "Memory Node",
    icon: MemoryStick,
    color: "#a855f7",
    description: "Stores context or retrieves data from memory across steps.",
  },
  {
    type: "output",
    label: "Output Node",
    icon: ArrowRight,
    color: "#f97316",
    description: "Displays or returns the final result of the agent workflow.",
  },
  {
    type: "documentLoader",
    label: "Document Loader",
    icon: FileText,
    color: "#eab308",
    description: "Imports and processes external documents for use.",
  },
  {
    type: "textSplitter",
    label: "Text Splitter",
    icon: SplitSquareVertical,
    color: "#60a5fa",
    description: "Splits documents into smaller, manageable text chunks.",
  },
  {
    type: "vectorstore",
    label: "Vectorstore",
    icon: DatabaseZap,
    color: "#8b5cf6",
    description: "Stores and retrieves vector embeddings for fast search.",
  },
  {
    type: "retriever",
    label: "Retriever",
    icon: SearchCode,
    color: "#22d3ee",
    description: "Finds relevant data via semantic similarity search.",
  },
  {
    type: "embedding",
    label: "Embedding Generator",
    icon: Sparkles,
    color: "#fb7185",
    description: "Generates embeddings from input text using AI models.",
  },
];

const SidebarContent = ({ onDragStart }: { onDragStart: (event: React.DragEvent, nodeType: string) => void }) => (
  <Tabs defaultValue="components">
    <TabsList className="grid w-full grid-cols-2 mb-4">
      <TabsTrigger value="components">Components</TabsTrigger>
      <TabsTrigger value="analytics">
        <div className="flex items-center gap-1">
          <ChartBar className="w-4 h-4" />
          <span>Analytics</span>
        </div>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="components" className="space-y-3">
      {nodeTypes.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.type}
            className="draggable-node p-2 rounded-md border border-border bg-secondary hover:bg-accent transition-colors duration-200 cursor-grab"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
          >
            <div className="flex items-start gap-2">
              <div
                className="p-1 rounded-md"
                style={{
                  backgroundColor: `${item.color}20`,
                  color: item.color,
                }}
              >
                <Icon size={20} />
              </div>

              <div>
                <h3 className="font-medium text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </TabsContent>

    <TabsContent value="analytics">
      <Analytics />
    </TabsContent>
  </Tabs>
);

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // For mobile, render a sheet component that can be toggled
  if (isMobile) {
    return (
      <>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
            <div className="h-full bg-sidebar overflow-y-auto p-2">
              <div className="flex justify-between items-center mb-4 p-2">
                <h2 className="font-medium">Component Library</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent onDragStart={onDragStart} />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // For desktop, render the regular sidebar
  return (
    <aside className="max-w-72 w-full bg-sidebar border-r border-border p-2 overflow-y-auto">
      <SidebarContent onDragStart={onDragStart} />
    </aside>
  );
};

export default Sidebar;
