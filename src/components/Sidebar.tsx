
import React from 'react';
import { Database, Hammer, MemoryStick, ArrowRight } from 'lucide-react';

// Define the node types and their properties
const nodeTypes = [
  {
    type: 'llm',
    label: 'LLM Node',
    icon: Database,
    color: '#3b82f6',
    description: 'Process text with an LLM'
  },
  {
    type: 'tool',
    label: 'Tool Node',
    icon: Hammer,
    color: '#22c55e',
    description: 'Use tools and APIs'
  },
  {
    type: 'memory',
    label: 'Memory Node',
    icon: MemoryStick,
    color: '#a855f7',
    description: 'Store and retrieve data'
  },
  {
    type: 'output',
    label: 'Output Node',
    icon: ArrowRight,
    color: '#f97316',
    description: 'Present results'
  }
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-border p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      
      <div className="space-y-3">
        {nodeTypes.map((item) => {
          const Icon = item.icon;
          
          return (
            <div
              key={item.type}
              className="draggable-node p-3 rounded-md border border-border bg-secondary hover:bg-accent transition-colors duration-200 cursor-grab"
              onDragStart={(event) => onDragStart(event, item.type)}
              draggable
            >
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-md"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
