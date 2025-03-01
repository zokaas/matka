"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Pagination from "@/app/components/Pagination";
import SubmitQuote from "@/app/components/SubmitQuote";
import PersonalInsights from "@/app/components/PersonalInsights";
import CommentAndReactionView from "@/app/components/CommentAndReactionView"; // Import the new component

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
};

const itemsPerPage = 10;

const UserProfile = () => {
  const params = useParams();
  const username = params?.username as string;
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
  // Add state to toggle between activity form and insights
  const [showInsights, setShowInsights] = useState(false);

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
    if (!activityToDelete?.id) return;
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
    try {
      let selectedActivity = activity;

      // Ensure the activity name format is correct for "Muu"
      if (activity.startsWith("Muu(") && customActivity) {
        selectedActivity = `${customActivity} / ${activity}`;
      }

      const response = await fetch(
        `${backendUrl}/users/${username}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity: selectedActivity, // ✅ Store it properly
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

    if (!editingActivity) return;

    try {
      let selectedActivity = activity;

      // Ensure correct format for custom "Muu" activities
      if (activity.startsWith("Muu(") && customActivity) {
        selectedActivity = `${customActivity} / ${activity}`; // Store as "Custom Name / Muu(100km/h)"
      }

      const response = await fetch(
        `${backendUrl}/users/${username}/activities/${editingActivity.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity: selectedActivity, // ✅ Correct format
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
    setDuration("");
    setDate(new Date().toISOString().split("T")[0]);
    setBonus(null);
  };

  const startEdit = (activity: Activity) => {
    // Switch to activity form view if in insights view
    if (showInsights) {
      setShowInsights(false);
    }

    // Check if the activity is a custom "Muu" activity
    const muuMatch = activity.activity.match(/(.*?)\s*\/\s*(Muu\(.*?\))/);

    if (muuMatch) {
      // Extract custom name and "Muu" type separately
      setCustomActivity(muuMatch[1]); // Custom part
      setActivity(muuMatch[2]); // The base "Muu(100km/h)" or "Muu(50km/h)"
    } else {
      setActivity(activity.activity); // Normal activities
      setCustomActivity(""); // Reset custom activity field
    }

    setEditingActivity(activity);
    setDuration(activity.duration.toString());
    setDate(activity.date.split("T")[0]);
    setBonus(activity.bonus || "");
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 p-4">
        {translations.userNotFound}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src={
              user.profilePicture
                ? `https://matka-xi.vercel.app/${user.username}.png`
                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
            }
            alt="User Avatar"
            width={64}
            height={64}
            unoptimized
          />
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.totalKm.toFixed(1)} km</p>
          </div>
        </div>
        <Link href="/" className="text-purple-500 hover:underline">
          {translations.back}
        </Link>
      </header>

      {/* Toggle button to switch between activity form and insights */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-1 shadow inline-flex">
          <button
            onClick={() => setShowInsights(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !showInsights
                ? "bg-purple-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {translations.addActivity}
          </button>
          <button
            onClick={() => setShowInsights(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              showInsights
                ? "bg-purple-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tilastot
          </button>
        </div>
      </div>

      {/* Conditionally render the activity form or insights */}
      {!showInsights ? (
        <section ref={formRef} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? translations.updateActivity : translations.addActivity}
          </h2>
          <form
            onSubmit={isEditing ? handleUpdateActivity : handleAddActivity}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">
                {translations.activityType}
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full border rounded px-4 py-2"
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

            {/* Show custom input field if "Muu(100km/h)" or "Muu(50km/h)" is selected */}
            {(activity === "Muu(100km/h)" || activity === "Muu(50km/h)") && (
              <div>
                <label className="block text-sm font-medium">
                  {translations.specifyName}
                </label>
                <input
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  className="w-full border rounded px-4 py-2"
                  required
                  placeholder={translations.enterActivityName}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">
                {translations.duration}
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                {translations.date}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                {translations.bonus}
              </label>
              <select
                value={bonus || ""}
                onChange={(e) => setBonus(e.target.value || null)}
                className="w-full border rounded px-4 py-2"
              >
                <option value="">{translations.noBonus}</option>
                <option value="juhlapäivä">Juhlapäivä (2x km)</option>
                <option value="enemmän kuin kolme urheilee yhdessä">
                  Enemmän kuin kolme urheilee yhdessä (1.5x km)
                </option>
                <option value="kaikki yhdessä">Kaikki yhdessä (3x km)</option>
              </select>
            </div>

            <div className="flex justify-between items-center space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-gray-300 text-gray-500 py-2 rounded hover:bg-gray-400"
                >
                  {translations.cancel}
                </button>
              )}
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
              >
                {isEditing
                  ? translations.updateActivity
                  : translations.addActivity}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <PersonalInsights
          activities={user.activities}
          username={user.username}
        />
      )}

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
      <div className="space-y-4">
        {user.activities.map((activity) => (
          <div key={activity.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{activity.activity}</h3>
                <p className="text-sm text-gray-600">
                  {activity.kilometers.toFixed(1)} km | {activity.duration}{" "}
                  {translations.mins}
                </p>
                {activity.bonus && (
                  <p className="text-sm text-purple-500">
                    🎉 Bonus: {activity.bonus}
                    {activity.bonus === "juhlapäivä"
                      ? " (2x km)"
                      : activity.bonus === "enemmän kuin kolme urheilee yhdessä"
                      ? " (1.5x km)"
                      : " (3x km)"}
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString("fi-FI")}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-purple-500 hover:text-purple-600"
                  onClick={() => startEdit(activity)}
                >
                  {translations.edit}
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    setActivityToDelete(activity);
                    setIsModalOpen(true);
                  }}
                >
                  {translations.delete}
                </button>
              </div>
            </div>

            {/* Add the CommentAndReactionView component here */}
            <CommentAndReactionView activityId={activity.id} />
          </div>
        ))}
      </div>

      {user.pagination && user.pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={page}
            setPage={setPage}
            totalItems={user.pagination.total}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
      <SubmitQuote />
    </div>
  );
};

export default UserProfile;
