"use client";

import { useState, useEffect } from "react";
import { useGlobalState } from "../context/GlobalStateProvider";

export const useMapData = () => {
  const { state, refreshTotalKm } = useGlobalState();
  const { totalKm, loading, error } = state;

  // Only refresh data if needed
  useEffect(() => {
    if (!loading.totalKm && !state.lastUpdated.totalKm) {
      refreshTotalKm();
    }
  }, [loading.totalKm, refreshTotalKm, state.lastUpdated.totalKm]);

  return {
    totalKm,
    loading: loading.totalKm,
    error: error.totalKm,
  };
};
