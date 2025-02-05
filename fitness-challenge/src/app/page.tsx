"use client";

import { useState, useEffect } from "react";
import QuickAccess from "./components/QuickAccess";
// import Map from "./components/Map";


export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalKm, setTotalKm] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:5001/total-kilometers")
      .then((res) => res.json())
      .then((data) => {
        setTotalKm(data.totalKm);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <>
      <QuickAccess />
      <div className="p-4">
        {/* <Map totalKm={totalKm} /> */}
      </div>
    </>
  );
}
