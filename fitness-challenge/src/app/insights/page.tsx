"use client";
import InsightsWithTabs from "../components/InsightsWithTabs";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/app/hooks/useTheme";

// 🔧 MANUAL TOGGLE FLAG - Change this to control insights page access
const INSIGHTS_ENABLED = false; // Set to true to enable insights page

export default function InsightsPage() {
  const { colors, t } = useTheme();

  // If insights are disabled, show closed message
  if (!INSIGHTS_ENABLED) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: `linear-gradient(to br, ${colors.background}, #fffbeb)` 
        }}
      >
        <div 
          className="rounded-2xl p-6 sm:p-8 text-center shadow-xl max-w-sm sm:max-w-md w-full mx-4 border-2"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.primary,
            color: colors.text 
          }}
        >
          <Lock 
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" 
            style={{ color: colors.primary }} 
          />
          <h2 
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            📊 Tilastot suljettu
          </h2>
          <p 
            className="mb-6 text-sm sm:text-base"
            style={{ color: colors.mutedText }}
          >
            Tilastosivut aukeavat kun haaste on ollut käynnissä viikon. Tsemppiä matkaan!
          </p>
          <Link 
            href="/" 
            className="px-6 py-3 rounded-lg font-medium transition-colors inline-block w-full sm:w-auto"
            style={{ 
              backgroundColor: colors.primary, 
              color: colors.background 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {t.ui.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  // If insights are enabled, show the normal page
  return <InsightsWithTabs />;
}