"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Comment {
  id: number;
  activityId: number;
  username: string;
  text: string;
  createdAt: string;
}

interface Reaction {
  id?: number;
  activityId?: number;
  username?: string;
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

interface CommentAndReactionViewProps {
  activityId: number;
  expanded?: boolean;
}

export const CommentAndReactionView: React.FC<CommentAndReactionViewProps> = ({
  activityId,
  expanded = false,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [reactionsLoading, setReactionsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [reactionError, setReactionError] = useState("");
  const [showComments, setShowComments] = useState(expanded);
  const [commentCount, setCommentCount] = useState(0);

  const backendUrl = "https://matka-zogy.onrender.com";

  // Format date utility function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fi-FI", {
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Päivämäärä ei saatavilla";
    }
  };

  // Define the callback functions BEFORE they are used in useEffect
  const fetchCommentCount = useCallback(async () => {
    try {
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");

      const commentsData = await response.json();
      setCommentCount(commentsData.length);
    } catch (error) {
      console.error("Error fetching comment count:", error);
      setCommentCount(0);
    }
  }, [activityId, backendUrl]);

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");

      const commentsData = await response.json();
      setComments(commentsData);
      setCommentCount(commentsData.length);
    } catch (error) {
      setCommentError(
        error instanceof Error ? error.message : "Error fetching comments"
      );
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [activityId, backendUrl]);

  const fetchReactions = useCallback(async () => {
    setReactionsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/reactions`
      );
      if (!response.ok) throw new Error("Failed to fetch reactions");

      const reactionsData = await response.json();
      setReactions(reactionsData);
    } catch (error) {
      setReactionError(
        error instanceof Error ? error.message : "Error fetching reactions"
      );
      console.error("Error fetching reactions:", error);
    } finally {
      setReactionsLoading(false);
    }
  }, [activityId, backendUrl]);

  // Now use the callbacks in useEffect after they've been defined
  useEffect(() => {
    if (showComments) {
      fetchComments();
    } else {
      // Even if comments aren't shown, we still want to get the count
      fetchCommentCount();
    }

    // Always fetch reactions to display
    fetchReactions();
  }, [
    activityId,
    showComments,
    fetchComments,
    fetchCommentCount,
    fetchReactions,
  ]);

  return (
    <div className="mt-2">
      {/* Display Reactions (read-only mode) */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {reactionsLoading ? (
          <div className="text-xs text-gray-400">Ladataan reaktioita...</div>
        ) : reactionError ? (
          <div className="text-xs text-red-400">{reactionError}</div>
        ) : reactions.length > 0 ? (
          reactions.map((reaction, index) => {
            // Find the reaction type to get the emoji
            const reactionType = REACTION_TYPES.find(
              (r) => r.type === reaction.type
            );
            if (!reactionType) return null;

            return (
              <div
                key={`${reaction.id || index}-${reaction.type}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm shadow-sm border bg-purple-100 text-purple-700 border-purple-300"
              >
                <span className="text-sm">{reactionType.emoji}</span>
                <span className="text-xs font-semibold">{reaction.count}</span>
              </div>
            );
          })
        ) : null}
      </div>

      {/* Toggle Comments Button - Only show if there are comments */}
      {commentCount > 0 && (
        <div className="flex justify-between border-t pt-3 mt-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600 hover:text-purple-600 text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {showComments ? "Piilota kommentit" : "Näytä kommentit"}
            <span className="ml-2 text-xs font-semibold text-gray-500">
              ({commentCount})
            </span>
          </button>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t pt-4">
          {commentsLoading ? (
            <div className="text-center py-2 text-gray-500">
              Ladataan kommentteja...
            </div>
          ) : commentError ? (
            <div className="text-center py-2 text-red-500">{commentError}</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-2 text-gray-500">Ei kommentteja</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex my-2">
                  <div className="flex-1 bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm break-words flex-grow">
                        {comment.text}
                      </span>
                      <span className="text-xs text-gray-500 ml-3 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentAndReactionView;
