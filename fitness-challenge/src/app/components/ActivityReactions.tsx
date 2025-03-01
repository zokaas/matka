"use client";

import React, { useState, useEffect } from "react";

interface ReactionsProps {
  activityId: number;
}

interface Reaction {
  type: string;
  count: number;
}

const REACTION_TYPES = [
  { type: "like", emoji: "👍" },
  { type: "support", emoji: "💪" },
  { type: "celebrate", emoji: "🎉" },
  { type: "inspire", emoji: "✨" },
  { type: "focus", emoji: "🎯" },
  { type: "determination", emoji: "🔥" },
  { type: "teamwork", emoji: "🤝" },
  { type: "global", emoji: "🌍" },
  { type: "love", emoji: "💖" },
  { type: "speed", emoji: "🏃‍♀️" },
  { type: "strong", emoji: "🏋️‍♀️" },
];

const ActivityReactions: React.FC<ReactionsProps> = ({ activityId }) => {
  const [reactions, setReactions] = useState<{ [key: string]: boolean }>({});
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = "https://matka-zogy.onrender.com";

  // Fetch existing reactions when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${backendUrl}/activity/${activityId}/reactions`
        );

        // Log full response for debugging
        const responseText = await response.text();
        console.log("Reactions fetch response:", responseText);

        let reactionData: Reaction[];
        try {
          reactionData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error(`Failed to parse response: ${responseText}`);
        }

        // Initialize reactions and counts from backend
        const initialReactions: { [key: string]: boolean } = {};
        const initialCounts: { [key: string]: number } = {};

        // Ensure all reaction types are initialized
        REACTION_TYPES.forEach(({ type }) => {
          initialReactions[type] = false;
          initialCounts[type] = 0;
        });

        // Update counts from backend data
        if (Array.isArray(reactionData)) {
          reactionData.forEach(({ type, count }) => {
            if (type && count !== undefined) {
              initialCounts[type] = count;
            }
          });
        }

        setReactions(initialReactions);
        setCounts(initialCounts);
      } catch (error) {
        console.error("Detailed error fetching reactions:", error);

        // Initialize empty state if fetch fails
        const initialReactions: { [key: string]: boolean } = {};
        const initialCounts: { [key: string]: number } = {};

        REACTION_TYPES.forEach(({ type }) => {
          initialReactions[type] = false;
          initialCounts[type] = 0;
        });

        setReactions(initialReactions);
        setCounts(initialCounts);

        setError(
          error instanceof Error
            ? error.message
            : "Reaktioiden lataaminen epäonnistui"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactions();
  }, [activityId]);

  const toggleReaction = async (reactionType: string) => {
    try {
      // Determine the action based on current state
      const action = reactions[reactionType] ? "remove" : "add";

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
      setError(null);

      // Send reaction to backend
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: reactionType,
            action,
          }),
        }
      );

      // Log full response for debugging
      const responseText = await response.text();
      console.log("Reaction toggle response:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(`Failed to parse response: ${responseText}`);
      }

      if (!response.ok || !responseData.success) {
        // If backend call fails, revert local state
        throw new Error(
          responseData.message || "Reaktion päivittäminen epäonnistui"
        );
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);

      // Revert local state on error
      setReactions(reactions);
      setCounts(counts);

      // Set user-friendly error message
      setError(
        error instanceof Error
          ? error.message
          : "Reaktion päivittämisessä tapahtui virhe"
      );
    }
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mt-3 opacity-50">
        {REACTION_TYPES.map(({ type, emoji }) => (
          <div
            key={type}
            className="flex items-center space-x-1 px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-600"
          >
            <span>{emoji}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex flex-wrap gap-2 mt-3">
        {REACTION_TYPES.map(({ type, emoji }) => (
          <button
            key={type}
            onClick={() => toggleReaction(type)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors ${
              reactions[type]
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            <span>{emoji}</span>
            {(counts[type] || 0) > 0 && (
              <span className="bg-white ml-1 rounded-full px-1.5 text-xs font-bold">
                {counts[type]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityReactions;
