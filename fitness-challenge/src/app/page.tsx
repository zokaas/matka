"use client";

import QuickAccess from "./components/QuickAccess";
// import Map from "./components/Map";
export default function Home() {

  return (
    <>
      <QuickAccess />
      <div className="p-4">
        {/* <Map totalKm={totalKm} /> */}
      </div>
    </>
  );
}
