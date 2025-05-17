
import React from 'react';
import { useFlow } from '@/context/FlowContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PropertiesPanel = () => {
  const { selectedNodeId, nodes, nodeConfigs, updateNodeConfig } = useFlow();
  
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  const nodeConfig = selectedNodeId ? nodeConfigs[selectedNodeId] || {} : {};
  const nodeType = selectedNode?.type || '';

  if (!selectedNodeId) {
    return (
      <div className="w-64 bg-sidebar border-l border-border p-4">
        <div className="text-center text-muted-foreground p-8">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  const handleInputChange = (key: string, value: any) => {
    updateNodeConfig(selectedNodeId, { [key]: value });
  };

  const handleSave = () => {
    console.log('Saving node config:', { id: selectedNodeId, config: nodeConfig });
  };

  // Render different properties based on node type
  const renderProperties = () => {
    switch (nodeType) {
      case 'llm':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select 
                  value={nodeConfig.model || "gpt-4"}
                  onValueChange={(value) => handleInputChange('model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="mistral-large">Mistral Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {nodeConfig.temperature || 0.7}
                </Label>
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={nodeConfig.temperature || 0.7}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </>
        );
      
      case 'tool':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toolName">Tool Name</Label>
                <Select 
                  value={nodeConfig.toolName || "web-search"}
                  onValueChange={(value) => handleInputChange('toolName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-search">Web Search</SelectItem>
                    <SelectItem value="calculator">Calculator</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="code-interpreter">Code Interpreter</SelectItem>
                    <SelectItem value="custom">Custom Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {nodeConfig.toolName === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customTool">Custom Tool URL</Label>
                  <Input
                    id="customTool"
                    placeholder="https://api.example.com"
                    value={nodeConfig.customUrl || ''}
                    onChange={(e) => handleInputChange('customUrl', e.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        );
      
      case 'memory':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memoryType">Memory Type</Label>
                <Select 
                  value={nodeConfig.memoryType || "buffer"}
                  onValueChange={(value) => handleInputChange('memoryType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Memory Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buffer">Buffer Memory</SelectItem>
                    <SelectItem value="conversation">Conversation Memory</SelectItem>
                    <SelectItem value="vector">Vector Store</SelectItem>
                    <SelectItem value="summary">Summary Memory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="window">Window Size</Label>
                <Input
                  id="window"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  value={nodeConfig.window || 10}
                  onChange={(e) => handleInputChange('window', parseInt(e.target.value))}
                />
              </div>
            </div>
          </>
        );
      
      case 'output':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select 
                  value={nodeConfig.format || "text"}
                  onValueChange={(value) => handleInputChange('format', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      
      default:
        return <div>No properties available.</div>;
    }
  };

  return (
    <div className="w-64 bg-sidebar border-l border-border p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <div className="text-xs py-1 px-2 rounded bg-accent text-accent-foreground">
          {nodeType.toUpperCase()}
        </div>
      </div>
      
      {renderProperties()}
      
      <div className="mt-8">
        <Button 
          className="w-full"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
