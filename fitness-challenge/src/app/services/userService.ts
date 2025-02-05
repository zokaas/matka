export async function fetchAllUsers() {
  const response = await fetch("http://localhost:5001/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json(); // This will return the array of users
}
