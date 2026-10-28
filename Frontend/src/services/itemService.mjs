const API_URL = "http://localhost:3000/api/items";

export async function getAllItems() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.error || "Unable to retrieve items.");
  }

  return response.json();
}