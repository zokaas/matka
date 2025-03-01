"use client";
import React, { useState, useEffect } from "react";
import { Reaction } from "../types/types";

interface ReactionsListProps {
  activityId: number;
}

const ReactionsList: React.FC<ReactionsListProps> = ({ activityId }) => {
  const [reactions, setReactions] = useState<{ [key: string]: number }>({});
  const backendUrl = "https://matka-zogy.onrender.com";

  useEffect(() => {
    const fetchReactions = async () => {
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/reactions`
      );
      if (!response.ok) return;
      const data: Reaction[] = await response.json();
      setReactions(
        Object.fromEntries(data.map(({ type, count }) => [type, count]))
      );
    };
    fetchReactions();
  }, [activityId]);

  return (
    <div className="flex gap-2">
      {Object.entries(reactions).map(([type, count]) => (
        <span
          key={type}
          className="px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-700"
        >
          {type} ({count})
        </span>
      ))}
    </div>
  );
};

export default ReactionsList;
