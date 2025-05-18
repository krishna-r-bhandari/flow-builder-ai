
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const apiKeySchema = z.object({
  openaiKey: z.string().min(1, "OpenAI API key is required"),
  anthropicKey: z.string().optional(),
  stabilityKey: z.string().optional(),
  notificationsEnabled: z.boolean().default(true),
  usageAlerts: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

const DashboardSettings = () => {
  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      openaiKey: "",
      anthropicKey: "",
      stabilityKey: "",
      notificationsEnabled: true,
      usageAlerts: true,
      theme: "system",
    },
  });

  function onSubmit(data: ApiKeyFormValues) {
    toast.success("Settings saved successfully!");
    console.log(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Configure your account preferences and API integrations.
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Integration</CardTitle>
                  <CardDescription>
                    Connect your AI service providers to power your agents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="openaiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="sk-..." {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          Required for GPT-4 and other OpenAI models.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="anthropicKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anthropic API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="sk-ant-..." {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          Optional: Used for Claude models.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stabilityKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stability AI API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="sk-..." {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          Optional: Required for image generation capabilities.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save API Keys</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>
                    Customize your dashboard experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Theme</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="light" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Light
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="dark" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Dark
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="system" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                System
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="notificationsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications about agent activities.
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
                    control={form.control}
                    name="usageAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Usage Alerts
                          </FormLabel>
                          <FormDescription>
                            Get notified when you approach API usage limits.
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
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Current Plan</h4>
                        <p className="text-sm text-muted-foreground">Pro Plan ($49/month)</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Payment Method</h4>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center">
                        <div className="h-8 w-12 rounded bg-muted mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">•••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 05/25</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Billing History</h4>
                    <div className="rounded-md border">
                      <div className="p-3 border-b flex justify-between text-sm font-medium">
                        <div>May 1, 2025</div>
                        <div>$49.00</div>
                      </div>
                      <div className="p-3 border-b flex justify-between text-sm font-medium">
                        <div>Apr 1, 2025</div>
                        <div>$49.00</div>
                      </div>
                      <div className="p-3 flex justify-between text-sm font-medium">
                        <div>Mar 1, 2025</div>
                        <div>$49.00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Download Invoices</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
