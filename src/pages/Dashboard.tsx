import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart, Settings, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If we're at the dashboard root, navigate to home
  React.useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/home");
    }
  }, [location.pathname, navigate]);

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard/home" },
    { icon: BarChart, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "h-full bg-sidebar-background border-r border-border transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 h-16 flex items-center justify-between border-b border-border">
          {!isSidebarCollapsed && (
            <span className="text-lg font-semibold text-sidebar-primary">
              AI Dashboard
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-primary"
          >
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <div className="py-4">
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm hover:bg-sidebar-accent",
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-primary font-medium"
                        : "text-sidebar-foreground",
                      isSidebarCollapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <item.icon size={20} />
                    {!isSidebarCollapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
          <h1 className="text-lg font-medium">
            {location.pathname.includes("home") && "Dashboard"}
            {location.pathname.includes("analytics") && "Analytics"}
            {location.pathname.includes("settings") && "Settings"}
            {location.pathname.includes("create-agent") && "Create Agent"}
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard/create-agent"
              className="flex items-center text-sm px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" /> Create Agent
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
