import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, BrainCircuit, Zap, Shield, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-4 px-6 md:px-10 sticky top-0 z-50 backdrop-blur-lg bg-background/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit size={28} className="text-primary" />
            <span className="font-bold text-xl md:text-2xl">AI Agent Builder</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">How It Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" className="hidden md:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="default" className="flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered Text without Image */}
      <section className="py-16 md:py-24 px-6 md:px-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
            Build <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">AI Agents</span> Without Writing Code
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, deploy, and manage custom AI agents for your business with our intuitive visual builder. No technical expertise required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="flex items-center gap-2 h-12 px-6">
                <span>Start Building</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="h-12 px-6">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to create sophisticated AI agents without coding</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-10 h-10 text-primary" />,
                title: "Visual Agent Builder",
                description: "Drag and drop interface to design your agent's workflow and behavior patterns"
              },
              {
                icon: <Zap className="w-10 h-10 text-primary" />,
                title: "Instant Deployment",
                description: "Deploy your agents to production in seconds with one click"
              },
              {
                icon: <Shield className="w-10 h-10 text-primary" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and data protection for all your agents and workflows"
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Team Collaboration",
                description: "Work together with your team to build and improve agents"
              },
              {
                icon: <BrainCircuit className="w-10 h-10 text-primary" />,
                title: "Pre-built Templates",
                description: "Start with optimized templates for common use cases and customize as needed"
              },
              {
                icon: <ArrowRight className="w-10 h-10 text-primary" />,
                title: "Performance Analytics",
                description: "Track agent performance and optimize based on real usage data"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-md">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="text-lg text-muted-foreground">Create powerful AI agents in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Design Your Workflow",
                description: "Use our visual editor to map out your agent's decision-making process and connections to external tools."
              },
              {
                number: "02",
                title: "Configure Behavior",
                description: "Set up your agent's responses, actions, and integrate with your existing systems and APIs."
              },
              {
                number: "03",
                title: "Deploy & Monitor",
                description: "Launch your agent with one click and track its performance in real-time from your dashboard."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="mb-4 text-5xl font-bold text-primary/20">{step.number}</div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
                    <ArrowRight className="text-muted-foreground/20" size={30} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">Trusted by innovative companies around the world</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The AI Agent Builder has completely transformed how we handle customer support. Our response time decreased by 80% in the first month.",
                author: "Sarah Johnson",
                role: "CTO, TechCorp"
              },
              {
                quote: "We built a custom sales assistant that increased our conversion rate by 35%. The visual builder made it incredibly easy.",
                author: "Michael Chen",
                role: "VP of Sales, GrowthMetrics"
              },
              {
                quote: "I was able to create an AI agent that automates our entire content approval workflow without writing a single line of code.",
                author: "Alex Rivera",
                role: "Marketing Director, CreativeHub"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 relative">
                <div className="text-4xl text-primary absolute top-4 right-6">"</div>
                <p className="mb-6 pt-6 text-muted-foreground italic">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-500/80 opacity-90"></div>
          <div className="relative z-10 p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your First AI Agent?</h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Get started today and create your first AI agent in minutes. No credit card required.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Start Building Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6 md:px-10 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit size={24} className="text-primary" />
                <span className="font-bold text-lg">AI Agent Builder</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building the future of AI automation for businesses of all sizes.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Use Cases</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Tutorials</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 AI Agent Builder. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
