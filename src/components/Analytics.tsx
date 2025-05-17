
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFlow } from '@/context/FlowContext';

const Analytics = () => {
  const { nodes, edges, nodeConfigs, simulationResults } = useFlow();
  
  if (!simulationResults) {
    return (
      <div className="p-4 bg-muted/50 rounded-md">
        <p className="text-center text-muted-foreground mb-3">
          Run a simulation to view analytics data
        </p>
        <div className="text-center">
          <Button 
            onClick={() => toast.info("Run a simulation from the top navbar to see analytics")}
            variant="outline"
            size="sm"
          >
            Learn More
          </Button>
        </div>
      </div>
    );
  }
  
  const chartData = nodes.map(node => {
    const result = simulationResults.nodePerformance[node.id] || {
      processingTime: 0,
      failureRate: 0,
      throughput: 0
    };
    
    return {
      name: node.data?.label || `${node.type} Node`,
      processingTime: result.processingTime,
      throughput: result.throughput
    };
  });

  const bottleneckNodes = chartData
    .filter(data => data.processingTime > 500) // Nodes with high processing time
    .sort((a, b) => b.processingTime - a.processingTime);
  
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-sm font-medium">Node Performance</h3>
        <p className="text-xs text-muted-foreground">Processing time in milliseconds</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="processingTime" name="Processing Time (ms)" fill="#8884d8" />
            <Bar dataKey="throughput" name="Throughput (req/min)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {bottleneckNodes.length > 0 && (
        <div className="border border-border rounded-md p-3">
          <h4 className="text-sm font-medium mb-2">Identified Bottlenecks</h4>
          <ul className="space-y-2">
            {bottleneckNodes.map((node, index) => (
              <li key={index} className="flex justify-between text-xs">
                <span className="font-medium">{node.name}</span>
                <span className="text-red-500">{node.processingTime}ms</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Analytics;
