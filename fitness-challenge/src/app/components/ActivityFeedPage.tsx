"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, User } from "@/app/types/types";
import CommentsSection from "@/app/components/CommentsSection";
import ActivityReactions from "@/app/components/ActivityReactions";

interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const backendUrl = "https://matka-zogy.onrender.com";

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading(true);

        // First fetch all users
        const usersResponse = await fetch(`${backendUrl}/users`);
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const users: User[] = await usersResponse.json();

        // Process activities from all users
        const allActivities: ActivityWithUser[] = [];

        // For each user, get activities and add username
        for (const user of users) {
          const response = await fetch(
            `${backendUrl}/users/${user.username}/activities/all`
          );
          if (response.ok) {
            const userActivities: Activity[] = await response.json();
            // Add username to each activity
            const activitiesWithUser = userActivities.map((activity) => ({
              ...activity,
              username: user.username,
              profilePicture: user.profilePicture,
            }));
            allActivities.push(...activitiesWithUser);
          }
        }

        // Sort by date (newest first) and limit to 20
        const recentActivities = allActivities
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 20);

        setActivities(recentActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, [backendUrl]);

  const toggleComments = (activityId: number) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="text-center bg-yellow-100 text-yellow-700 p-4 rounded-lg">
      <h2 className="text-xl font-semibold">TULOSSA PIAN 🚀</h2>
      <p className="text-sm">
        Tämä ominaisuus julkaistaan pian. Pysy kuulolla!
      </p>
    </div>
    //   <div className="max-w-5xl mx-auto p-6">
    //     <header className="text-center mb-8">
    //       <h1 className="text-3xl font-bold text-purple-600">
    //         Viimeisimmät Suoritukset
    //       </h1>
    //       <p className="text-gray-600 mt-2">
    //         Katso mitä Petolliset ovat tehneet viime aikoina!
    //       </p>
    //     </header>

    //     <div className="space-y-6">
    //       {activities.length === 0 ? (
    //         <div className="text-center p-6 bg-white rounded-lg shadow">
    //           <p className="text-gray-500">Ei aktiivisuuksia saatavilla.</p>
    //         </div>
    //       ) : (
    //         activities.map((activity) => (
    //           <div key={activity.id} className="bg-white p-6 rounded-lg shadow">
    //             <div className="flex items-center space-x-3 mb-4">
    //               <div className="w-10 h-10 rounded-full overflow-hidden">
    //                 <Image
    //                   src={
    //                     activity.profilePicture
    //                       ? `https://matka-xi.vercel.app/${activity.username}.png`
    //                       : `https://api.dicebear.com/7.x/adventurer/svg?seed=${activity.username}`
    //                   }
    //                   alt={`${activity.username}'s avatar`}
    //                   width={40}
    //                   height={40}
    //                   className="object-cover"
    //                   unoptimized
    //                 />
    //               </div>
    //               <div>
    //                 <Link
    //                   href={`/user/${activity.username}`}
    //                   className="font-medium text-purple-600 hover:underline"
    //                 >
    //                   {activity.username}
    //                 </Link>
    //                 <p className="text-xs text-gray-500">
    //                   {formatDate(activity.date)}
    //                 </p>
    //               </div>
    //             </div>

    //             <div className="mb-3">
    //               <h3 className="font-semibold text-lg">{activity.activity}</h3>
    //               <div className="flex space-x-4 text-sm text-gray-600">
    //                 <span>{activity.kilometers.toFixed(1)} km</span>
    //                 <span>{activity.duration} min</span>
    //                 {activity.bonus && (
    //                   <span className="text-purple-500">🎉 {activity.bonus}</span>
    //                 )}
    //               </div>
    //             </div>

    //             <div className="flex justify-between border-t pt-3 mt-3">
    //               <button
    //                 onClick={() => toggleComments(activity.id)}
    //                 className="text-gray-600 hover:text-purple-600 text-sm flex items-center"
    //               >
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   className="h-5 w-5 mr-1"
    //                   fill="none"
    //                   viewBox="0 0 24 24"
    //                   stroke="currentColor"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth={2}
    //                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    //                   />
    //                 </svg>
    //                 Kommentit
    //               </button>

    //               <ActivityReactions activityId={activity.id} />
    //             </div>

    //             {/* Comments section that expands when toggled */}
    //             {expandedActivity === activity.id && (
    //               <div className="mt-4 border-t pt-4">
    //                 <CommentsSection activityId={activity.id} />
    //               </div>
    //             )}
    //           </div>
    //         ))
    //       )}
    //     </div>
    //   </div>
  );
}
