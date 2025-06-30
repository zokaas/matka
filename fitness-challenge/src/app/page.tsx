"use client";

import QuickAccess from "./components/QuickAccess";
import ChallengeClosedPage from "./components/ChallengeClosedPage";

const CHALLENGE_CLOSED = true; // Muuta false jos haluat avata uudelleen

export default function Home() {
  if (CHALLENGE_CLOSED) {
    return <ChallengeClosedPage />;
  }

  return (
    <>
      <QuickAccess />
      <div className="p-4"></div>
    </>
  );
}
