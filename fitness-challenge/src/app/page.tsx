"use client";

import { useAuth } from "./contexts/AuthContext";
import MountainClimbingDashboard from "./components/MountainClimbingDashboard";
import MountainLogin from "./components/MountainLogin";
import ChallengeClosedPage from "./components/ChallengeClosedPage";

const CHALLENGE_CLOSED = true; // Set to true if you want to close the challenge

export default function Home() {
  const { isLoggedIn } = useAuth();

  if (CHALLENGE_CLOSED) {
    return <ChallengeClosedPage />;
  }

  if (!isLoggedIn) {
    return <MountainLogin />;
  }

  return (
    <>
      <MountainClimbingDashboard />
      <div className="p-4"></div>
    </>
  );
}