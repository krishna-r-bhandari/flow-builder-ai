// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   Line,
//   Bar,
//   Pie,
//   LineChart,
//   BarChart,
//   PieChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// // Dummy data for our charts
// const usageData = [
//   { name: "Jan", apiCalls: 3000, tokens: 50000 },
//   { name: "Feb", apiCalls: 4000, tokens: 60000 },
//   { name: "Mar", apiCalls: 3500, tokens: 55000 },
//   { name: "Apr", apiCalls: 5000, tokens: 75000 },
//   { name: "May", apiCalls: 6000, tokens: 90000 },
//   { name: "Jun", apiCalls: 7500, tokens: 110000 },
//   { name: "Jul", apiCalls: 7000, tokens: 105000 },
// ];

// const agentPerformanceData = [
//   { agent: "Customer Support Bot", accuracy: 96, speed: 98, satisfaction: 92 },
//   {
//     agent: "Data Analysis Assistant",
//     accuracy: 94,
//     speed: 85,
//     satisfaction: 88,
//   },
//   { agent: "Email Summarizer", accuracy: 91, speed: 97, satisfaction: 85 },
//   { agent: "Sales Copilot", accuracy: 89, speed: 90, satisfaction: 94 },
// ];

// const dataDistribution = [
//   { name: "Text Generation", value: 45 },
//   { name: "Classification", value: 25 },
//   { name: "Summarization", value: 15 },
//   { name: "Translation", value: 10 },
//   { name: "Other", value: 5 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DD9"];

// const DashboardAnalytics = () => {
//   const [timeframe, setTimeframe] = useState("30d");

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-bold tracking-tight">Analytics</h2>
//         <p className="text-muted-foreground mt-2 text-sm">
//           Monitor performance and usage of your AI agents.
//         </p>
//       </div>

//       <Tabs defaultValue="usage" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="usage">Usage</TabsTrigger>
//           <TabsTrigger value="performance">Performance</TabsTrigger>
//           <TabsTrigger value="distribution">Task Distribution</TabsTrigger>
//         </TabsList>

//         <TabsContent value="usage" className="space-y-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>API Usage</CardTitle>
//                 <CardDescription>
//                   Total API calls and tokens over time
//                 </CardDescription>
//               </div>
//               <Tabs value={timeframe} onValueChange={setTimeframe}>
//                 <TabsList className="h-8">
//                   <TabsTrigger value="7d" className="px-3 text-xs">
//                     7D
//                   </TabsTrigger>
//                   <TabsTrigger value="30d" className="px-3 text-xs">
//                     30D
//                   </TabsTrigger>
//                   <TabsTrigger value="90d" className="px-3 text-xs">
//                     90D
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </CardHeader>
//             <CardContent>
//               <div className="h-full">
//                 <ChartContainer
//                   config={{
//                     apiCalls: { label: "API Calls", color: "#4ade80" },
//                     tokens: { label: "Tokens", color: "#60a5fa" },
//                   }}
//                 >
//                   <LineChart data={usageData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis yAxisId="left" />
//                     <YAxis yAxisId="right" orientation="right" />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Legend />
//                     <Line
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="apiCalls"
//                       name="API Calls"
//                       stroke="var(--color-apiCalls)"
//                       activeDot={{ r: 8 }}
//                     />
//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="tokens"
//                       name="Tokens"
//                       stroke="var(--color-tokens)"
//                     />
//                   </LineChart>
//                 </ChartContainer>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between text-sm text-muted-foreground">
//               <div>
//                 Total API calls this period: <b>36,000</b>
//               </div>
//               <div>
//                 Total tokens this period: <b>545,000</b>
//               </div>
//             </CardFooter>
//           </Card>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             {[
//               { title: "Total API Calls", value: "36,000", change: "+12.5%" },
//               { title: "Total Tokens", value: "545,000", change: "+18.2%" },
//               { title: "Avg. Response Time", value: "820ms", change: "-5.3%" },
//               { title: "Completion Rate", value: "99.8%", change: "+0.2%" },
//             ].map((stat, index) => (
//               <Card key={index}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">
//                     {stat.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                   <p
//                     className={`text-xs ${
//                       stat.change.startsWith("+")
//                         ? "text-green-500"
//                         : "text-red-500"
//                     }`}
//                   >
//                     {stat.change} from last period
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="performance" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Agent Performance Comparison</CardTitle>
//               <CardDescription>
//                 Accuracy, speed, and user satisfaction metrics
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[350px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={agentPerformanceData}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="agent" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="accuracy" name="Accuracy %" fill="#60a5fa" />
//                     <Bar dataKey="speed" name="Speed Score" fill="#4ade80" />
//                     <Bar
//                       dataKey="satisfaction"
//                       name="Satisfaction %"
//                       fill="#f87171"
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="distribution" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Task Distribution</CardTitle>
//               <CardDescription>
//                 Breakdown of task types across all agents
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col md:flex-row">
//                 <div className="w-full md:w-1/2 h-[350px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={dataDistribution}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={({ name, percent }) =>
//                           `${name}: ${(percent * 100).toFixed(0)}%`
//                         }
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                       >
//                         {dataDistribution.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="w-full md:w-1/2 flex items-center">
//                   <div className="grid grid-cols-1 gap-2 w-full md:pl-4">
//                     {dataDistribution.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between"
//                       >
//                         <div className="flex items-center">
//                           <div
//                             className="w-3 h-3 mr-2 rounded-sm"
//                             style={{
//                               backgroundColor: COLORS[index % COLORS.length],
//                             }}
//                           />
//                           <span>{item.name}</span>
//                         </div>
//                         <span className="font-medium">{item.value}%</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default DashboardAnalytics;

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Enhanced dummy data with different timeframes
const usageData = {
  "7d": [
    { name: "May 12", apiCalls: 1200, tokens: 18000 },
    { name: "May 13", apiCalls: 950, tokens: 14500 },
    { name: "May 14", apiCalls: 1100, tokens: 16800 },
    { name: "May 15", apiCalls: 1300, tokens: 19500 },
    { name: "May 16", apiCalls: 1450, tokens: 21800 },
    { name: "May 17", apiCalls: 1050, tokens: 15700 },
    { name: "May 18", apiCalls: 980, tokens: 14700 },
  ],
  "30d": [
    { name: "Apr 19", apiCalls: 3000, tokens: 50000 },
    { name: "Apr 24", apiCalls: 4000, tokens: 60000 },
    { name: "Apr 29", apiCalls: 3500, tokens: 55000 },
    { name: "May 4", apiCalls: 5000, tokens: 75000 },
    { name: "May 9", apiCalls: 6000, tokens: 90000 },
    { name: "May 14", apiCalls: 7500, tokens: 110000 },
    { name: "May 18", apiCalls: 7000, tokens: 105000 },
  ],
  "90d": [
    { name: "Feb", apiCalls: 12000, tokens: 180000 },
    { name: "Mar", apiCalls: 15000, tokens: 225000 },
    { name: "Apr", apiCalls: 18000, tokens: 270000 },
    { name: "May", apiCalls: 21000, tokens: 315000 },
  ],
};

const totals = {
  "7d": { apiCalls: 8030, tokens: 121000 },
  "30d": { apiCalls: 36000, tokens: 545000 },
  "90d": { apiCalls: 66000, tokens: 990000 },
};

const comparisons = {
  "7d": {
    apiCalls: "+8.2%",
    tokens: "+11.5%",
    response: "-3.1%",
    completion: "+0.1%",
  },
  "30d": {
    apiCalls: "+12.5%",
    tokens: "+18.2%",
    response: "-5.3%",
    completion: "+0.2%",
  },
  "90d": {
    apiCalls: "+22.7%",
    tokens: "+25.8%",
    response: "-8.7%",
    completion: "+0.5%",
  },
};

// Different agent performance datasets
const agentPerformanceData = {
  default: [
    {
      agent: "Customer Support Bot",
      accuracy: 96,
      speed: 98,
      satisfaction: 92,
    },
    {
      agent: "Data Analysis Assistant",
      accuracy: 94,
      speed: 85,
      satisfaction: 88,
    },
    { agent: "Email Summarizer", accuracy: 91, speed: 97, satisfaction: 85 },
    { agent: "Sales Copilot", accuracy: 89, speed: 90, satisfaction: 94 },
  ],
  extended: [
    {
      agent: "Customer Support Bot",
      accuracy: 96,
      speed: 98,
      satisfaction: 92,
    },
    {
      agent: "Data Analysis Assistant",
      accuracy: 94,
      speed: 85,
      satisfaction: 88,
    },
    { agent: "Email Summarizer", accuracy: 91, speed: 97, satisfaction: 85 },
    { agent: "Sales Copilot", accuracy: 89, speed: 90, satisfaction: 94 },
    { agent: "Content Generator", accuracy: 93, speed: 89, satisfaction: 91 },
    { agent: "Code Assistant", accuracy: 97, speed: 82, satisfaction: 89 },
  ],
};

// Different task distribution datasets
const dataDistribution = {
  default: [
    { name: "Text Generation", value: 45 },
    { name: "Classification", value: 25 },
    { name: "Summarization", value: 15 },
    { name: "Translation", value: 10 },
    { name: "Other", value: 5 },
  ],
  detailed: [
    { name: "Text Generation", value: 35 },
    { name: "Classification", value: 20 },
    { name: "Summarization", value: 15 },
    { name: "Translation", value: 10 },
    { name: "Question Answering", value: 8 },
    { name: "Code Generation", value: 7 },
    { name: "Other", value: 5 },
  ],
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DD9",
  "#FF6384",
  "#36A2EB",
];

const DashboardAnalytics = () => {
  const [timeframe, setTimeframe] = useState("30d");
  const [agentDataset, setAgentDataset] = useState("default");
  const [distributionDataset, setDistributionDataset] = useState("default");

  // Calculate current data based on selected timeframe
  const currentUsageData = usageData[timeframe];
  const currentTotals = totals[timeframe];
  const currentComparisons = comparisons[timeframe];
  const currentAgentData = agentPerformanceData[agentDataset];
  const currentDistributionData = dataDistribution[distributionDataset];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-2 text-sm">
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
              <div className="flex flex-col space-y-2">
                <CardTitle>API Usage</CardTitle>
                <CardDescription>
                  Total API calls and tokens over time
                </CardDescription>
              </div>
              <Tabs value={timeframe} onValueChange={setTimeframe}>
                <TabsList className="h-8">
                  <TabsTrigger value="7d" className="px-3 text-xs">
                    7D
                  </TabsTrigger>
                  <TabsTrigger value="30d" className="px-3 text-xs">
                    30D
                  </TabsTrigger>
                  <TabsTrigger value="90d" className="px-3 text-xs">
                    90D
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-full">
                <ChartContainer
                  config={{
                    apiCalls: { label: "API Calls", color: "#4ade80" },
                    tokens: { label: "Tokens", color: "#60a5fa" },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentUsageData}>
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
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>
                Total API calls this period:{" "}
                <b>{currentTotals.apiCalls.toLocaleString()}</b>
              </div>
              <div>
                Total tokens this period:{" "}
                <b>{currentTotals.tokens.toLocaleString()}</b>
              </div>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total API Calls",
                value: currentTotals.apiCalls.toLocaleString(),
                change: currentComparisons.apiCalls,
              },
              {
                title: "Total Tokens",
                value: currentTotals.tokens.toLocaleString(),
                change: currentComparisons.tokens,
              },
              {
                title: "Avg. Response Time",
                value: "820ms",
                change: currentComparisons.response,
              },
              {
                title: "Completion Rate",
                value: "99.8%",
                change: currentComparisons.completion,
              },
            ].map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p
                    className={`text-xs ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change} from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-2">
                <CardTitle>Agent Performance Comparison</CardTitle>
                <CardDescription>
                  Accuracy, speed, and user satisfaction metrics
                </CardDescription>
              </div>
              <Tabs value={agentDataset} onValueChange={setAgentDataset}>
                <TabsList className="h-8">
                  <TabsTrigger value="default" className="px-3 text-xs">
                    Top 4
                  </TabsTrigger>
                  <TabsTrigger value="extended" className="px-3 text-xs">
                    All Agents
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentAgentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="#60a5fa" />
                    <Bar dataKey="speed" name="Speed Score" fill="#4ade80" />
                    <Bar
                      dataKey="satisfaction"
                      name="Satisfaction %"
                      fill="#f87171"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Performance data updated daily. Last updated: May 18, 2025
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-2">
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>
                  Breakdown of task types across all agents
                </CardDescription>
              </div>
              <Tabs
                value={distributionDataset}
                onValueChange={setDistributionDataset}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="default" className="px-3 text-xs">
                    Standard
                  </TabsTrigger>
                  <TabsTrigger value="detailed" className="px-3 text-xs">
                    Detailed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {currentDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex items-center">
                  <div className="grid grid-cols-1 gap-3 w-full md:pl-8">
                    {currentDistributionData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 mr-3 rounded-sm"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Based on{" "}
              {timeframe === "7d"
                ? "7,860"
                : timeframe === "30d"
                ? "36,520"
                : "65,740"}{" "}
              tasks processed during this period
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalytics;
