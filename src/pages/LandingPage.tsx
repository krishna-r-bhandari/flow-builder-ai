
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border h-16 flex items-center px-6 justify-between">
        <div className="font-semibold text-xl">AI Agent Builder</div>
        <div className="space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Create Custom AI Agents<br />Without Coding
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-[600px]">
          Build, deploy, and manage AI agents for your business needs with our intuitive drag-and-drop interface.
        </p>
        <div className="mt-10">
          <Link to="/dashboard">
            <Button size="lg">Open Dashboard</Button>
          </Link>
        </div>
      </main>
      
      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        © 2025 AI Agent Builder. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
