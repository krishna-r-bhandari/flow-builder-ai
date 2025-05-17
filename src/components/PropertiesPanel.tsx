
import React, { useEffect } from 'react';
import { useFlow } from '@/context/FlowContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define schemas for each node type validation
const llmSchema = z.object({
  model: z.string().min(1, "Model is required"),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().positive().max(4096)
});

const toolSchema = z.object({
  toolName: z.string().min(1, "Tool name is required"),
  customUrl: z.string().url().optional().or(z.literal('')),
  timeout: z.number().int().min(500).max(30000)
});

const memorySchema = z.object({
  memoryType: z.string().min(1, "Memory type is required"),
  window: z.number().int().min(1).max(100),
  embeddingModel: z.string().optional()
});

const outputSchema = z.object({
  format: z.string().min(1, "Format is required"),
  maxLength: z.number().int().min(10).max(10000)
});

// Union schema for all node types
const configSchema = z.discriminatedUnion('nodeType', [
  z.object({ nodeType: z.literal('llm'), ...llmSchema.shape }),
  z.object({ nodeType: z.literal('tool'), ...toolSchema.shape }),
  z.object({ nodeType: z.literal('memory'), ...memorySchema.shape }),
  z.object({ nodeType: z.literal('output'), ...outputSchema.shape }),
]);

const PropertiesPanel = () => {
  const { selectedNodeId, nodes, nodeConfigs, updateNodeConfig, setNodes } = useFlow();
  
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  const nodeType = selectedNode?.type || '';

  // Get appropriate schema based on node type
  const getSchemaForNodeType = () => {
    switch (nodeType) {
      case 'llm': return llmSchema;
      case 'tool': return toolSchema;
      case 'memory': return memorySchema;
      case 'output': return outputSchema;
      default: return z.object({});
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchemaForNodeType()),
    defaultValues: {
      // Default values will be set in useEffect
      ...nodeConfigs[selectedNodeId] || {}
    }
  });

  // Load node config when a new node is selected
  useEffect(() => {
    if (selectedNodeId) {
      const config = nodeConfigs[selectedNodeId] || {};
      form.reset(config);
    }
  }, [selectedNodeId, nodeConfigs, form]);

  const handleSave = (values) => {
    updateNodeConfig(selectedNodeId, values);
    toast.success("Changes saved successfully");
    console.log('Saving node config:', { id: selectedNodeId, config: values });
  };

  const handleRemoveNode = () => {
    if (!selectedNodeId) return;
    
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    toast.success("Node removed");
  };

  if (!selectedNodeId) {
    return (
      <div className="w-64 bg-sidebar border-l border-border p-4">
        <div className="text-center text-muted-foreground p-8">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  // Render different properties based on node type
  const renderProperties = () => {
    switch (nodeType) {
      case 'llm':
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "gpt-4"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Temperature: {field.value || 0.7}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={2}
                        step={0.1}
                        defaultValue={[field.value || 0.7]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="10"
                        max="4096"
                        placeholder="1024"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save
                </Button>
                <Button 
                  type="button"
                  variant="destructive" 
                  onClick={handleRemoveNode}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </form>
          </Form>
        );
      
      case 'tool':
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="toolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool Name</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "web-search"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Tool" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web-search">Web Search</SelectItem>
                        <SelectItem value="calculator">Calculator</SelectItem>
                        <SelectItem value="weather">Weather</SelectItem>
                        <SelectItem value="code-interpreter">Code Interpreter</SelectItem>
                        <SelectItem value="custom">Custom Tool</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch('toolName') === 'custom' && (
                <FormField
                  control={form.control}
                  name="customUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Tool URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://api.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (ms)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="500"
                        max="30000"
                        placeholder="5000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save
                </Button>
                <Button 
                  type="button"
                  variant="destructive" 
                  onClick={handleRemoveNode}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </form>
          </Form>
        );
      
      case 'memory':
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="memoryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memory Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "buffer"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Memory Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buffer">Buffer Memory</SelectItem>
                        <SelectItem value="conversation">Conversation Memory</SelectItem>
                        <SelectItem value="vector">Vector Store</SelectItem>
                        <SelectItem value="summary">Summary Memory</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="window"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Window Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('memoryType') === 'vector' && (
                <FormField
                  control={form.control}
                  name="embeddingModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embedding Model</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || "text-embedding-ada-002"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text-embedding-ada-002">Ada 002</SelectItem>
                          <SelectItem value="text-embedding-3-small">Embedding 3 Small</SelectItem>
                          <SelectItem value="text-embedding-3-large">Embedding 3 Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save
                </Button>
                <Button 
                  type="button"
                  variant="destructive" 
                  onClick={handleRemoveNode}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </form>
          </Form>
        );
      
      case 'output':
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Format</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "text"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Length</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="10"
                        max="10000"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save
                </Button>
                <Button 
                  type="button"
                  variant="destructive" 
                  onClick={handleRemoveNode}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </form>
          </Form>
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
    </div>
  );
};

export default PropertiesPanel;
