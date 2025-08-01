"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../service/apiService";

interface ReactionsProps {
  activityId: number;
}

// Enhanced reaction types with more fitness and challenge-related options
const REACTION_EMOJI_MAP: Record<string, string> = {
  like: "👍",
  support: "💪",
  celebrate: "🎉",
  inspire: "✨",
  determination: "🔥",
  teamwork: "🤝",
  global: "🌍",
  love: "💖",
  speed: "🏃‍♀️",
  strong: "🏋️‍♀️",
  medal: "🥇",
  trophy: "🏆",
  bicycle: "🚴‍♀️",
  swimming: "🏊‍♀️",
  mountain: "⛰️",
  gym: "💯",
  highfive: "✋",
  clap: "👏",
  energy: "⚡",
  rocket: "🚀",
};

const ActivityReactions: React.FC<ReactionsProps> = ({ activityId }) => {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch reactions when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reactionData = await apiService.reaction.getReactions(activityId);

        console.log("Fetched Reactions:", reactionData);

        // Convert to count map
        const reactionCounts: Record<string, number> = {};
        reactionData.forEach(({ type, count }) => {
          reactionCounts[type] = count;
        });

        setReactions(reactionCounts);
      } catch (error) {
        console.error("Error fetching reactions:", error);
        setError("Failed to load reactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactions();
  }, [activityId]);

  // Function to toggle a reaction with optimistic updates
  const toggleReaction = async (reactionType: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Optimistic update
      const newReactions = { ...reactions };
      newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
      setReactions(newReactions);

      // Send the API request
      const response = await apiService.reaction.toggleReaction(
        activityId,
        reactionType
      );

      console.log("Toggle Reaction Response:", response);

      // Update reactions based on server response
      if (response.currentReactions) {
        const updatedReactions: Record<string, number> = {};
        response.currentReactions.forEach((reaction) => {
          updatedReactions[reaction.type] = reaction.count;
        });

        console.log("Updated Reactions:", updatedReactions);
        setReactions(updatedReactions);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);

      // Revert optimistic update on error
      const previousReactions = { ...reactions };
      if (previousReactions[reactionType]) {
        previousReactions[reactionType]--;
        if (previousReactions[reactionType] <= 0) {
          delete previousReactions[reactionType];
        }
      }
      setReactions(previousReactions);

      setError("Failed to save reaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Position the emoji picker
  const getEmojiPickerPosition = () => {
    if (!containerRef.current) return {};
    return {
      top: "100%",
      left: 0,
      marginTop: "8px",
      maxWidth: "320px",
    };
  };

  return (
    <div className="mt-3 relative" ref={containerRef}>
      {/* Display errors if any */}
      {error && (
        <div className="text-red-500 text-xs mb-2 rounded bg-red-50 p-2 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {/* Display all reactions */}
        {Object.entries(reactions).map(([type, count]) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors shadow-sm border border-gray-200"
            onClick={() => !isLoading && toggleReaction(type)}
            disabled={isLoading}
          >
            <span className="text-lg mr-1">
              {REACTION_EMOJI_MAP[type] || type}
            </span>
            <span className="text-sm font-medium text-gray-700">{count}</span>
          </motion.button>
        ))}

        {/* Add reaction button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !isLoading && setShowEmojiPicker(!showEmojiPicker)}
          className={`flex items-center justify-center w-8 h-8 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-full transition-colors shadow-sm border border-gray-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          } ${showEmojiPicker ? "ring-2 ring-purple-300 bg-slate-50" : ""}`}
          aria-label="Add reaction"
          disabled={isLoading}
        >
          <span className="text-gray-600 text-base">+</span>
        </motion.button>

        {/* Emoji picker popup */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="emoji-picker absolute z-20 p-2 sm:p-3 bg-white rounded-lg shadow-md border border-gray-200 grid grid-cols-5 gap-1.5"
              style={getEmojiPickerPosition()}
            >
              {Object.entries(REACTION_EMOJI_MAP).map(([type, emoji]) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (!isLoading) {
                      toggleReaction(type);
                      setShowEmojiPicker(false);
                    }
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all 
                    ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  aria-label={type}
                  disabled={isLoading}
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityReactions;
