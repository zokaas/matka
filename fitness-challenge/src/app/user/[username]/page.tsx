"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { Bike, User as UserIcon, Lock, TrendingUp } from "lucide-react";
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

  const isActivitySubmissionDisabled = false;
  const canEditProfile = isLoggedIn && currentUser === username;
  const canAddActivity = isLoggedIn;

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
    if (!canAddActivity) return;
    
    try {
      let selectedActivity = activity;

      if (activity.startsWith("Muu(") && customActivity) {
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

      if (activity.startsWith("Muu(") && customActivity) {
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

    const customMatch = activity.activity.match(/(.*?)\s*\/\s*(Muu\(.*?\))/);

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
        return `🌞 ${t.userProfile.perfectWeatherConditions} (2x ${t.userProfile.km})`;
      case "enemmän kuin kolme urheilee yhdessä":
        return `👥 ${t.userProfile.groupActivity} (1.5x ${t.userProfile.km})`;
      case "kaikki yhdessä":
        return `🏔️ ${t.userProfile.wholeTeamTogether} (3x ${t.userProfile.km})`;
      default:
        return `🌟 ${t.activityForm.bonus}: ${bonus}`;
    }
  };

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-xl max-w-sm sm:max-w-md w-full mx-4 border-2 border-yellow-400">
          <Lock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl sm:text-2xl font-bold mb-4">🚴‍♂️ {t.userProfile.loginRequired}</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{t.userProfile.onlyLoggedInUsersCanView}</p>
          <Link href="/" className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-lg font-medium transition-colors text-black inline-block w-full sm:w-auto">
            {t.userProfile.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-yellow-400 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Ladataan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-red-500 p-6 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <Bike className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
          <p className="text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-gray-600 p-6 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
          <p className="text-sm sm:text-base">{t.userProfile.userNotFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        {/* Header - Mobile Optimized */}
        <header className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-yellow-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="relative flex-shrink-0">
                <Image
                  src={
                    user.profilePicture
                      ? `https://matka-xi.vercel.app/${user.username}.png`
                      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                  }
                  alt={t.userProfile.userAvatar}
                  width={64}
                  height={64}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold flex flex-wrap items-center text-gray-800 gap-2">
                  <span className="flex items-center">
                    🚴‍♂️ {user.username}
                  </span>
                  {currentUser === username && (
                    <span className="text-xs sm:text-sm bg-yellow-400 text-black px-2 py-1 rounded whitespace-nowrap">
                      {t.userProfile.you}
                    </span>
                  )}
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 flex items-center mt-1">
                  <span className="truncate">
                    {user.totalKm.toFixed(1)} {t.userProfile.km} {t.userProfile.distance}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {t.userProfile.performances}: {user.activities.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Show form for any logged-in user, insights only for profile owner */}
        {canAddActivity ? (
          <>
            {/* Toggle button - Mobile Optimized */}
            {canEditProfile && (
              <div className="flex justify-center px-4">
                <div className="bg-white rounded-full p-1 shadow-lg inline-flex border border-yellow-200 w-full max-w-md">
                  <button
                    onClick={() => setShowInsights(false)}
                    className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                      !showInsights
                        ? "bg-yellow-400 text-black"
                        : "text-gray-600 hover:bg-yellow-50"
                    }`}
                  >
                    <Bike className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {canEditProfile ? t.userProfile.addPerformance : t.userProfile.addActivityForUser.replace('{username}', user.username)}
                    </span>
                    <span className="sm:hidden">Lisää</span>
                  </button>
                  {canEditProfile && (
                    <button
                      onClick={() => setShowInsights(true)}
                      className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                        showInsights
                          ? "bg-yellow-400 text-black"
                          : "text-gray-600 hover:bg-yellow-50"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{t.userProfile.statistics}</span>
                      <span className="sm:hidden">Tilastot</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Activity Form or Insights - Mobile Optimized */}
            {(!canEditProfile || !showInsights) ? (
              isActivitySubmissionDisabled ? (
                <div className="text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-yellow-200 mx-4 sm:mx-0">
                  <Bike className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    {t.userProfile.submissionClosed}
                  </p>
                </div>
              ) : (
                <section ref={formRef} className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-yellow-200 mx-1 sm:mx-0">
                  <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center text-gray-800">
                    <Bike className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-2xl">
                      {isEditing 
                        ? t.userProfile.updatePerformance 
                        : canEditProfile 
                          ? t.userProfile.addPerformance 
                          : t.userProfile.addActivityForUser.replace('{username}', user.username)
                      }
                    </span>
                  </h2>
                  <form
                    onSubmit={isEditing ? handleUpdateActivity : handleAddActivity}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        {t.userProfile.activityType}
                      </label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
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

                    {/* Custom activity input */}
                    {activity.startsWith("Muu(") && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          {t.userProfile.specifyActivity}
                        </label>
                        <input
                          type="text"
                          value={customActivity}
                          onChange={(e) => setCustomActivity(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                          required
                          placeholder={t.userProfile.enterActivityName}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          {t.userProfile.duration}
                        </label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          {t.userProfile.date}
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        {t.activityForm.bonus}
                      </label>
                      <select
                        value={bonus || ""}
                        onChange={(e) => setBonus(e.target.value || null)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:px-4 sm:py-3 text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">{t.userProfile.noBonus}</option>
                        <option value="juhlapäivä">{getBonusText("juhlapäivä")}</option>
                        <option value="enemmän kuin kolme urheilee yhdessä">{getBonusText("enemmän kuin kolme urheilee yhdessä")}</option>
                        <option value="kaikki yhdessä">{getBonusText("kaikki yhdessä")}</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="w-full sm:flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          {t.ui.cancel}
                        </button>
                      )}
                      <button
                        type="submit"
                        className="w-full sm:flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
                      >
                        {isEditing ? t.userProfile.updatePerformance : t.userProfile.addPerformance}
                      </button>
                    </div>
                  </form>
                </section>
              )
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-yellow-200 mx-1 sm:mx-0">
                <PersonalInsights
                  activities={user.activities}
                  username={user.username}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-yellow-200 mx-1 sm:mx-0">
            <div className="text-center mb-6">
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-sm sm:text-base">
                {t.userProfile.canViewStats.replace('{username}', user.username)}
              </p>
            </div>
            <PersonalInsights
              activities={user.activities}
              username={user.username}
            />
          </div>
        )}

        {/* Activities List - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center text-gray-800 px-2 sm:px-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
            {t.userProfile.performances}
          </h3>
          {user.activities.map((activity) => (
            <div key={activity.id} className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-yellow-100 mx-1 sm:mx-0">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 break-words">{activity.activity}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Bike className="w-4 h-4 mr-1 text-yellow-500 flex-shrink-0" />
                      {activity.kilometers.toFixed(1)} {t.userProfile.km}
                    </span>
                    <span className="flex items-center">
                      🕒 {activity.duration} {t.insights.mins}
                    </span>
                  </div>
                  {activity.bonus && (
                    <p className="text-xs sm:text-sm text-yellow-600 mb-2 break-words">
                      {getBonusText(activity.bonus)}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500">
                    📅 {new Date(activity.date).toLocaleDateString("fi-FI")}
                  </p>
                </div>
                {canEditProfile && (
                  <div className="flex space-x-2 mt-3 sm:mt-0 sm:ml-4 self-start">
                    <button
                      className="text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded text-xs sm:text-sm bg-gray-50 hover:bg-gray-100"
                      onClick={() => startEdit(activity)}
                    >
                      {t.ui.edit}
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded text-xs sm:text-sm bg-red-50 hover:bg-red-100"
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
              <div className="mt-4">
                <CommentAndReactionView activityId={activity.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {user.pagination && user.pagination.totalPages > 1 && (
          <div className="mt-6 sm:mt-8 px-2 sm:px-0">
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
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-yellow-200 mx-1 sm:mx-0">
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