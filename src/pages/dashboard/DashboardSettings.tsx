
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Define schema for API keys form
const apiKeysFormSchema = z.object({
  openaiApiKey: z.string().min(1, "OpenAI API key is required"),
  anthropicApiKey: z.string().optional(),
  stabilityAiApiKey: z.string().optional(),
});

// Define schema for preferences form
const preferencesFormSchema = z.object({
  defaultModel: z.enum(["gpt-4", "gpt-3.5-turbo", "claude-2", "custom"]),
  emailNotifications: z.boolean(),
  usageAlerts: z.boolean(),
});

const DashboardSettings = () => {
  // API Keys form
  const apiKeysForm = useForm<z.infer<typeof apiKeysFormSchema>>({
    resolver: zodResolver(apiKeysFormSchema),
    defaultValues: {
      openaiApiKey: "",
      anthropicApiKey: "",
      stabilityAiApiKey: "",
    },
  });

  // Preferences form
  const preferencesForm = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      defaultModel: "gpt-4",
      emailNotifications: true,
      usageAlerts: true,
    },
  });

  // Handler for API Keys form submission
  function onApiKeysSubmit(values: z.infer<typeof apiKeysFormSchema>) {
    toast.success("API keys updated successfully");
    console.log(values);
  }

  // Handler for preferences form submission
  function onPreferencesSubmit(values: z.infer<typeof preferencesFormSchema>) {
    toast.success("Preferences updated successfully");
    console.log(values);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys Configuration</CardTitle>
              <CardDescription>
                Add your API keys to connect with AI providers. Your keys are securely encrypted.
              </CardDescription>
            </CardHeader>
            <Form {...apiKeysForm}>
              <form onSubmit={apiKeysForm.handleSubmit(onApiKeysSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={apiKeysForm.control}
                    name="openaiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="sk-..." 
                            {...field} 
                            type="password" 
                          />
                        </FormControl>
                        <FormDescription>
                          Required for using GPT models
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={apiKeysForm.control}
                    name="anthropicApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anthropic API Key</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="sk_ant-..." 
                            {...field} 
                            type="password" 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: For using Claude models
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={apiKeysForm.control}
                    name="stabilityAiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stability AI Key</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="sk-..." 
                            {...field} 
                            type="password" 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: For image generation features
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save API Keys</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage & Billing</CardTitle>
              <CardDescription>
                View your current usage and manage billing settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">Pro Plan ($29/month)</p>
                </div>
                <Button variant="outline">Change Plan</Button>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Usage This Month</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-muted-foreground">API Calls</p>
                    <p className="text-2xl font-bold">12,405</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-muted-foreground">Tokens Used</p>
                    <p className="text-2xl font-bold">1.2M</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-muted-foreground">Cost</p>
                    <p className="text-2xl font-bold">$18.72</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize how you interact with the AI Studio platform.
              </CardDescription>
            </CardHeader>
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Model Settings</h3>
                    <FormField
                      control={preferencesForm.control}
                      name="defaultModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default AI Model</FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Button
                              type="button"
                              variant={field.value === "gpt-4" ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => field.onChange("gpt-4")}
                            >
                              GPT-4
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "gpt-3.5-turbo" ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => field.onChange("gpt-3.5-turbo")}
                            >
                              GPT-3.5
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "claude-2" ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => field.onChange("claude-2")}
                            >
                              Claude 2
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "custom" ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => field.onChange("custom")}
                            >
                              Custom
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    
                    <FormField
                      control={preferencesForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive updates about your agents via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={preferencesForm.control}
                      name="usageAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Usage Alerts</FormLabel>
                            <FormDescription>
                              Get notified when approaching usage limits
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Preferences</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
