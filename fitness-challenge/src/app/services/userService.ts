export async function fetchAllUsers() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
  const response = await fetch(`${backendUrl}/users`, { cache: "no-store"}); // Fixed template literal
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json(); // This will return the array of users
}
