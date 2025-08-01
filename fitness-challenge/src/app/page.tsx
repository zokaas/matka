"use client";

import { useAuth } from "./contexts/AuthContext";
import TourDeFranceDashboard from "./components/TourDeFranceDashboard";
import TourDeFranceLogin from "./components/TourDeFranceLogin";
import ChallengeClosedPage from "./components/ChallengeClosedPage";

const CHALLENGE_CLOSED = true; // Set to true if you want to close the challenge

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
      <TourDeFranceDashboard />
      <div className="p-4"></div>
    </>
  );
}