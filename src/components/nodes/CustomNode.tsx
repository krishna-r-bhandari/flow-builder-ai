
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Hammer, MemoryStick, ArrowRight } from 'lucide-react';

// Define the node data type
interface NodeData {
  label?: React.ReactNode;
}

// Mapping of node types to colors and icons
const nodeTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  llm: { icon: Database, color: 'rgb(59, 130, 246)' },
  tool: { icon: Hammer, color: 'rgb(34, 197, 94)' },
  memory: { icon: MemoryStick, color: 'rgb(168, 85, 247)' },
  output: { icon: ArrowRight, color: 'rgb(249, 115, 22)' },
};

const CustomNode: React.FC<NodeProps<NodeData>> = ({ id, type, data, selected }) => {
  const nodeType = type || 'llm';
  const { icon: Icon, color } = nodeTypeConfig[nodeType] || nodeTypeConfig.llm;
  
  return (
    <div 
      className={`p-4 rounded-md ${selected ? 'ring-2 ring-white' : ''} node-${nodeType}`}
      style={{ minWidth: 150, minHeight: 50 }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: color }} 
      />
      
      <div className="flex items-center gap-2 font-medium">
        <Icon size={20} color={color} />
        <div>{data?.label || `${nodeType.toUpperCase()} Node`}</div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: color }} 
      />
    </div>
  );
};

export default memo(CustomNode);
