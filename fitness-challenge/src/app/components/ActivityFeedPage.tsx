"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, User } from "@/app/types/types";
import CommentsSection from "@/app/components/CommentsSection";
import ActivityReactions from "@/app/components/ActivityReactions";
import { useWeeklyInsights } from "@/app/hooks/useWeeklyInsights";
import { useTargetPaces } from "@/app/hooks/useTargetPaces";

interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
  commentCount?: number;
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const backendUrl = "https://matka-zogy.onrender.com";

  useEffect(() => {
    const fetchUsersAndActivities = async () => {
      try {
        setLoading(true);

        // ✅ Fetch all users
        const usersResponse = await fetch(`${backendUrl}/users`);
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);

        let allActivities: ActivityWithUser[] = [];

        // ✅ Fetch activities and comments for each user
        for (const user of usersData) {
          try {
            const response = await fetch(
              `${backendUrl}/users/${user.username}/activities/all`
            );
            if (!response.ok) continue;

            const userActivities: Activity[] = await response.json();

            // Fetch comment count for each activity
            const activitiesWithUser = await Promise.all(
              userActivities.map(async (activity) => {
                try {
                  const commentsResponse = await fetch(
                    `${backendUrl}/activity/${activity.id}/comments`
                  );
                  const comments = commentsResponse.ok
                    ? await commentsResponse.json()
                    : [];

                  return {
                    ...activity,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    commentCount: comments.length,
                  };
                } catch (error) {
                  console.error(
                    `Failed to fetch comments for activity ${activity.id}`
                  );
                  return {
                    ...activity,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    commentCount: 0,
                  };
                }
              })
            );

            allActivities = [...allActivities, ...activitiesWithUser];
          } catch (error) {
            console.error(`Failed to fetch activities for ${user.username}`);
          }
        }

        // ✅ Sort activities by date (newest first) and limit to 20
        setActivities(
          allActivities
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 20)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndActivities();
  }, []);

  const toggleComments = (activityId: number) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
        <span>🔥</span> Viimeisimmät suoritukset
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Katso mitä Petolliset ovat tehneet viime aikoina!
      </p>

      {loading ? (
        <div className="text-center p-4 text-gray-500">Ladataan...</div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-lg shadow">
              <p className="text-gray-500">Ei aktiivisuuksia saatavilla.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="bg-white p-6 rounded-lg shadow">
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
                      className="font-medium text-purple-600 hover:underline"
                    >
                      {activity.username}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString("fi-FI", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* >>> Activity Info Here <<< */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{activity.activity}</h3>
                  <p className="text-sm text-gray-600">
                    {activity.kilometers.toFixed(1)} km • {activity.duration}{" "}
                    min
                  </p>
                </div>
                {/* >>> End Activity Info <<< */}

                <ActivityReactions activityId={activity.id} />

                <div className="flex justify-between border-t pt-3 mt-3">
                  <button
                    onClick={() => toggleComments(activity.id)}
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
                    {expandedActivity === activity.id
                      ? "Sulje kommentit"
                      : "Näytä kommentit"}
                    {activity.commentCount! > 0 && (
                      <span className="ml-2 text-xs font-semibold text-gray-500">
                        ({activity.commentCount})
                      </span>
                    )}
                  </button>
                </div>

                {expandedActivity === activity.id && (
                  <div className="mt-4 border-t pt-4">
                    <CommentsSection activityId={activity.id} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
