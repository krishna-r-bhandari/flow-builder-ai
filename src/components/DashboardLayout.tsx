
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNav from "./DashboardNav";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardNav />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
