"use client";

import React from "react";
import { useMapData } from "../hooks/useMapData";
import Map from "./Map"; // Import your original Map component

const MapWithGlobalState = () => {
  const { totalKm, loading, error } = useMapData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return <Map totalKm={totalKm} />;
};

export default MapWithGlobalState;
