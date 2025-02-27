"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Comment } from "../types/types";

interface CommentsProps {
  activityId: number;
}

const COMMENT_MAX_LENGTH = 300; // Maximum character limit for comments

const CommentsSection: React.FC<CommentsProps> = ({ activityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charactersLeft, setCharactersLeft] = useState(COMMENT_MAX_LENGTH);
  const [submitting, setSubmitting] = useState(false);

  const backendUrl = "https://matka-zogy.onrender.com";

  const fetchComments = useCallback(async () => {
    if (!activityId) return;

    try {
      setLoading(true);
      console.log(`Fetching comments for activity ${activityId}`);

      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );


      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);

        let errorDetails;
        try {
          errorDetails = JSON.parse(errorText);
        } catch {
          errorDetails = { message: errorText };
        }

        throw new Error(
          `Failed to fetch comments: ${response.status} ${response.statusText} - ${errorDetails.message}`
        );
      }

      const data = await response.json();
      console.log("Received comments:", data);
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [activityId, backendUrl]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Update characters left whenever the comment changes
  useEffect(() => {
    setCharactersLeft(COMMENT_MAX_LENGTH - newComment.length);
  }, [newComment]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update if we're below the limit or if the user is deleting text
    if (e.target.value.length <= COMMENT_MAX_LENGTH) {
      setNewComment(e.target.value);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activityId || submitting) return;

    // Enforce character limit
    if (newComment.length > COMMENT_MAX_LENGTH) {
      setError(
        `Comment is too long. Maximum ${COMMENT_MAX_LENGTH} characters allowed.`
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      console.log(
        `Submitting comment for activity ${activityId}: ${newComment}`
      );

      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorDetails;
        try {
          errorDetails = JSON.parse(errorText);
        } catch {
          errorDetails = { message: errorText };
        }

        throw new Error(
          `Failed to add comment: ${response.status} ${response.statusText} - ${errorDetails.message}`
        );
      }

      const addedComment = await response.json();
      console.log("Comment added successfully:", addedComment);

      // Add the new comment to the top of the list
      setComments([addedComment, ...comments]);
      setNewComment("");
      setCharactersLeft(COMMENT_MAX_LENGTH);
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Kirjoita kommentti..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            maxLength={COMMENT_MAX_LENGTH}
            required
            disabled={submitting}
          />
          <button
            type="submit"
            className={`bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={
              newComment.length === 0 ||
              newComment.length > COMMENT_MAX_LENGTH ||
              submitting
            }
          >
            {submitting ? "Lähetetään..." : "Lähetä"}
          </button>
        </div>

        {/* Character counter */}
        <div
          className={`text-xs text-right ${
            charactersLeft < 20 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {charactersLeft} merkkiä jäljellä
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="text-red-500 p-2 text-sm bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center p-2 text-sm text-gray-500">
            <svg
              className="animate-spin h-4 w-4 mx-auto mb-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Ladataan kommentteja...
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-2">
            Ei kommentteja vielä. Ole ensimmäinen kommentoija!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-start">
                <p className="text-gray-700 text-sm">{comment.text}</p>
                <div className="text-xs text-gray-500 ml-2">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
