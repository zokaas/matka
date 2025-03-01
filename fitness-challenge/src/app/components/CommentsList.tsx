"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Comment } from "../types/types";

interface CommentsListProps {
  activityId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ activityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "https://matka-zogy.onrender.com";

  const fetchComments = useCallback(async () => {
    if (!activityId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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
    <div className="space-y-2">
      {loading ? (
        <div className="text-center p-2 text-sm text-gray-500">
          Ladataan kommentteja...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center text-sm py-2">
          Ei kommentteja vielä.
        </p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-100 p-3 rounded-lg shadow-sm"
          >
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
  );
};

export default CommentsList;
