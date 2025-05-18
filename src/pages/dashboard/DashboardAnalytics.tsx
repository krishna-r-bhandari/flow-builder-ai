
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Dummy data for API usage
const apiUsageData = [
  { date: "Jan 1", requests: 400 },
  { date: "Jan 2", requests: 300 },
  { date: "Jan 3", requests: 520 },
  { date: "Jan 4", requests: 450 },
  { date: "Jan 5", requests: 700 },
  { date: "Jan 6", requests: 650 },
  { date: "Jan 7", requests: 800 },
];

// Dummy data for API response time
const responseTimeData = [
  { date: "Jan 1", time: 120 },
  { date: "Jan 2", time: 132 },
  { date: "Jan 3", time: 101 },
  { date: "Jan 4", time: 134 },
  { date: "Jan 5", time: 90 },
  { date: "Jan 6", time: 110 },
  { date: "Jan 7", time: 105 },
];

// Dummy data for agent usage
const agentUsageData = [
  { name: "Customer Support", value: 400 },
  { name: "Data Analysis", value: 300 },
  { name: "Content Creation", value: 200 },
  { name: "Research", value: 150 },
];

// Dummy data for model distribution
const modelDistributionData = [
  { name: "GPT-4", value: 65 },
  { name: "GPT-3.5", value: 25 },
  { name: "Claude", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// ChartCard component for reuse
const ChartCard = ({ title, description, children }: { 
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-2">
      <div className="h-80">
        {children}
      </div>
    </CardContent>
  </Card>
);

const DashboardAnalytics = () => {
  const chartConfig = {
    apiUsage: {
      label: "API Usage",
      theme: {
        light: "#0088FE",
        dark: "#0088FE",
      },
    },
    responseTime: {
      label: "Response Time",
      theme: {
        light: "#00C49F",
        dark: "#00C49F",
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="API Usage" 
          description="Total API requests over the last 7 days"
        >
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="var(--color-apiUsage)" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
        
        <ChartCard 
          title="Response Time" 
          description="Average response time in ms over the last 7 days"
        >
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="var(--color-responseTime)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="Response Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
        
        <ChartCard 
          title="Agent Usage" 
          description="Distribution of usage across different agents"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Requests" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard 
          title="Model Distribution" 
          description="Usage breakdown by AI model type"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={modelDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {modelDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
