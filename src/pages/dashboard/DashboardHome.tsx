
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings, Sparkles, MessageSquare, BarChart2 } from "lucide-react";

// Dummy data for AI agents
const dummyAgents = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "Handles common customer inquiries and support tickets",
    interactions: 1452,
    accuracy: "94%",
    lastUsed: "2 hours ago",
    icon: MessageSquare,
  },
  {
    id: 2,
    name: "Data Analyst",
    description: "Analyzes and visualizes data from multiple sources",
    interactions: 837,
    accuracy: "98%",
    lastUsed: "Yesterday",
    icon: BarChart2,
  },
  {
    id: 3,
    name: "Content Creator",
    description: "Generates blog posts and marketing copy",
    interactions: 645,
    accuracy: "91%",
    lastUsed: "3 days ago",
    icon: Sparkles,
  },
];

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My AI Agents</h1>
        <Link to="/dashboard/create-agent">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Agent
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyAgents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-md bg-primary/10">
                  <agent.icon className="h-5 w-5 text-primary" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-2">{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Interactions</p>
                  <p className="font-medium">{agent.interactions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-medium">{agent.accuracy}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between text-xs text-muted-foreground">
              <span>Last used: {agent.lastUsed}</span>
              <Link to={`/dashboard/agent/${agent.id}`} className="text-primary hover:underline">
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
        
        {/* Create new agent card */}
        <Link to="/dashboard/create-agent" className="block">
          <Card className="border-dashed h-full flex flex-col items-center justify-center p-6 text-center hover:bg-accent/50 transition-colors">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg">Create New Agent</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Build a custom AI agent for your specific needs
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
