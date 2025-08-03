"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { Mountain, User as UserIcon, Lock, TrendingUp } from "lucide-react";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Pagination from "@/app/components/Pagination";
import SubmitQuote from "@/app/components/SubmitQuote";
import PersonalInsights from "@/app/components/PersonalInsights";
import CommentAndReactionView from "@/app/components/CommentAndReactionView";
import { useTheme } from "@/app/hooks/useTheme";

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string;
}

interface User {
  username: string;
  totalKm: number;
  profilePicture: string;
  activities: Activity[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const sportsOptions = [
  "Juoksu",
  "Sali",
  "Tennis",
  "Pyöräily",
  "Hiihto",
  "Uinti",
  "Crossfit",
  "Tribe",
  "Ryhmä, pump",
  "Ryhmä, dance",
  "Ryhmä, combat",
  "Spinning",
  "Squash",
  "Sulkapallo",
  "Padel",
  "Jooga",
  "Liikkuvuus",
  "Golf",
  "Ryhmä, HIIT",
  "Kehonpainotreeni",
  "Jalkapallo",
  "Jääkiekko",
  "Kamppailulaji",
  "Muu(100km/h)",
  "Muu(50km/h)",
];

const itemsPerPage = 10;

const UserProfile = () => {
  const params = useParams();
  const username = params?.username as string;
  const { currentUser, isLoggedIn } = useAuth();
  const { t } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activity, setActivity] = useState("");
  const [customActivity, setCustomActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [bonus, setBonus] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  const isActivitySubmissionDisabled = true;
  const canEditProfile = isLoggedIn && currentUser === username;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const formRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/users/${username}?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) throw new Error(t.userProfile.failedToFetchUser);
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [username, page, t.userProfile.failedToFetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDeleteActivity = async () => {
    if (!activityToDelete?.id || !canEditProfile) return;
    try {
      const response = await fetch(
        `${backendUrl}/users/${username}/activities/${activityToDelete.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error(t.userProfile.failedToDeleteActivity);
      setIsModalOpen(false);
      setActivityToDelete(null);
      fetchUser();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditProfile) return;
    
    try {
      let selectedActivity = activity;

      // Handle custom activities
      if (activity.startsWith("Extreme-kiipeily(") && customActivity) {
        selectedActivity = `${customActivity} / ${activity}`;
      } else if (activity.startsWith("Retkivaellus(") && customActivity) {
        selectedActivity = `${customActivity} / ${activity}`;
      }

      const response = await fetch(
        `${backendUrl}/users/${username}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity: selectedActivity,
            duration: Number(duration),
            date,
            bonus,
          }),
        }
      );

      if (!response.ok) throw new Error(t.userProfile.failedToAddActivity);

      resetForm();
      fetchUser();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !canEditProfile) return;

    try {
      let selectedActivity = activity;

      // Handle custom activities
      if (activity.startsWith("Extreme-kiipeily(") && customActivity) {
        selectedActivity = `${customActivity} / ${activity}`;
      } else if (activity.startsWith("Retkivaellus(") && customActivity) {
        selectedActivity = `${customActivity} / ${activity}`;
      }

      const response = await fetch(
        `${backendUrl}/users/${username}/activities/${editingActivity.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity: selectedActivity,
            duration: Number(duration),
            date,
            bonus,
          }),
        }
      );

      if (!response.ok) throw new Error(t.userProfile.failedToUpdateActivity);

      resetForm();
      fetchUser();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingActivity(null);
    setActivity("");
    setCustomActivity("");
    setDuration("");
    setDate(new Date().toISOString().split("T")[0]);
    setBonus(null);
  };

  const startEdit = (activity: Activity) => {
    if (!canEditProfile) return;
    
    if (showInsights) {
      setShowInsights(false);
    }

    // Check for custom activities
    const customMatch = activity.activity.match(/(.*?)\s*\/\s*(Extreme-kiipeily\(.*?\)|Retkivaellus\(.*?\))/);

    if (customMatch) {
      setCustomActivity(customMatch[1]);
      setActivity(customMatch[2]);
    } else {
      setActivity(activity.activity);
      setCustomActivity("");
    }

    setEditingActivity(activity);
    setDuration(activity.duration.toString());
    setDate(activity.date.split("T")[0]);
    setBonus(activity.bonus || null);
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getBonusText = (bonus: string) => {
    switch (bonus) {
      case "juhlapäivä":
        return `🌞 ${t.userProfile.perfectWeatherConditions} (2x ${t.userProfile.height})`;
      case "enemmän kuin kolme urheilee yhdessä":
        return `👥 ${t.userProfile.groupClimbing} (1.5x ${t.userProfile.height})`;
      case "kaikki yhdessä":
        return `🏔️ ${t.userProfile.wholeTeamAtSummit} (3x ${t.userProfile.height})`;
      default:
        return `🌟 ${t.activityForm.bonus}: ${bonus}`;
    }
  };

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-800/90 backdrop-blur-sm rounded-2xl p-8 text-center text-white max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold mb-4">🏔️ {t.userProfile.loginRequired}</h2>
          <p className="text-gray-300 mb-6">{t.userProfile.onlyLoggedInClimbersCanView}</p>
          <Link href="/" className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors">
            {t.userProfile.backToBasecamp}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-slate-400 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center text-red-400 p-4 bg-800/50 rounded-lg">
          <Mountain className="w-16 h-16 mx-auto mb-4" />
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center text-gray-300 p-4 bg-800/50 rounded-lg">
          <UserIcon className="w-16 h-16 mx-auto mb-4" />
          {t.userProfile.userNotFound}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {/* Climbing equipment badge overlay for profile pic */}
              <div className="absolute -top-2 -right-2 text-2xl">🧗‍♂️</div>
              <Image
                src={
                  user.profilePicture
                    ? `https://matka-xi.vercel.app/${user.username}.png`
                    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                }
                alt={t.userProfile.climberAvatar}
                width={80}
                height={80}
                className="rounded-full border-4 border-slate-400/50"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                🏔️ {user.username}
                {currentUser === username && <span className="ml-2 text-sm bg-slate-600 px-2 py-1 rounded">{t.userProfile.you}</span>}
              </h1>
              <p className="text-xl text-slate-300 flex items-center">
                <Mountain className="w-5 h-5 mr-2" />
                {user.totalKm.toFixed(0)} {t.userProfile.meters} {t.userProfile.altitude}
              </p>
              <p className="text-sm text-gray-400">
                {t.userProfile.climbingPerformances}: {user.activities.length}
              </p>
            </div>
          </div>
          <Link 
            href="/" 
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Mountain className="w-4 h-4 mr-2" />
            {t.ui.backToHome}
          </Link>
        </header>

        {/* Only show edit controls for own profile */}
        {canEditProfile ? (
          <>
            {/* Toggle button */}
            <div className="flex justify-center">
              <div className="bg-800/80 backdrop-blur-sm rounded-full p-1 shadow inline-flex border border-white/10">
                <button
                  onClick={() => setShowInsights(false)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center ${
                    !showInsights
                      ? "bg-slate-600 text-white"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <Mountain className="w-4 h-4 mr-2" />
                  {t.userProfile.addPerformance}
                </button>
                <button
                  onClick={() => setShowInsights(true)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center ${
                    showInsights
                      ? "bg-slate-600 text-white"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t.userProfile.climbingStatistics}
                </button>
              </div>
            </div>

            {/* Activity Form or Insights */}
            {!showInsights ? (
              isActivitySubmissionDisabled ? (
                <div className="text-center bg-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <Mountain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">
                    {t.userProfile.submissionClosed}
                  </p>
                </div>
              ) : (
                <section ref={formRef} className="bg-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Mountain className="w-6 h-6 mr-2 text-slate-400" />
                    {isEditing ? t.userProfile.updatePerformance : t.userProfile.addPerformance}
                  </h2>
                  <form
                    onSubmit={isEditing ? handleUpdateActivity : handleAddActivity}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        {t.userProfile.activityType}
                      </label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                        required
                      >
                        <option value="">{t.userProfile.selectActivity}</option>
                        {sportsOptions.map((sport) => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom activity input for extreme climbing and trekking */}
                    {(activity === "Extreme-kiipeily(100m/h)" || activity === "Retkivaellus(50m/h)") && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          {t.userProfile.specifyActivity}
                        </label>
                        <input
                          type="text"
                          value={customActivity}
                          onChange={(e) => setCustomActivity(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                          required
                          placeholder={t.userProfile.enterActivityName}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          {t.userProfile.duration}
                        </label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          {t.userProfile.date}
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        {t.activityForm.bonus}
                      </label>
                      <select
                        value={bonus || ""}
                        onChange={(e) => setBonus(e.target.value || null)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      >
                        <option value="">{t.userProfile.noBonus}</option>
                        <option value="juhlapäivä">{getBonusText("juhlapäivä")}</option>
                        <option value="enemmän kuin kolme urheilee yhdessä">{getBonusText("enemmän kuin kolme urheilee yhdessä")}</option>
                        <option value="kaikki yhdessä">{getBonusText("kaikki yhdessä")}</option>
                      </select>
                    </div>

                    <div className="flex space-x-4">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg transition-colors"
                        >
                          {t.ui.cancel}
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg transition-colors font-medium"
                      >
                        {isEditing ? t.userProfile.updatePerformance : t.userProfile.addPerformance}
                      </button>
                    </div>
                  </form>
                </section>
              )
            ) : (
              <div className="bg-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <PersonalInsights
                  activities={user.activities}
                  username={user.username}
                />
              </div>
            )}
          </>
        ) : (
          // Show insights only for other users' profiles
          <div className="bg-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300">
                {t.userProfile.canViewStats.replace('{username}', user.username)}
              </p>
            </div>
            <PersonalInsights
              activities={user.activities}
              username={user.username}
            />
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Mountain className="w-5 h-5 mr-2 text-slate-400" />
            {t.userProfile.climbingPerformances}
          </h3>
          {user.activities.map((activity) => (
            <div key={activity.id} className="bg-800/50 backdrop-blur-sm p-6 rounded-xl shadow border border-white/10">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-white mb-2">{activity.activity}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                    <span className="flex items-center">
                      <Mountain className="w-4 h-4 mr-1 text-slate-400" />
                      {activity.kilometers.toFixed(0)} {t.userProfile.meters}
                    </span>
                    <span>🕒 {activity.duration} {t.insights.mins}</span>
                  </div>
                  {activity.bonus && (
                    <p className="text-sm text-yellow-400 mb-2">
                      {getBonusText(activity.bonus)}
                    </p>
                  )}
                  <p className="text-sm text-gray-400">
                    📅 {new Date(activity.date).toLocaleDateString("fi-FI")}
                  </p>
                </div>
                {canEditProfile && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      className="text-slate-400 hover:text-slate-300 transition-colors px-3 py-1 rounded"
                      onClick={() => startEdit(activity)}
                    >
                      {t.ui.edit}
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded"
                      onClick={() => {
                        setActivityToDelete(activity);
                        setIsModalOpen(true);
                      }}
                    >
                      {t.ui.delete}
                    </button>
                  </div>
                )}
              </div>

              {/* Comments and Reactions */}
              <CommentAndReactionView activityId={activity.id} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {user.pagination && user.pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={page}
              setPage={setPage}
              totalItems={user.pagination.total}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* Quote submission - only for current user */}
        {canEditProfile && (
          <div className="bg-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <SubmitQuote />
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={handleDeleteActivity}
          onCancel={() => {
            setIsModalOpen(false);
            setActivityToDelete(null);
          }}
          activityDetails={
            activityToDelete
              ? {
                  activity: activityToDelete.activity,
                  date: activityToDelete.date,
                  duration: activityToDelete.duration,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default UserProfile;