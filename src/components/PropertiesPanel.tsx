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

  documentLoader: z.object({
    sourceType: z.string().min(1, "Source type is required"),
    filePath: z.string().min(1, "File path is required").optional(),
    url: z.string().url("Must be a valid URL").optional(),
    apiKey: z.string().optional(),
    recursive: z.boolean().optional(),
    fileTypes: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.string()).optional(),
  }),

  textSplitter: z.object({
    chunkSize: z.number().int().min(100).max(8000),
    chunkOverlap: z.number().int().min(0).max(1000),
    splitterType: z.string().min(1, "Splitter type is required"),
    separators: z.array(z.string()).optional(),
    keepSeparator: z.boolean().optional(),
    stripWhitespace: z.boolean().optional(),
  }),

  embedding: z.object({
    model: z.string().min(1, "Embedding model is required"),
    dimensions: z.number().int().min(64).max(1536).optional(),
    provider: z.string().min(1, "Provider is required"),
    apiKey: z.string().optional(),
    batchSize: z.number().int().min(1).max(2048).optional(),
    stripNewLines: z.boolean().optional(),
  }),

  vectorstore: z.object({
    storeType: z.string().min(1, "Vector store type is required"),
    connectionString: z.string().optional(),
    collection: z.string().min(1, "Collection name is required"),
    persist: z.boolean(),
    dimensions: z.number().int().min(64).max(1536).optional(),
    metric: z.string().optional(),
    maxConnections: z.number().int().min(1).max(100).optional(),
  }),

  retriever: z.object({
    retrievalType: z.string().min(1, "Retrieval type is required"),
    topK: z.number().int().min(1).max(100),
    scoreThreshold: z.number().min(0).max(1).optional(),
    maxTokens: z.number().int().min(100).max(10000).optional(),
    filter: z.record(z.string(), z.string()).optional(),
    includeMetadata: z.boolean().optional(),
    mmr: z.boolean().optional(),
    diversityFactor: z.number().min(0).max(1).optional(),
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
                { value: "gpt-3.5-turbo-1106", label: "gpt-3.5-turbo-1106" },
                { value: "gpt-3.5-turbo-0125", label: "gpt-3.5-turbo-0125" },
                { value: "gpt-4-0613", label: "gpt-4-0613" },
                { value: "gpt-4-1106-preview", label: "gpt-4-1106-preview" },
                { value: "gpt-4-0125-preview", label: "gpt-4-0125-preview" },
                { value: "gpt-4o-2024-05-13", label: "gpt-4o-2024-05-13" },
                {
                  value: "gpt-4o-mini-2024-07-18",
                  label: "gpt-4o-mini-2024-07-18",
                },
                { value: "gpt-4-turbo-preview", label: "gpt-4-turbo-preview" },
                {
                  value: "gpt-4-turbo-2024-04-09",
                  label: "gpt-4-turbo-2024-04-09",
                },
                { value: "gpt-4-turbo", label: "gpt-4-turbo" },
                { value: "o3-mini-2025-01-31", label: "o3-mini-2025-01-31" },
                { value: "o1-mini-2024-09-12", label: "o1-mini-2024-09-12" },
                { value: "o1-2024-12-17", label: "o1-2024-12-17" },
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
                { value: "gpt-4o-2024-05-13", label: "gpt-4o-2024-05-13" },
                {
                  value: "gpt-4-turbo-2024-04-09",
                  label: "gpt-4-turbo-2024-04-09",
                },
                { value: "gpt-4-0613", label: "gpt-4-0613" },
                { value: "gpt-4-32k-0613", label: "gpt-4-32k-0613" },
                { value: "gpt-4-0125-preview", label: "gpt-4-0125-preview" },
                { value: "gpt-4-1106-preview", label: "gpt-4-1106-preview" },
                { value: "gpt-35-turbo-0125", label: "gpt-35-turbo-0125" },
                { value: "gpt-35-turbo-0613", label: "gpt-35-turbo-0613" },
                {
                  value: "gpt-35-turbo-16k-0613",
                  label: "gpt-35-turbo-16k-0613",
                },
                {
                  value: "gpt-4o-mini-2024-07-18",
                  label: "gpt-4o-mini-2024-07-18",
                },
                { value: "o3-mini", label: "o3-mini" },
                { value: "o1-mini", label: "o1-mini" },
                { value: "o1", label: "o1" },
              ],
            };

            return (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "gpt-4o-mini-2024-07-18"}
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

  documentLoader: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sourceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset related fields when source type changes
                  if (value === "file" || value === "directory") {
                    form.setValue("url", "");
                  } else if (value === "web") {
                    form.setValue("filePath", "");
                    form.setValue("recursive", false);
                  }
                }}
                defaultValue={field.value || "file"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="file">Single File</SelectItem>
                  <SelectItem value="directory">Directory</SelectItem>
                  <SelectItem value="web">Web URL</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">External API</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {["file", "directory"].includes(form.watch("sourceType")) && (
          <FormField
            control={form.control}
            name="filePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("sourceType") === "file"
                    ? "File Path"
                    : "Directory Path"}
                </FormLabel>
                <FormControl>
                  <Input placeholder="/path/to/documents" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("sourceType") === "directory" && (
          <>
            <FormField
              control={form.control}
              name="recursive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Recursive Search</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Search in subdirectories
                    </div>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Types</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="pdf,docx,txt"
                      value={field.value?.join(",") || ""}
                      onChange={(e) => {
                        const types = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        field.onChange(types);
                      }}
                    />
                  </FormControl>
                  <div className="text-[0.8rem] text-muted-foreground">
                    Comma-separated list of file extensions
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {["web", "api"].includes(form.watch("sourceType")) && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/page" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {["api", "database"].includes(form.watch("sourceType")) && (
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key / Connection String</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your API key or connection string"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <details className="text-sm mt-2">
          <summary className="font-medium cursor-pointer">
            Metadata Settings
          </summary>
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-border">
            <div className="text-[0.8rem] text-muted-foreground mb-2">
              Add custom metadata to associate with these documents
            </div>

            <div className="space-y-2">
              {Object.entries(form.watch("metadata") || {}).map(
                ([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Key"
                      value={key}
                      onChange={(e) => {
                        const metadata = { ...form.watch("metadata") };
                        const oldKey = key;
                        delete metadata[oldKey];
                        metadata[e.target.value] = value;
                        form.setValue("metadata", metadata);
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={value}
                      onChange={(e) => {
                        const metadata = { ...form.watch("metadata") };
                        metadata[key] = e.target.value;
                        form.setValue("metadata", metadata);
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const metadata = { ...form.watch("metadata") };
                        delete metadata[key];
                        form.setValue("metadata", metadata);
                      }}
                      className="px-2"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const metadata = { ...(form.watch("metadata") || {}) };
                  metadata[`key${Object.keys(metadata).length + 1}`] = "";
                  form.setValue("metadata", metadata);
                }}
                className="w-full"
              >
                Add Metadata Field
              </Button>
            </div>
          </div>
        </details>

        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),

  textSplitter: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="splitterType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Splitting Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "character"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Splitter Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="character">Character Split</SelectItem>
                  <SelectItem value="token">Token Split</SelectItem>
                  <SelectItem value="recursive">Recursive Character</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chunkSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chunk Size</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="100"
                  max="8000"
                  placeholder="1000"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1000)
                  }
                />
              </FormControl>
              <div className="text-[0.8rem] text-muted-foreground">
                Maximum size of each text chunk
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chunkOverlap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chunk Overlap</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="200"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 200)
                  }
                />
              </FormControl>
              <div className="text-[0.8rem] text-muted-foreground">
                Number of overlapping characters between chunks
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <details className="text-sm mt-2">
          <summary className="font-medium cursor-pointer">
            Advanced Settings
          </summary>
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-border">
            {["character", "recursive"].includes(
              form.watch("splitterType")
            ) && (
              <FormField
                control={form.control}
                name="separators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Separators</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="\n\n, \n, . "
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const seps = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          field.onChange(seps);
                        }}
                      />
                    </FormControl>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Comma-separated list of separators to split on
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="keepSeparator"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Keep Separators</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Include separator with the chunk
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

            <FormField
              control={form.control}
              name="stripWhitespace"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Strip Whitespace</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Remove excess whitespace from chunks
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

  embedding: ({ form, onSubmit, onRemove }) => (
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
                  <SelectItem value="cohere">Cohere</SelectItem>
                  <SelectItem value="huggingface">HuggingFace</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
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
                { value: "text-embedding-3-small", label: "Embedding 3 Small" },
                { value: "text-embedding-3-large", label: "Embedding 3 Large" },
                { value: "text-embedding-ada-002", label: "Ada 002" },
              ],
              cohere: [
                { value: "embed-english-v3.0", label: "English v3.0" },
                {
                  value: "embed-multilingual-v3.0",
                  label: "Multilingual v3.0",
                },
              ],
              huggingface: [
                {
                  value: "sentence-transformers/all-mpnet-base-v2",
                  label: "MPNet Base v2",
                },
                {
                  value: "sentence-transformers/all-MiniLM-L6-v2",
                  label: "MiniLM L6 v2",
                },
              ],
              google: [
                { value: "textembedding-gecko", label: "Gecko" },
                { value: "embedding-001", label: "Embedding 001" },
              ],
              azure: [{ value: "azure-embedding", label: "Azure Embedding" }],
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

        <details className="text-sm mt-2">
          <summary className="font-medium cursor-pointer">
            Advanced Settings
          </summary>
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-border">
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => {
                // Set default dimensions based on the model
                const model = form.watch("model") || "";
                let defaultDimensions = 1536; // Default for most models

                if (model === "text-embedding-3-small")
                  defaultDimensions = 1536;
                if (model === "text-embedding-3-large")
                  defaultDimensions = 3072;
                if (model === "text-embedding-ada-002")
                  defaultDimensions = 1536;

                return (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="64"
                        max="3072"
                        placeholder={defaultDimensions.toString()}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value) || defaultDimensions
                          )
                        }
                      />
                    </FormControl>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Vector dimensions (model specific)
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="2048"
                      placeholder="32"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 32)
                      }
                    />
                  </FormControl>
                  <div className="text-[0.8rem] text-muted-foreground">
                    Number of texts to process in each batch
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stripNewLines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Strip New Lines</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Remove line breaks before embedding
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

  vectorstore: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="storeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vector Store Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "memory"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Store Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="memory">In-Memory</SelectItem>
                  <SelectItem value="chroma">ChromaDB</SelectItem>
                  <SelectItem value="pinecone">Pinecone</SelectItem>
                  <SelectItem value="qdrant">Qdrant</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="pgvector">PGVector</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("storeType") !== "memory" && (
          <FormField
            control={form.control}
            name="connectionString"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection String</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Connection URL or API key"
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
          name="collection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="my-vector-collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="persist"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Persist Vectors</FormLabel>
                <div className="text-[0.8rem] text-muted-foreground">
                  Save vectors for future sessions
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

        <details className="text-sm mt-2">
          <summary className="font-medium cursor-pointer">
            Advanced Settings
          </summary>
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-border">
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="64"
                      max="3072"
                      placeholder="1536"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1536)
                      }
                    />
                  </FormControl>
                  <div className="text-[0.8rem] text-muted-foreground">
                    Must match your embedding model's dimensions
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance Metric</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "cosine"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Metric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cosine">Cosine</SelectItem>
                      <SelectItem value="euclidean">Euclidean</SelectItem>
                      <SelectItem value="dotproduct">Dot Product</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxConnections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Connections</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="8"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 8)
                      }
                    />
                  </FormControl>
                  <div className="text-[0.8rem] text-muted-foreground">
                    Maximum concurrent database connections
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </details>

        <ActionButtons onSubmit={onSubmit} onRemove={onRemove} />
      </form>
    </Form>
  ),

  retriever: ({ form, onSubmit, onRemove }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="retrievalType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retrieval Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "similarity"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="similarity">Similarity Search</SelectItem>
                  <SelectItem value="mmr">
                    Maximum Marginal Relevance
                  </SelectItem>
                  <SelectItem value="hybrid">Hybrid Search</SelectItem>
                  <SelectItem value="contextual">
                    Contextual Compression
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topK"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Results to Retrieve (k)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="4"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 4)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scoreThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score Threshold</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.7"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0.7)
                  }
                />
              </FormControl>
              <div className="text-[0.8rem] text-muted-foreground">
                Minimum relevance score (0-1)
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxTokens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Context Tokens</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="100"
                  max="10000"
                  placeholder="2000"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 2000)
                  }
                />
              </FormControl>
              <div className="text-[0.8rem] text-muted-foreground">
                Maximum tokens to send to LLM
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="includeMetadata"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Include Metadata</FormLabel>
                <div className="text-[0.8rem] text-muted-foreground">
                  Include document metadata with results
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

        {form.watch("retrievalType") === "mmr" && (
          <FormField
            control={form.control}
            name="diversityFactor"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Diversity Factor</FormLabel>
                  <span className="text-sm text-muted-foreground">
                    {field.value ?? 0.5}
                  </span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[field.value ?? 0.5]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="cursor-pointer"
                  />
                </FormControl>
                <div className="text-[0.8rem] text-muted-foreground">
                  Balance between relevance and diversity (0 = relevance only, 1
                  = diversity only)
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <details className="text-sm mt-2">
          <summary className="font-medium cursor-pointer">
            Filtering Options
          </summary>
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-border">
            <div className="text-[0.8rem] text-muted-foreground mb-2">
              Add filters to narrow down the retrieved documents
            </div>

            <div className="space-y-2">
              {Object.entries(form.watch("filter") || {}).map(
                ([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Key"
                      value={key}
                      onChange={(e) => {
                        const filter = { ...form.watch("filter") };
                        const oldKey = key;
                        delete filter[oldKey];
                        filter[e.target.value] = value;
                        form.setValue("filter", filter);
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={value}
                      onChange={(e) => {
                        const filter = { ...form.watch("filter") };
                        filter[key] = e.target.value;
                        form.setValue("filter", filter);
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const filter = { ...form.watch("filter") };
                        delete filter[key];
                        form.setValue("filter", filter);
                      }}
                      className="px-2"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const filter = { ...(form.watch("filter") || {}) };
                  filter[`key${Object.keys(filter).length + 1}`] = "";
                  form.setValue("filter", filter);
                }}
                className="w-full"
              >
                Add Filter
              </Button>
            </div>
          </div>
        </details>

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
      <div className="max-w-72 w-full bg-sidebar border-l border-border p-2">
        <div className="text-center text-muted-foreground p-4 text-sm font-medium">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  // Get the appropriate form component for this node type
  const FormComponent = FormComponents[nodeType];

  return (
    <div className="max-w-72 w-full bg-sidebar border-l border-border p-2 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Properties</h2>
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
