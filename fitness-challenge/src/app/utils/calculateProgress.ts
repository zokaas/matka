import { User } from "../types/types";

export function calculateProgress(users: User[]) {
  return users.reduce((sum, user) => sum + user.totalKm, 0);
}
