
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BarChart2, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const DashboardNav = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Mobile navigation */}
      <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b">
        <h1 className="text-xl font-bold">AI Studio</h1>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </Button>
      </div>

      {/* Sidebar for desktop, drawer for mobile */}
      <aside
        className={cn(
          "min-w-[240px] bg-card border-r p-4 flex flex-col h-screen transition-all duration-300",
          isMobileMenuOpen 
            ? "fixed inset-0 z-50 block min-w-full lg:static lg:min-w-[240px]" 
            : "hidden lg:block"
        )}
      >
        <div className="flex items-center mb-8 pl-2 hidden lg:flex">
          <h1 className="text-xl font-bold">AI Studio</h1>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              U
            </div>
            <div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardNav;
