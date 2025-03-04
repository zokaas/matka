"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../service/apiService";

interface ReactionsProps {
  activityId: number;
}

// Enhanced reaction types with more fitness and challenge-related options
const REACTION_TYPES = [
  { type: "like", emoji: "👍" },
  { type: "support", emoji: "💪" },
  { type: "celebrate", emoji: "🎉" },
  { type: "inspire", emoji: "✨" },
  { type: "determination", emoji: "🔥" },
  { type: "teamwork", emoji: "🤝" },
  { type: "global", emoji: "🌍" },
  { type: "love", emoji: "💖" },
  { type: "speed", emoji: "🏃‍♀️" },
  { type: "strong", emoji: "🏋️‍♀️" },
  { type: "medal", emoji: "🥇" },
  { type: "trophy", emoji: "🏆" },
  { type: "bicycle", emoji: "🚴‍♀️" },
  { type: "swimming", emoji: "🏊‍♀️" },
  { type: "mountain", emoji: "⛰️" },
  { type: "gym", emoji: "💯" },
  { type: "highfive", emoji: "✋" },
  { type: "clap", emoji: "👏" },
  { type: "energy", emoji: "⚡" },
  { type: "rocket", emoji: "🚀" },
];

const ActivityReactions: React.FC<ReactionsProps> = ({ activityId }) => {
  const [reactions, setReactions] = useState<{ [key: string]: boolean }>({});
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Fetch reactions when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reactionData = await apiService.reaction.getReactions(activityId);

        const initialCounts: { [key: string]: number } = {};
        reactionData.forEach(
          ({ type, count }: { type: string; count: number }) => {
            initialCounts[type] = count;
          }
        );
        setCounts(initialCounts);
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
      setError(null);

      // Optimistic update
      const newCounts = { ...counts };
      newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
      setCounts(newCounts);
      setReactions({ ...reactions, [reactionType]: true });

      // Send the API request
      await apiService.reaction.toggleReaction(activityId, reactionType);
    } catch (error) {
      console.error("Error toggling reaction:", error);

      // Revert optimistic update on error
      const previousCounts = { ...counts };
      if (previousCounts[reactionType]) {
        previousCounts[reactionType]--;
        if (previousCounts[reactionType] <= 0) {
          delete previousCounts[reactionType];
        }
      }
      setCounts(previousCounts);
      setReactions({ ...reactions, [reactionType]: false });

      setError("Failed to save reaction");
    }
  };

  // Position the emoji picker based on available space
  const getEmojiPickerPosition = () => {
    if (!containerRef.current) return {};

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // For mobile, always position below
    if (isMobile) {
      return {
        top: "100%",
        left: "0",
        right: "0",
        maxWidth: "320px",
        margin: "0 auto",
      };
    }

    // For desktop, check available space
    if (spaceBelow < 280 && spaceAbove > spaceBelow) {
      // Position above if there's more space
      return {
        bottom: "100%",
        left: "0",
        maxWidth: "380px",
        marginBottom: "8px",
      };
    } else {
      // Position below
      return {
        top: "100%",
        left: "0",
        maxWidth: "380px",
        marginTop: "8px",
      };
    }
  };

  // Memoized active reactions for efficiency
  const activeReactions = useMemo(
    () =>
      Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          type,
          count,
          emoji: REACTION_TYPES.find((r) => r.type === type)?.emoji || "👍",
        })),
    [counts]
  );

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className="mt-3 relative" ref={containerRef}>
      {/* Display errors if any */}
      {error && (
        <div className="text-red-500 text-xs mb-2 rounded bg-red-50 p-2 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {/* Display active reactions */}
        {activeReactions.map(({ type, emoji, count }) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center bg-white hover:bg-gray-50 
                       ${isMobile ? "px-2.5 py-1" : "px-3 py-1.5"} 
                       rounded-full transition-colors shadow-sm border border-gray-200
                       ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                       ${reactions[type] ? "ring-2 ring-purple-300" : ""}`}
            onClick={() => !isLoading && toggleReaction(type)}
            aria-label={type}
            disabled={isLoading}
          >
            <span className={`${isMobile ? "text-base" : "text-lg"} mr-1`}>
              {emoji}
            </span>
            <span
              className={`${
                isMobile ? "text-xs" : "text-sm"
              } font-medium text-gray-700`}
            >
              {count}
            </span>
          </motion.button>
        ))}

        {/* Add reaction button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !isLoading && setShowEmojiPicker(!showEmojiPicker)}
          className={`flex items-center justify-center bg-white hover:bg-gray-50 active:bg-gray-100 
                     ${isMobile ? "w-7 h-7" : "w-8 h-8"}
                     rounded-full transition-colors shadow-sm border border-gray-200
                     ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                     ${
                       showEmojiPicker
                         ? "ring-2 ring-purple-300 bg-purple-50"
                         : ""
                     }`}
          aria-label="Add reaction"
          disabled={isLoading}
        >
          <span className="text-gray-600 text-base">+</span>
        </motion.button>

        {/* Emoji picker popup with scrolling for more options */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`emoji-picker absolute z-20 p-2 sm:p-3 bg-white rounded-lg shadow-md 
                         border border-gray-200 grid ${
                           isMobile
                             ? "grid-cols-5 gap-1.5"
                             : "grid-cols-6 gap-2"
                         }`}
              style={{
                ...getEmojiPickerPosition(),
                maxHeight: isMobile ? "180px" : "240px",
                overflowY: "auto",
              }}
            >
              {REACTION_TYPES.map(({ type, emoji }) => (
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
                  className={`${
                    isMobile ? "w-9 h-9" : "w-10 h-10"
                  } flex items-center justify-center rounded-full text-xl 
                             transition-all ${
                               reactions[type]
                                 ? "bg-purple-100 text-purple-600 ring-2 ring-purple-300"
                                 : "hover:bg-gray-100"
                             } ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
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
