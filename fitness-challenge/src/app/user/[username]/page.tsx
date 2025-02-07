"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Pagination from "@/app/components/Pagination";

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
  "Muu(100km/h)",
  "Muu(50km/h)",
  "Ryhmä, HIIT",
  "Kehonpainotreeni",
  "Jalkapallo",
  "Jääkiekko",
  "Kamppailulaji",
];

const activityPoints: {
  [key: string]: (hours: number) => number;
} = {
  Juoksu: (hours) => hours * 100,
  Sali: (hours) => hours * 100,
  Tennis: (hours) => hours * 100,
  Pyöräily: (hours) => (hours > 1 ? 100 + (hours - 1) * 50 : hours * 100),
  Hiihto: (hours) => (hours > 1 ? 100 + (hours - 1) * 50 : hours * 100),
  Uinti: (hours) => hours * 200,
  Crossfit: (hours) => hours * 100,
  Tribe: (hours) => hours * 100,
  "Ryhmä, pump": (hours) => hours * 100,
  "Ryhmä, dance": (hours) => hours * 100,
  "Ryhmä, combat": (hours) => hours * 100,
  Spinning: (hours) => hours * 100,
  Squash: (hours) => hours * 100,
  Sulkapallo: (hours) => hours * 100,
  Padel: (hours) => hours * 100,
  Jooga: (hours) => hours * 50,
  Liikkuvuus: (hours) => hours * 50,
  Golf: (hours) => hours * 25,
  "Muu(100km/h)": (hours) => hours * 100,
  "Muu(50km/h)": (hours) => hours * 50,
  "Ryhmä, HIIT": (hours) => hours * 100,
  Kehonpainotreeni: (hours) => hours * 100,
  Jalkapallo: (hours) => hours * 100,
  Jääkiekko: (hours) => hours * 100,
  Kamppailulaji: (hours) => hours * 100,
};

const calculateKilometers = (activity: string, duration: number) => {
  const hours = duration / 60;

  // Check if activity is "Muu(100km/h)" or "Muu(50km/h)"
  if (activity.includes("Muu(100km/h)")) return hours * 100;
  if (activity.includes("Muu(50km/h)")) return hours * 50;

  // Default lookup in activityPoints
  const calculate = activityPoints[activity];
  return calculate ? calculate(hours) : 0;
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

    // ✅ Correct way to append custom activity name
    if (
      (activity === "Muu(100km/h)" || activity === "Muu(50km/h)") &&
      customActivity
    ) {
      selectedActivity = `${customActivity} / ${activity}`;
    }

    let kilometers = calculateKilometers(selectedActivity, Number(duration));

    // ✅ Apply bonus multipliers
    if (bonus) {
      switch (bonus) {
        case "juhlapäivä":
          kilometers *= 2;
          break;
        case "enemmän kuin kolme urheilee yhdessä":
          kilometers *= 1.5;
          break;
        case "kaikki yhdessä":
          kilometers *= 3;
          break;
      }
    }

    const response = await fetch(`${backendUrl}/users/${username}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity: selectedActivity,
        duration: Number(duration),
        date,
        kilometers,
        bonus,
      }),
    });

    if (!response.ok) throw new Error("Failed to add activity");
    resetForm();
    fetchUser();
  } catch (err) {
    setError((err as Error).message);
  }
};



const handleUpdateActivity = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingActivity?.id) return;

  try {
    let selectedActivity = activity;
    if (
      (activity === "Muu(100km/h)" || activity === "Muu(50km/h)") &&
      customActivity
    ) {
      selectedActivity = `${customActivity} / ${activity}`;
    }

    let kilometers = calculateKilometers(selectedActivity, Number(duration));

    // ✅ Apply bonus multipliers
    if (bonus) {
      switch (bonus) {
        case "juhlapäivä":
          kilometers *= 2;
          break;
        case "enemmän kuin kolme urheilee yhdessä":
          kilometers *= 1.5;
          break;
        case "kaikki yhdessä":
          kilometers *= 3;
          break;
      }
    }

    console.log(
      "Updating activity:",
      selectedActivity,
      "with",
      kilometers,
      "km"
    );

    const response = await fetch(
      `${backendUrl}/users/${username}/activities/${editingActivity.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: selectedActivity,
          duration: Number(duration),
          date,
          kilometers,
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
    setEditingActivity(activity);
    setActivity(activity.activity);
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
    return <div className="text-center text-gray-500 p-4">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
            alt="User Avatar"
            className="w-16 h-16 rounded-full"
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
          Back to Home
        </Link>
      </header>

      <section ref={formRef} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? "Update Activity" : "Add Activity"}
        </h2>
        <form
          onSubmit={isEditing ? handleUpdateActivity : handleAddActivity}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Activity Type</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            >
              <option value="">Select an activity</option>
              {sportsOptions.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {(activity === "Muu(100km/h)" || activity === "Muu(50km/h)") && (
            <div>
              <label className="block text-sm font-medium">
                Specify Activity Name
              </label>
              <input
                type="text"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="w-full border rounded px-4 py-2"
                required
                placeholder="Enter activity name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">
              Duration (minutes)
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
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium">Bonus</label>
            <select
              value={bonus || ""}
              onChange={(e) => setBonus(e.target.value || null)}
              className="w-full border rounded px-4 py-2"
            >
              <option value="">Ei bonuksia</option>
              <option value="juhlapäivä">Juhlapäivä (2x km)</option>
              <option value="enemmän kuin kolme urheilee yhdessä">
                Enemmän kuin kolme urheilee yhdessä (1.5x km)
              </option>
              <option value="kaikki yhdessä">Kaikki yhdessä (3x km)</option>
            </select>
          </div> */}

          <div className="flex justify-between items-center space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-300 text-gray-500 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              {isEditing ? "Update Activity" : "Add Activity"}
            </button>
          </div>
        </form>
      </section>

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
                  {activity.kilometers.toFixed(1)} km | {activity.duration} mins
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
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    setActivityToDelete(activity);
                    setIsModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
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
    </div>
  );
};

export default UserProfile;
