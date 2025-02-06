export async function fetchAllUsers() {
      const backendUrl = "https://matka-zogy.onrender.com";
  const response = await fetch(`${backendUrl}/users`, { cache: "no-store"}); // Fixed template literal
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json(); // This will return the array of users
}
