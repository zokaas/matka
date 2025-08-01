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

// Finnish translations
const translations = {
  back: "Takaisin etusivulle",
  addActivity: "Lisää suoritus",
  updateActivity: "Päivitä suoritus",
  activityType: "Laji",
  selectActivity: "Valitse laji",
  specifyName: "Tarkenna laji ",
  enterActivityName: "Kirjoita mikä laji",
  duration: "Kesto (minuutit)",
  date: "Päivämäärä",
  bonus: "Bonus",
  noBonus: "Ei bonuksia",
  cancel: "Peruuta",
  edit: "Muokkaa",
  delete: "Poista",
  userNotFound: "Käyttäjää ei löytynyt",
  mins: "min",
  meters: "m",
  altitude: "Korkeutta",
  insights: "Kiipeilytilastot",
  unauthorized: "Voit muokata vain omaa profiiliasi",
  loginRequired: "Kirjaudu sisään nähdäksesi profiilin",
};

const itemsPerPage = 10;

const UserProfile = () => {
  const params = useParams();
  const username = params?.username as string;
  const { currentUser, isLoggedIn } = useAuth();
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

  const backendUrl = "https://matka-zogy.onrender.com";
  const formRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/users/${username}?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [username, page]);

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
      if (!response.ok) throw new Error("Failed to delete activity");
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

      if (!response.ok) throw new Error("Failed to add activity");

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

      if (!response.ok) throw new Error("Failed to update activity");

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

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 text-center text-white max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">🏔️ {translations.loginRequired}</h2>
          <p className="text-gray-300 mb-6">Vain kirjautuneet kiipeilijät voivat tarkastella profiileja.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
            Takaisin basecampiin
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-400 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-red-400 p-4 bg-slate-800/50 rounded-lg">
          <Mountain className="w-16 h-16 mx-auto mb-4" />
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-gray-300 p-4 bg-slate-800/50 rounded-lg">
          <UserIcon className="w-16 h-16 mx-auto mb-4" />
          {translations.userNotFound}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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
                alt="Climber Avatar"
                width={80}
                height={80}
                className="rounded-full border-4 border-blue-400/50"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                🏔️ {user.username}
                {currentUser === username && <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded">Sinä</span>}
              </h1>
              <p className="text-xl text-blue-300 flex items-center">
                <Mountain className="w-5 h-5 mr-2" />
                {user.totalKm.toFixed(0)} {translations.meters} {translations.altitude}
              </p>
              <p className="text-sm text-gray-400">
                Kiipeilysuorituksia: {user.activities.length}
              </p>
            </div>
          </div>
          <Link 
            href="/" 
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Mountain className="w-4 h-4 mr-2" />
            {translations.back}
          </Link>
        </header>

        {/* Only show edit controls for own profile */}
        {canEditProfile ? (
          <>
            {/* Toggle button */}
            <div className="flex justify-center">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-full p-1 shadow inline-flex border border-white/10">
                <button
                  onClick={() => setShowInsights(false)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center ${
                    !showInsights
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <Mountain className="w-4 h-4 mr-2" />
                  {translations.addActivity}
                </button>
                <button
                  onClick={() => setShowInsights(true)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center ${
                    showInsights
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {translations.insights}
                </button>
              </div>
            </div>

            {/* Activity Form or Insights */}
            {!showInsights ? (
              isActivitySubmissionDisabled ? (
                <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <Mountain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">
                    Kiipeilysuoritusten lisääminen on suljettu, koska expeditio on päättynyt.
                  </p>
                </div>
              ) : (
                <section ref={formRef} className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Mountain className="w-6 h-6 mr-2 text-blue-400" />
                    {isEditing ? translations.updateActivity : translations.addActivity}
                  </h2>
                  <form
                    onSubmit={isEditing ? handleUpdateActivity : handleAddActivity}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        {translations.activityType}
                      </label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        required
                      >
                        <option value="">{translations.selectActivity}</option>
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
                          {translations.specifyName}
                        </label>
                        <input
                          type="text"
                          value={customActivity}
                          onChange={(e) => setCustomActivity(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          required
                          placeholder={translations.enterActivityName}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          {translations.duration}
                        </label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          {translations.date}
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        {translations.bonus}
                      </label>
                      <select
                        value={bonus || ""}
                        onChange={(e) => setBonus(e.target.value || null)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      >
                        <option value="">{translations.noBonus}</option>
                        <option value="juhlapäivä">🌞 Täydelliset sääolosuhteet (2x korkeutta)</option>
                        <option value="enemmän kuin kolme urheilee yhdessä">
                          👥 Ryhmäkiipeily (1.5x korkeutta)
                        </option>
                        <option value="kaikki yhdessä">🏔️ Koko tiimi huipulla (3x korkeutta)</option>
                      </select>
                    </div>

                    <div className="flex space-x-4">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg transition-colors"
                        >
                          {translations.cancel}
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
                      >
                        {isEditing ? translations.updateActivity : translations.addActivity}
                      </button>
                    </div>
                  </form>
                </section>
              )
            ) : (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <PersonalInsights
                  activities={user.activities}
                  username={user.username}
                />
              </div>
            )}
          </>
        ) : (
          // Show insights only for other users' profiles
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300">
                Voit tarkastella {user.username}:n kiipeilytilastoja, mutta vain omat suoritukset ovat muokattavissa.
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
            <Mountain className="w-5 h-5 mr-2 text-blue-400" />
            Kiipeilysuoritukset
          </h3>
          {user.activities.map((activity) => (
            <div key={activity.id} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow border border-white/10">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-white mb-2">{activity.activity}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                    <span className="flex items-center">
                      <Mountain className="w-4 h-4 mr-1 text-blue-400" />
                      {activity.kilometers.toFixed(0)} {translations.meters}
                    </span>
                    <span>🕒 {activity.duration} {translations.mins}</span>
                  </div>
                  {activity.bonus && (
                    <p className="text-sm text-yellow-400 mb-2">
                      🌟 Bonus: {activity.bonus}
                      {activity.bonus === "juhlapäivä"
                        ? " (2x korkeutta)"
                        : activity.bonus === "enemmän kuin kolme urheilee yhdessä"
                        ? " (1.5x korkeutta)"
                        : " (3x korkeutta)"}
                    </p>
                  )}
                  <p className="text-sm text-gray-400">
                    📅 {new Date(activity.date).toLocaleDateString("fi-FI")}
                  </p>
                </div>
                {canEditProfile && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      className="text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 rounded"
                      onClick={() => startEdit(activity)}
                    >
                      {translations.edit}
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded"
                      onClick={() => {
                        setActivityToDelete(activity);
                        setIsModalOpen(true);
                      }}
                    >
                      {translations.delete}
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
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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