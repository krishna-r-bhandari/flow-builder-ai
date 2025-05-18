import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, User } from "lucide-react";

// Dummy agent data for our home page
const dummyAgents = [
  {
    id: "1",
    name: "Customer Support Bot",
    description:
      "Handles customer inquiries and support tickets automatically.",
    status: "active",
    lastUpdated: "2025-05-15",
    usageCount: 1423,
  },
  {
    id: "2",
    name: "Data Analysis Assistant",
    description: "Analyzes CSV data and generates insights and visualizations.",
    status: "active",
    lastUpdated: "2025-05-12",
    usageCount: 861,
  },
  {
    id: "3",
    name: "Email Summarizer",
    description: "Summarizes long email threads into actionable items.",
    status: "inactive",
    lastUpdated: "2025-05-08",
    usageCount: 529,
  },
  {
    id: "4",
    name: "Sales Copilot",
    description: "Generates personalized sales outreach and follow-up emails.",
    status: "active",
    lastUpdated: "2025-05-17",
    usageCount: 752,
  },
];

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">My AI Agents</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage and monitor your AI agents from one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyAgents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{agent.name}</CardTitle>
                <Badge
                  variant={agent.status === "active" ? "default" : "outline"}
                >
                  {agent.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {agent.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>Usage count</div>
                <div>{agent.usageCount.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <div>Last updated</div>
                <div>{agent.lastUpdated}</div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
              >
                View Details
                <ArrowRight size={14} />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Create a new agent</h3>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Build a custom AI agent to automate your workflows.
          </p>
          <Link to="/dashboard/create-agent">
            <Button variant="outline">Get Started</Button>
          </Link>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Agents</span>
                <span className="text-lg font-medium">
                  {dummyAgents.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Agents</span>
                <span className="text-lg font-medium">
                  {dummyAgents.filter((a) => a.status === "active").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Total Interactions
                </span>
                <span className="text-lg font-medium">
                  {dummyAgents
                    .reduce((sum, agent) => sum + agent.usageCount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  agent: "Customer Support Bot",
                  action: "Responded to a ticket",
                  time: "10 min ago",
                },
                {
                  agent: "Data Analysis Assistant",
                  action: "Generated a report",
                  time: "45 min ago",
                },
                {
                  agent: "Sales Copilot",
                  action: "Drafted 3 emails",
                  time: "1 hour ago",
                },
                {
                  agent: "Email Summarizer",
                  action: "Summarized 2 threads",
                  time: "2 hours ago",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-3">
                    <User size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.agent}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
