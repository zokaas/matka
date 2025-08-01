"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CommentsSection from "@/app/components/CommentsSection";
import ActivityReactions from "@/app/components/ActivityReactions";
import { useTheme } from "@/app/hooks/useTheme";

interface ActivityItemProps {
  activity: {
    id: number;
    activity: string;
    duration: number;
    date: string;
    kilometers: number;
    bonus?: string | null;
    username: string;
    profilePicture?: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const { t } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const handleCommentCountUpdate = (count: number) => {
    setCommentCount(count);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={
              activity.profilePicture
                ? `https://matka-xi.vercel.app/${activity.username}.png`
                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${activity.username}`
            }
            alt={`${activity.username}'s avatar`}
            width={40}
            height={40}
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <Link
            href={`/user/${activity.username}`}
            className="font-medium text-slate-600 hover:underline"
          >
            {activity.username}
          </Link>
          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-semibold text-lg">{activity.activity}</h3>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>{activity.kilometers.toFixed(1)} km</span>
          <span>{activity.duration} {t.insights.mins}</span>
          {activity.bonus && (
            <span className="text-slate-500">🎉 {activity.bonus}</span>
          )}
        </div>
      </div>

      <ActivityReactions activityId={activity.id} />

      <div className="flex justify-between border-t pt-3 mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-slate-600 text-sm flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 mr-1 transition-transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
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
          {isExpanded
            ? t.comments.hideComments
            : `${t.comments.showComments}${commentCount > 0 ? ` (${commentCount})` : ""}`}
        </button>
      </div>

      {/* Comments section */}
      <div
        className={`mt-2 transition-all duration-300 ease-in-out ${
          isExpanded ? "border-t pt-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <CommentsSection
          activityId={activity.id}
          isExpanded={isExpanded}
          onCommentCountUpdate={handleCommentCountUpdate}
        />
      </div>
    </div>
  );
};

export default ActivityItem;