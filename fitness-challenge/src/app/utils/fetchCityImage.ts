const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your key

export const fetchCityImage = async (city: string): Promise<string | null> => {
  try {
    if (
      !UNSPLASH_ACCESS_KEY ||
      UNSPLASH_ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY"
    ) {
      console.warn("Unsplash API key not configured");
      return null;
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        city
      )}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular; // Return the image URL from Unsplash
    }

    // No results found
    console.log(`No images found for ${city}`);
    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null; // Always return null on error to trigger video fallback
  }
};
