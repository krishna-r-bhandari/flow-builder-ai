
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Studio</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Build Custom AI Agents with Ease
            </h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              Create, deploy, and manage intelligent AI agents without writing a single line of code.
            </p>
            <Button size="lg" asChild>
              <Link to="/dashboard">Start Building Now</Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>No-Code Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  Create custom AI agents through an intuitive drag-and-drop interface.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Multiple AI Models</CardTitle>
                </CardHeader>
                <CardContent>
                  Choose from GPT-4, GPT-3.5, Claude, and more to power your agents.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Robust Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  Track performance, usage statistics, and optimize your agents.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-8">Ready to transform your business?</h3>
            <Button size="lg" asChild>
              <Link to="/dashboard">Access Dashboard</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2025 AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
