"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ConfirmationModal from "@/app/components/ConfirmationModal";

interface Activity {
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
}

interface User {
  username: string;
  totalKm: number;
  activities: Activity[];
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
  "Muu",
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
  Muu: (hours) => hours * 100,
  "Ryhmä, HIIT": (hours) => hours * 100,
  Kehonpainotreeni: (hours) => hours * 100,
  Jalkapallo: (hours) => hours * 100,
  Jääkiekko: (hours) => hours * 100,
  Kamppailulaji: (hours) => hours * 100,
};

const calculateKilometers = (activity: string, duration: number) => {
  const hours = duration / 60;
  const calculate = activityPoints[activity];
  return calculate ? calculate(hours) : 0;
};

const UserProfile = () => {
  const params = useParams();
  const username = params?.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [page, _setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [activityDetails, setActivityDetails] = useState<{
      activity: string;
      date: string;
      duration: number;
    } | null>(null);

  // Ref for the form section
  const formRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/users/${username}?page=${page}&limit=10`
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
    if (deleteIndex === null) return;
    try {
      await fetch(
        `http://localhost:5001/users/${username}/activities/${deleteIndex}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsModalOpen(false);
      fetchUser(); // Reload user data
    } catch (err) {
      setError((err as Error).message);
    }
  };


  const openDeleteModal = (index: number) => {
    const activity = user?.activities[index];
    if (activity) {
      setActivityDetails({
        activity: activity.activity,
        date: activity.date,
        duration: activity.duration,
      });
      setDeleteIndex(index);
      setIsModalOpen(true);
    }
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
  };

  const handleUpdateActivity = (index: number) => {
    const activityToUpdate = user?.activities[index];
    if (activityToUpdate) {
      setActivity(activityToUpdate.activity);
      setDuration(activityToUpdate.duration.toString());
      setDate(activityToUpdate.date.split("T")[0]);
      setIsEditing(true);
      setEditingIndex(index);

      // Scroll to the form
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const saveUpdatedActivity = async () => {
    if (editingIndex === null) return;
    try {
      const kilometers = calculateKilometers(activity, Number(duration));
      await fetch(
        `http://localhost:5001/users/${username}/activities/${editingIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity,
            duration: Number(duration),
            date,
            kilometers,
          }),
        }
      );
      fetchUser();
      setIsEditing(false);
      setActivity("");
      setDuration("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddActivity = async () => {
    try {
      const kilometers = calculateKilometers(activity, Number(duration));
      await fetch(`http://localhost:5001/users/${username}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity,
          duration: Number(duration),
          date,
          kilometers,
        }),
      });
      fetchUser();
      setActivity("");
      setDuration("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      setError((err as Error).message);
    }
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`}
            alt="User Avatar"
            className="w-16 h-16 rounded-full"
            width={64} // Image width in pixels
            height={64} // Image height in pixels
            unoptimized // Bypass Next.js optimization for this remote image
          />

          <div>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-gray-600">{user?.totalKm.toFixed(1)} km</p>
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
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditing) {
              saveUpdatedActivity();
            } else {
              handleAddActivity();
            }
          }}
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
          <div className="flex justify-between items-center space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setActivity("");
                  setDuration("");
                  setDate(new Date().toISOString().split("T")[0]);
                }}
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
        onCancel={closeDeleteModal}
        activityDetails={activityDetails || undefined}
      />
      {/* Activities List */}
      {user?.activities.map((activity, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{activity.activity}</h3>
              <p className="text-sm text-gray-600">
                {activity.kilometers.toFixed(1)} km | {activity.duration} mins
              </p>
              <p className="text-sm text-gray-400">
                {new Date(activity.date).toLocaleDateString("fi-FI")}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-purple-500 hover:text-purple-500"
                onClick={() => handleUpdateActivity(index)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:text-red-500"
                onClick={() => openDeleteModal(index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
