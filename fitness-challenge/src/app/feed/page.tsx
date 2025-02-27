"use client";

import { useState } from "react";
import ActivityFeedPage from "@/app/components/ActivityFeedPage";

export default function FeedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-gray-700">TULOSSA PIAN 🚀</h1>
      <p className="text-gray-500 mt-2">
        Tämä sivu on vielä kehityksessä. Pysy kuulolla!
      </p>
    </div>
  );

{/* <ActivityFeedPage />; */}
}

