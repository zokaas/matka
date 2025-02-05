// src/utils/geocodeHelper.ts
import axios from "axios";

export const fetchCityName = async (lng: number, lat: number) => {
  const accessToken =
    "pk.eyJ1Ijoiem9rYWFzIiwiYSI6ImNtNnA2bmRubzA0ZDQya3NhZmk3bWQzMG8ifQ.Ej3pG0ieo8JRm-a46W9WGA"; // Replace with your actual Mapbox token
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    const city = response.data.features[0]?.text;
    return city || "Unknown City";
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "Unknown City";
  }
};
