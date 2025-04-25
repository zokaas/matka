"use client";

import ProgressDashboard from "@/app/components/ProgressDashboard";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <ProgressDashboard />
    </div>
  );
}