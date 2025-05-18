
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Line,
  Bar,
  Pie,
  LineChart,
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Dummy data for our charts
const usageData = [
  { name: 'Jan', apiCalls: 3000, tokens: 50000 },
  { name: 'Feb', apiCalls: 4000, tokens: 60000 },
  { name: 'Mar', apiCalls: 3500, tokens: 55000 },
  { name: 'Apr', apiCalls: 5000, tokens: 75000 },
  { name: 'May', apiCalls: 6000, tokens: 90000 },
  { name: 'Jun', apiCalls: 7500, tokens: 110000 },
  { name: 'Jul', apiCalls: 7000, tokens: 105000 },
];

const agentPerformanceData = [
  { agent: 'Customer Support Bot', accuracy: 96, speed: 98, satisfaction: 92 },
  { agent: 'Data Analysis Assistant', accuracy: 94, speed: 85, satisfaction: 88 },
  { agent: 'Email Summarizer', accuracy: 91, speed: 97, satisfaction: 85 },
  { agent: 'Sales Copilot', accuracy: 89, speed: 90, satisfaction: 94 },
];

const dataDistribution = [
  { name: 'Text Generation', value: 45 },
  { name: 'Classification', value: 25 },
  { name: 'Summarization', value: 15 },
  { name: 'Translation', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DD9'];

const DashboardAnalytics = () => {
  const [timeframe, setTimeframe] = useState("30d");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-2">
          Monitor performance and usage of your AI agents.
        </p>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Task Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Total API calls and tokens over time</CardDescription>
              </div>
              <Tabs value={timeframe} onValueChange={setTimeframe}>
                <TabsList className="h-8">
                  <TabsTrigger value="7d" className="px-3 text-xs">7D</TabsTrigger>
                  <TabsTrigger value="30d" className="px-3 text-xs">30D</TabsTrigger>
                  <TabsTrigger value="90d" className="px-3 text-xs">90D</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ChartContainer
                  config={{
                    apiCalls: { label: "API Calls", color: "#4ade80" },
                    tokens: { label: "Tokens", color: "#60a5fa" },
                  }}
                >
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="apiCalls"
                      name="API Calls"
                      stroke="var(--color-apiCalls)"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone"
                      dataKey="tokens"
                      name="Tokens"
                      stroke="var(--color-tokens)"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>Total API calls this period: <b>36,000</b></div>
              <div>Total tokens this period: <b>545,000</b></div>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total API Calls", value: "36,000", change: "+12.5%" },
              { title: "Total Tokens", value: "545,000", change: "+18.2%" },
              { title: "Avg. Response Time", value: "820ms", change: "-5.3%" },
              { title: "Completion Rate", value: "99.8%", change: "+0.2%" },
            ].map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Comparison</CardTitle>
              <CardDescription>Accuracy, speed, and user satisfaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={agentPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="#60a5fa" />
                    <Bar dataKey="speed" name="Speed Score" fill="#4ade80" />
                    <Bar dataKey="satisfaction" name="Satisfaction %" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>Breakdown of task types across all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex items-center">
                  <div className="grid grid-cols-1 gap-2 w-full md:pl-4">
                    {dataDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-2 rounded-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalytics;
