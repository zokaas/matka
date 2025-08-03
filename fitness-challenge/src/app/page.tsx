"use client";

import { useAuth } from "./contexts/AuthContext";
import TourDeFranceLogin from "./components/LoginScreen";
import ChallengeClosedPage from "./components/ChallengeClosedPage";
import Dashboard from "./components/Dashboard";

const CHALLENGE_CLOSED = false; // Set to true if you want to close the challenge

export default function Home() {
  const { isLoggedIn } = useAuth();

  if (CHALLENGE_CLOSED) {
    return <ChallengeClosedPage />;
  }

  if (!isLoggedIn) {
    return <TourDeFranceLogin />;
  }

  return (
    <>
      <Dashboard />
      <div className="p-4"></div>
    </>
  );
}