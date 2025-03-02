import { Dispatch, SetStateAction } from "react";
import { User, Activity } from "@/app/types/types";

const backendUrl = "https://matka-zogy.onrender.com";

export const fetchUsersAndTotalKm = async (
  setUsers: Dispatch<SetStateAction<User[]>>,
  setTotalKm: Dispatch<SetStateAction<number>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  try {
    setLoading(true);
    const [totalResponse, usersResponse] = await Promise.all([
      fetch(`${backendUrl}/total-kilometers`),
      fetch(`${backendUrl}/users`),
    ]);

    if (!totalResponse.ok) throw new Error("Failed to fetch total kilometers");
    if (!usersResponse.ok) throw new Error("Failed to fetch users");

    const totalData: { totalKm: number } = await totalResponse.json();
    const usersData: User[] = await usersResponse.json();

    setTotalKm(totalData.totalKm);
    setUsers(usersData);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
};

export const fetchRecentActivities = async (
  users: User[],
  setRecentActivities: Dispatch<SetStateAction<Activity[]>>,
  setLoadingActivities: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  try {
    setLoadingActivities(true);

    const activityPromises = users.map(async (user: User) => {
      const response = await fetch(
        `${backendUrl}/users/${user.username}/activities/all`
      );
      if (response.ok) {
        const userActivities: Activity[] = await response.json();
        return userActivities.map((activity: Activity) => ({
          ...activity,
          username: user.username,
          profilePicture: user.profilePicture,
        }));
      }
      return [];
    });

    const allActivities = (await Promise.all(activityPromises)).flat();
    const activities = allActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    setRecentActivities(activities);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoadingActivities(false);
  }
};
