// import React, { useEffect } from "react";
// import { useFlow } from "@/context/FlowContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Check, Save, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// // Define schemas for each node type validation
// const triggerSchema = z.object({
//   trigger: z.string().min(1, "Model is required"),
// });

// const llmSchema = z.object({
//   model: z.string().min(1, "Model is required"),
//   temperature: z.number().min(0).max(2),
//   maxTokens: z.number().int().positive().max(4096),
// });

// const toolSchema = z.object({
//   toolName: z.string().min(1, "Tool name is required"),
//   customUrl: z.string().url().optional().or(z.literal("")),
//   timeout: z.number().int().min(500).max(30000),
// });

// const memorySchema = z.object({
//   memoryType: z.string().min(1, "Memory type is required"),
//   window: z.number().int().min(1).max(100),
//   embeddingModel: z.string().optional(),
// });

// const outputSchema = z.object({
//   format: z.string().min(1, "Format is required"),
//   maxLength: z.number().int().min(10).max(10000),
// });

// // Union schema for all node types
// const configSchema = z.discriminatedUnion("nodeType", [
//   z.object({ nodeType: z.literal("llm"), ...llmSchema.shape }),
//   z.object({ nodeType: z.literal("tool"), ...toolSchema.shape }),
//   z.object({ nodeType: z.literal("memory"), ...memorySchema.shape }),
//   z.object({ nodeType: z.literal("output"), ...outputSchema.shape }),
// ]);

// const PropertiesPanel = () => {
//   const { selectedNodeId, nodes, nodeConfigs, updateNodeConfig, setNodes } =
//     useFlow();

//   const selectedNode = nodes.find((node) => node.id === selectedNodeId);
//   const nodeType = selectedNode?.type || "";

//   // Get appropriate schema based on node type
//   const getSchemaForNodeType = () => {
//     switch (nodeType) {
//       case "trigger":
//         return triggerSchema;
//       case "llm":
//         return llmSchema;
//       case "tool":
//         return toolSchema;
//       case "memory":
//         return memorySchema;
//       case "output":
//         return outputSchema;
//       default:
//         return z.object({});
//     }
//   };

//   const form = useForm({
//     resolver: zodResolver(getSchemaForNodeType()),
//     defaultValues: {
//       // Default values will be set in useEffect
//       ...(nodeConfigs[selectedNodeId] || {}),
//     },
//   });

//   // Load node config when a new node is selected
//   useEffect(() => {
//     if (selectedNodeId) {
//       const config = nodeConfigs[selectedNodeId] || {};
//       form.reset(config);
//     }
//   }, [selectedNodeId, nodeConfigs, form]);

//   const handleSave = (values) => {
//     updateNodeConfig(selectedNodeId, values);
//     toast.success("Changes saved successfully");
//     console.log("Saving node config:", { id: selectedNodeId, config: values });
//   };

//   const handleRemoveNode = () => {
//     if (!selectedNodeId) return;

//     setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
//     toast.success("Node removed");
//   };

//   if (!selectedNodeId) {
//     return (
//       <div className="w-64 bg-sidebar border-l border-border p-4">
//         <div className="text-center text-muted-foreground p-8">
//           Select a node to edit its properties
//         </div>
//       </div>
//     );
//   }

//   // Render different properties based on node type
//   const renderProperties = () => {
//     switch (nodeType) {
//       case "trigger":
//         return (
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSave)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="trigger"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Trigger</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value || "manual"}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Trigger" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="manual">Manual</SelectItem>
//                         <SelectItem value="automatic">Automatic</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex space-x-2 pt-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 flex items-center justify-center gap-2"
//                 >
//                   <Save size={16} />
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleRemoveNode}
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         );

//       case "llm":
//         return (
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSave)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="model"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Model</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value || "gpt-4"}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Model" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="gpt-4">GPT-4</SelectItem>
//                         <SelectItem value="gpt-3.5-turbo">
//                           GPT-3.5 Turbo
//                         </SelectItem>
//                         <SelectItem value="claude-3-opus">
//                           Claude 3 Opus
//                         </SelectItem>
//                         <SelectItem value="claude-3-sonnet">
//                           Claude 3 Sonnet
//                         </SelectItem>
//                         <SelectItem value="mistral-large">
//                           Mistral Large
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="temperature"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Temperature: {field.value || 0.7}</FormLabel>
//                     <FormControl>
//                       <Slider
//                         min={0}
//                         max={2}
//                         step={0.1}
//                         defaultValue={[field.value || 0.7]}
//                         onValueChange={(vals) => field.onChange(vals[0])}
//                         className="cursor-pointer"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="maxTokens"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Max Tokens</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         min="10"
//                         max="4096"
//                         placeholder="1024"
//                         {...field}
//                         onChange={(e) =>
//                           field.onChange(parseInt(e.target.value))
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex space-x-2 pt-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 flex items-center justify-center gap-2"
//                 >
//                   <Save size={16} />
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleRemoveNode}
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         );

//       case "tool":
//         return (
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSave)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="toolName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Tool Name</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value || "web-search"}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Tool" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="web-search">Web Search</SelectItem>
//                         <SelectItem value="calculator">Calculator</SelectItem>
//                         <SelectItem value="weather">Weather</SelectItem>
//                         <SelectItem value="code-interpreter">
//                           Code Interpreter
//                         </SelectItem>
//                         <SelectItem value="custom">Custom Tool</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {form.watch("toolName") === "custom" && (
//                 <FormField
//                   control={form.control}
//                   name="customUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Custom Tool URL</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="https://api.example.com"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )}

//               <FormField
//                 control={form.control}
//                 name="timeout"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Timeout (ms)</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         min="500"
//                         max="30000"
//                         placeholder="5000"
//                         {...field}
//                         onChange={(e) =>
//                           field.onChange(parseInt(e.target.value))
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex space-x-2 pt-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 flex items-center justify-center gap-2"
//                 >
//                   <Save size={16} />
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleRemoveNode}
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         );

//       case "memory":
//         return (
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSave)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="memoryType"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Memory Type</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value || "buffer"}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Memory Type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="buffer">Buffer Memory</SelectItem>
//                         <SelectItem value="conversation">
//                           Conversation Memory
//                         </SelectItem>
//                         <SelectItem value="vector">Vector Store</SelectItem>
//                         <SelectItem value="summary">Summary Memory</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="window"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Window Size</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         min="1"
//                         max="100"
//                         placeholder="10"
//                         {...field}
//                         onChange={(e) =>
//                           field.onChange(parseInt(e.target.value))
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {form.watch("memoryType") === "vector" && (
//                 <FormField
//                   control={form.control}
//                   name="embeddingModel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Embedding Model</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value || "text-embedding-ada-002"}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select Model" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="text-embedding-ada-002">
//                             Ada 002
//                           </SelectItem>
//                           <SelectItem value="text-embedding-3-small">
//                             Embedding 3 Small
//                           </SelectItem>
//                           <SelectItem value="text-embedding-3-large">
//                             Embedding 3 Large
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )}

//               <div className="flex space-x-2 pt-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 flex items-center justify-center gap-2"
//                 >
//                   <Save size={16} />
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleRemoveNode}
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         );

//       case "output":
//         return (
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSave)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="format"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Output Format</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value || "text"}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Format" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="text">Plain Text</SelectItem>
//                         <SelectItem value="markdown">Markdown</SelectItem>
//                         <SelectItem value="json">JSON</SelectItem>
//                         <SelectItem value="html">HTML</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="maxLength"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Max Length</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         min="10"
//                         max="10000"
//                         placeholder="1000"
//                         {...field}
//                         onChange={(e) =>
//                           field.onChange(parseInt(e.target.value))
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex space-x-2 pt-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 flex items-center justify-center gap-2"
//                 >
//                   <Save size={16} />
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleRemoveNode}
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         );

//       default:
//         return <div>No properties available.</div>;
//     }
//   };

//   return (
//     <div className="w-64 bg-sidebar border-l border-border p-4 overflow-y-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Properties</h2>
//         <div className="text-xs py-1 px-2 rounded bg-accent text-accent-foreground">
//           {nodeType.toUpperCase()}
//         </div>
//       </div>

//       {renderProperties()}
//     </div>
//   );
// };

// export default PropertiesPanel;

import React, { useEffect, useMemo } from "react";
import { useFlow } from "@/context/FlowContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Node type schemas
const schemas = {
  trigger: z.object({
    trigger: z.string().min(1, "Trigger type is required"),
  }),

  // llm: z.object({
  //   model: z.string().min(1, "Model is required"),
  //   temperature: z.number().min(0).max(2),
  //   maxTokens: z.number().int().positive().max(4096),
  // }),

  // In the schemas object
  llm: z.object({
    model: z.string().min(1, "Model is required"),
    provider: z.string().min(1, "Provider is required"),
    apiKey: z.string().optional(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().int().positive().max(4096),
    systemPrompt: z.string().optional(),
    topP: z.number().min(0).max(1).optional(),
    frequencyPenalty: z.number().min(-2).max(2).optional(),
    presencePenalty: z.number().min(-2).max(2).optional(),
    streaming: z.boolean().optional(),
  }),

  tool: z.object({
    toolName: z.string().min(1, "Tool name is required"),
    customUrl: z.string().url().optional().or(z.literal("")),
    timeout: z.number().int().min(500).max(30000),
  }),

  memory: z.object({
    memoryType: z.string().min(1, "Memory type is required"),
    window: z.number().int().min(1).max(100),
    embeddingModel: z.string().optional(),
  }),

  output: z.object({
    format: z.string().min(1, "Format is required"),
    maxLength: z.number().int().min(10).max(10000),
  }),
};

// Node-specific form components
const FormComponents = {
  trigger: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="trigger"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "manual"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trigger" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),

  // llm: ({ form, onSubmit, onRemove }) => (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  //       <FormField
  //         control={form.control}
  //         name="model"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Model</FormLabel>
  //             <Select
  //               onValueChange={field.onChange}
  //               defaultValue={field.value || "gpt-4"}
  //             >
  //               <FormControl>
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="Select Model" />
  //                 </SelectTrigger>
  //               </FormControl>
  //               <SelectContent>
  //                 <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
  //                 <SelectItem value="gpt-4">GPT-4</SelectItem>
  //                 <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
  //                 <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
  //                 <SelectItem value="claude-3-sonnet">
  //                   Claude 3 Sonnet
  //                 </SelectItem>
  //                 <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
  //                 <SelectItem value="mistral-large">Mistral Large</SelectItem>
  //                 <SelectItem value="mistral-small">Mistral Small</SelectItem>
  //               </SelectContent>
  //             </Select>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       <FormField
  //         control={form.control}
  //         name="temperature"
  //         render={({ field }) => (
  //           <FormItem>
  //             <div className="flex justify-between">
  //               <FormLabel>Temperature</FormLabel>
  //               <span className="text-sm text-muted-foreground">
  //                 {field.value || 0.7}
  //               </span>
  //             </div>
  //             <FormControl>
  //               <Slider
  //                 min={0}
  //                 max={2}
  //                 step={0.1}
  //                 defaultValue={[field.value || 0.7]}
  //                 onValueChange={(vals) => field.onChange(vals[0])}
  //                 className="cursor-pointer"
  //               />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       <FormField
  //         control={form.control}
  //         name="maxTokens"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Max Tokens</FormLabel>
  //             <FormControl>
  //               <Input
  //                 type="number"
  //                 min="10"
  //                 max="4096"
  //                 placeholder="1024"
  //                 {...field}
  //                 onChange={(e) =>
  //                   field.onChange(parseInt(e.target.value) || 1024)
  //                 }
  //               />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />

  //       <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
  //     </form>
  //   </Form>
  // ),

  llm: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset model when provider changes
                  form.setValue("model", "");
                }}
                defaultValue={field.value || "openai"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                  <SelectItem value="mistral">Mistral AI</SelectItem>
                  <SelectItem value="azure">Azure OpenAI</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => {
            const provider = form.watch("provider") || "openai";
            const modelOptions = {
              openai: [
                { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
                { value: "gpt-4", label: "GPT-4" },
                { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
              ],
              anthropic: [
                { value: "claude-3-opus", label: "Claude 3 Opus" },
                { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
                { value: "claude-3-haiku", label: "Claude 3 Haiku" },
              ],
              google: [
                { value: "gemini-pro", label: "Gemini Pro" },
                { value: "gemini-ultra", label: "Gemini Ultra" },
              ],
              mistral: [
                { value: "mistral-large", label: "Mistral Large" },
                { value: "mistral-small", label: "Mistral Small" },
                { value: "mistral-tiny", label: "Mistral Tiny" },
              ],
              azure: [
                { value: "azure-gpt-4", label: "Azure GPT-4" },
                { value: "azure-gpt-35", label: "Azure GPT-3.5" },
              ],
            };

            return (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                  disabled={!provider}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modelOptions[provider]?.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="You are a helpful assistant..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Temperature</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {field.value ?? 0.7}
                </span>
              </div>
              <FormControl>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  value={[field.value ?? 0.7]}
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
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1024)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <details className="text-sm mt-2">
          <summary className="font-medium cursor-pointer">
            Advanced Settings
          </summary>
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-border">
            <FormField
              control={form.control}
              name="topP"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Top P</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      {field.value ?? 1}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.05}
                      value={[field.value ?? 1]}
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
              name="frequencyPenalty"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Frequency Penalty</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      {field.value ?? 0}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[field.value ?? 0]}
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
              name="presencePenalty"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Presence Penalty</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      {field.value ?? 0}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[field.value ?? 0]}
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
              name="streaming"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Stream Response</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Receive tokens as they're generated
                    </div>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4"
                      checked={field.value ?? true}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </details>

        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),

  tool: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="code-interpreter">
                    Code Interpreter
                  </SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="custom">Custom Tool</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("toolName") === "custom" && (
          <FormField
            control={form.control}
            name="customUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Tool URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.example.com" {...field} />
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
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 5000)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),

  memory: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="conversation">
                    Conversation Memory
                  </SelectItem>
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
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 10)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("memoryType") === "vector" && (
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
                    <SelectItem value="text-embedding-ada-002">
                      Ada 002
                    </SelectItem>
                    <SelectItem value="text-embedding-3-small">
                      Embedding 3 Small
                    </SelectItem>
                    <SelectItem value="text-embedding-3-large">
                      Embedding 3 Large
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),

  output: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="csv">CSV</SelectItem>
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
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1000)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),
};

// Reusable action buttons component
const ActionButtons = ({ onSubmit, onRemove }) => (
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
      onClick={onRemove}
      className="px-3"
    >
      <Trash2 size={16} />
    </Button>
  </div>
);

const PropertiesPanel = () => {
  const { selectedNodeId, nodes, nodeConfigs, updateNodeConfig, setNodes } =
    useFlow();

  // Find the selected node
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const nodeType = selectedNode?.type || "";

  // Get schema based on node type
  const schema = useMemo(() => schemas[nodeType] || z.object({}), [nodeType]);

  // Initialize form with zod resolver
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: nodeConfigs[selectedNodeId] || {},
    mode: "onBlur",
  });

  // Load node config when a new node is selected
  useEffect(() => {
    if (selectedNodeId) {
      const config = nodeConfigs[selectedNodeId] || {};

      // Use setTimeout to avoid React batch update issues
      setTimeout(() => {
        form.reset(config);
      }, 0);
    }
  }, [selectedNodeId, nodeConfigs, form]);

  const handleSave = (values) => {
    if (!selectedNodeId) return;

    updateNodeConfig(selectedNodeId, values);
    toast.success("Changes saved successfully");
  };

  const handleRemoveNode = () => {
    if (!selectedNodeId) return;

    setNodes((prevNodes) =>
      prevNodes.filter((node) => node.id !== selectedNodeId)
    );
    toast.success("Node removed");
  };

  // When no node is selected
  if (!selectedNodeId) {
    return (
      <div className="w-64 bg-sidebar border-l border-border p-4">
        <div className="text-center text-muted-foreground p-8">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  // Get the appropriate form component for this node type
  const FormComponent = FormComponents[nodeType];

  return (
    <div className="w-64 bg-sidebar border-l border-border p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <div className="text-xs py-1 px-2 rounded bg-accent text-accent-foreground">
          {nodeType.toUpperCase()}
        </div>
      </div>

      {FormComponent ? (
        <FormComponent
          form={form}
          onSubmit={handleSave}
          onRemove={handleRemoveNode}
        />
      ) : (
        <div className="text-sm text-muted-foreground">
          No properties available for this node type.
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
