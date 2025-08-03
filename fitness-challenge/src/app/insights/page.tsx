"use client";
import InsightsWithTabs from "../components/InsightsWithTabs";
import { Lock } from "lucide-react";
import Link from "next/link";

// 🔧 MANUAL TOGGLE FLAG - Change this to control insights page access
const INSIGHTS_ENABLED = false; // Set to true to enable insights page

export default function InsightsPage() {
  // If insights are disabled, show closed message
  if (!INSIGHTS_ENABLED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-xl max-w-sm sm:max-w-md w-full mx-4 border-2 border-yellow-400">
          <Lock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl sm:text-2xl font-bold mb-4">📊 Tilastot suljettu</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Tilastosivut aukeavat kun haaste on ollut käynnissä viikon. Tsemppiä matkaan!
          </p>
          <Link 
            href="/" 
            className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-lg font-medium transition-colors text-black inline-block w-full sm:w-auto"
          >
            Takaisin etusivulle
          </Link>
        </div>
      </div>
    );
  }

  // If insights are enabled, show the normal page
  return <InsightsWithTabs />;
}