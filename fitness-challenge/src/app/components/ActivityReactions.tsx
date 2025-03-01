"use client";

import React, { useState, useEffect } from "react";
import { Reaction } from "../types/types";

interface ReactionsProps {
  activityId: number;
}

const REACTION_TYPES = [
  { type: "like", emoji: "👍", label: "Tykkää" },
  { type: "support", emoji: "💪", label: "Kannusta" },
  { type: "celebrate", emoji: "🎉", label: "Juhli" },
];

const ActivityReactions: React.FC<ReactionsProps> = ({ activityId }) => {
  const [reactions, setReactions] = useState<{ [key: string]: boolean }>({});
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  const backendUrl = "https://matka-zogy.onrender.com";

  // Fetch existing reactions when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
const response = await fetch(`${backendUrl}/activity/${activityId}/reactions`);

        if (response.ok) {
          const reactionData: Reaction[] = await response.json();

          // Initialize reactions and counts from backend
          const initialReactions: { [key: string]: boolean } = {};
          const initialCounts: { [key: string]: number } = {};

          reactionData.forEach(({ type, count }) => {
            initialReactions[type] = false;
            initialCounts[type] = count;
          });

          setReactions(initialReactions);
          setCounts(initialCounts);
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [activityId]);

  const toggleReaction = async (reactionType: string) => {
    try {
      // Optimistically update UI
      const newReactions = { ...reactions };
      const newCounts = { ...counts };

      // Toggle the reaction
      newReactions[reactionType] = !newReactions[reactionType];
      newCounts[reactionType] = newReactions[reactionType]
        ? (newCounts[reactionType] || 0) + 1
        : Math.max(0, (newCounts[reactionType] || 0) - 1);

      setReactions(newReactions);
      setCounts(newCounts);

      // Send reaction to backend
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: reactionType }),
        }
      );

      if (!response.ok) {
        // If backend call fails, revert local state
        setReactions(reactions);
        setCounts(counts);
        console.error("Failed to update reaction");
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
      // Revert local state on error
      setReactions(reactions);
      setCounts(counts);
    }
  };

  return (
    <div className="flex space-x-2 mt-3">
      {REACTION_TYPES.map(({ type, emoji, label }) => (
        <button
          key={type}
          onClick={() => toggleReaction(type)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            reactions[type]
              ? "bg-purple-100 text-purple-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span>{emoji}</span>
          <span>{label}</span>
          {(counts[type] || 0) > 0 && (
            <span className="bg-white ml-1 rounded-full px-1.5 text-xs font-bold">
              {counts[type]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ActivityReactions;
