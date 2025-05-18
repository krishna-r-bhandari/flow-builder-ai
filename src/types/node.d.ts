
// Define the NodeData type with index signature
declare interface NodeData extends Record<string, any> {
  label?: string;
  analytics?: {
    processingTime?: number;
    failureRate?: number;
    throughput?: number;
  };
}
