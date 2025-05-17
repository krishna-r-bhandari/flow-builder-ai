
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Hammer, MemoryStick, ArrowRight } from 'lucide-react';

// Define the node data type
export interface NodeData {
  label?: string | React.ReactNode;
  analytics?: {
    processingTime?: number;
    failureRate?: number;
    throughput?: number;
  };
}

// Mapping of node types to colors and icons
const nodeTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  llm: { icon: Database, color: 'rgb(59, 130, 246)' },
  tool: { icon: Hammer, color: 'rgb(34, 197, 94)' },
  memory: { icon: MemoryStick, color: 'rgb(168, 85, 247)' },
  output: { icon: ArrowRight, color: 'rgb(249, 115, 22)' },
};

const CustomNode = memo(({ id, type, data, selected }: NodeProps<NodeData>) => {
  const nodeType = type || 'llm';
  const { icon: Icon, color } = nodeTypeConfig[nodeType as string] || nodeTypeConfig.llm;
  
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
      
      {data?.analytics && (
        <div className="mt-2 text-xs text-muted-foreground">
          {data.analytics.processingTime !== undefined && (
            <div className="flex justify-between">
              <span>Process time:</span>
              <span>{data.analytics.processingTime}ms</span>
            </div>
          )}
          {data.analytics.throughput !== undefined && (
            <div className="flex justify-between">
              <span>Throughput:</span>
              <span>{data.analytics.throughput}/min</span>
            </div>
          )}
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: color }} 
      />
    </div>
  );
});

export default CustomNode;
