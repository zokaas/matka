const { Client } = require('pg');
const axios = require('axios');

// Setup the PostgreSQL client
const client = new Client({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost", // Replace with your PostgreSQL host (localhost if using locally)
  database: "fitness_challenge", // Replace with your database name
  password: "password", // Replace with your PostgreSQL password
  port: 5432,
});

client.connect();

// src/data/routeCoordinates.ts
const routeCoordinates = [
  { lat: 60.16799853984939, lng: 24.93845661452464 },
  { lat: 59.42715326738188, lng: 24.75664047724949 },
  { lat: 56.98042949659164, lng: 24.20661378710277 },
  { lat: 54.7349885677892, lng: 25.24703987726358 },
  { lat: 53.69596058297265, lng: 23.84999969158612 },
  { lat: 53.12222400021064, lng: 23.19488998433656 },
  { lat: 52.24227837994011, lng: 21.04981030687476 },
  { lat: 50.09971768216875, lng: 20.01312777464484 },
  { lat: 49.31596672097686, lng: 19.98409608570164 },
  { lat: 48.1470712982961, lng: 17.15233034496324 },

  { lat: 47.51506755039273, lng: 19.03332731331942 },
  { lat: 45.77852379284523, lng: 19.12015347749433 },
  { lat: 45.24748645508277, lng: 19.81627351954839 },
  { lat: 44.81175910324708, lng: 20.43934384654844 },
  { lat: 43.34211640801123, lng: 21.88018050519399 },
  { lat: 41.98113884883291, lng: 21.44070779153685 },
  { lat: 41.11916669624408, lng: 20.81064248667864 },
  { lat: 40.63261583181713, lng: 22.98525189906259 },
  
  { lat: 41.67368940659769, lng: 26.51921294728274 },
  { lat: 41.17032152962137, lng: 27.8888592386277 },
  { lat: 41.00111774059417, lng: 29.01173053419105 },
  { lat: 40.76994747406403, lng: 29.95775816097148 },
  { lat: 39.9823411582942, lng: 32.86109060852739 },
  { lat: 38.71836480572016, lng: 35.45867908676192 },
  { lat: 37.08275713786376, lng: 37.42025636253266 },
  { lat: 33.90575852073552, lng: 35.56263996459074 },
  { lat: 31.7529328909506, lng: 35.20667808289762 },
  { lat: 31.3249215181521, lng: 37.3754119288286 },
  
  { lat: 28.38365278513249, lng: 36.56413379497275 },
  { lat: 24.72604578092639, lng: 46.75042925381339 },
  { lat: 26.93655428672138, lng: 49.55143761638551 },
  { lat: 29.38449668076445, lng: 47.9624635811121 },
  { lat: 30.46883385515122, lng: 47.75425778852988 },
  { lat: 35.67049694513908, lng: 51.312576585046 },
  { lat: 37.2788571990849, lng: 49.58686413230824 },
  { lat: 40.38839591558383, lng: 49.86175452228206 },
  { lat: 39.99189363566977, lng: 53.03737178716911 },
  { lat: 39.49057139854231, lng: 54.40498842774863 },
  { lat: 37.97513166826424, lng: 58.367391422995 },
  
  { lat: 37.6042060778158, lng: 61.91017605035648 },
  { lat: 38.99619127741174, lng: 63.60243275307904 },
  { lat: 38.84026370775671, lng: 65.81830297974243 },
  { lat: 38.524637635994, lng: 68.79940709922923 },
  { lat: 37.91519692555818, lng: 71.44950429032778 },
  { lat: 34.55352326443564, lng: 69.2546884202746 },
  { lat: 34.00388320102394, lng: 71.52331847018137 },
  { lat: 33.68753175494034, lng: 73.0616854152447 },
  { lat: 32.72810165837831, lng: 74.85819728442463 },
  { lat: 31.5275545897153, lng: 74.38918094530285 },
  { lat: 28.61317794277121, lng: 77.18802614530654 },

  
  { lat: 26.8496982807259, lng: 80.96461521968232 },
  { lat: 27.70429549817583, lng: 85.37463527878495 },
  { lat: 27.47607829936489, lng: 89.6574000295419 },
  { lat: 25.67946916338792, lng: 94.12666237466553 },
  { lat: 27.49214422211595, lng: 95.39003003296409 },
  { lat: 25.84221898505962, lng: 98.91267640880667 },
  { lat: 25.58785191336392, lng: 100.3810122484753 },
  { lat: 25.10258017579965, lng: 99.25208157041244 },
  { lat: 24.43996487278945, lng: 98.6268446947997 },
  { lat: 22.75011294392952, lng: 100.9904937588914 },
  { lat: 21.95255799433961, lng: 100.8711240867674 },
  { lat: 18.82381889439992, lng: 98.97623117042957 },

  { lat: 13.73996845845417, lng: 100.55027198679 },
  { lat: 12.95829968946786, lng: 100.8770521966313 },
  { lat: 9.501572019947359, lng: 100.0445848239012 },
  { lat: 3.153946854161612, lng: 101.7126711925203 },
  { lat: 3.618932935003251, lng: 98.68457200947212 },
  { lat: -0.3069496466115846, lng: 100.4110560422004 },
  { lat: -1.687064523555272, lng: 103.7107162356618 },
  { lat: -5.379635658301418, lng: 105.2948741870999 },
  { lat: -6.908765959117314, lng: 107.5924344794589 },
  { lat: -7.24678262024276, lng: 112.7468953457086 },
  { lat: -8.641288744798718, lng: 115.2815516774732 },
  
  { lat: -8.499219604472966, lng: 118.779323428452 },
  { lat: -10.18870418972721, lng: 123.6145405966534 },
  { lat: -12.44742963851979, lng: 130.8789767291657 },
  { lat: -14.90262833067951, lng: 133.0931577470323 },
  { lat: -16.67502409122337, lng: 135.7380794076906 },
  { lat: -18.96709843559675, lng: 138.0628391083857 },
  { lat: -22.38147977552029, lng: 143.0646147490245 },
  { lat: -23.55030055228698, lng: 145.3086481992247 },
  { lat: -26.57361218248615, lng: 148.8274724531286 },
  { lat: -27.51488230274748, lng: 153.0647936555955 },
  { lat: -45.05414266999785, lng: 168.696238160506 },
  { lat: -29.16025695789251, lng: 168.0208211251764 },
  { lat: -22.24132069728099, lng: 166.4485265731658 },
  { lat: -20.56000431771627, lng: 164.3438329460196 },
  { lat: -17.74479810967488, lng: 168.3693767625068 },
  { lat: -15.52083433681592, lng: 167.1818270435946 },
  { lat: -9.422559168056052, lng: 159.6184495637354 },
  { lat: -8.464732968848708, lng: 151.0377878487891 },
  { lat: -9.462570185241562, lng: 147.1819164216404 },
];


const accessToken = "pk.eyJ1Ijoiem9rYWFzIiwiYSI6ImNtNnA2bmRubzA0ZDQya3NhZmk3bWQzMG8ifQ.Ej3pG0ieo8JRm-a46W9WGA"; // Replace with your actual Mapbox token

// Function to fetch city name from Mapbox Geocoding API
const fetchCityName = async (lat, lng) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    const city = response.data.features[0]?.text || "Unknown City";
    return city;
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "Unknown City";
  }
};

// Function to insert coordinates and city names into the database
const insertCoordinates = async () => {
  for (let coord of routeCoordinates) {
    const cityName = await fetchCityName(coord.lat, coord.lng);
    await client.query(
      'INSERT INTO route_coordinates (city_name, lat, lng, cumulative_distance) VALUES ($1, $2, $3, $4)',
      [cityName, coord.lat, coord.lng, 0] // Replace 0 with actual cumulative distance if needed
    );
    console.log(`Inserted: ${cityName} at [${coord.lat}, ${coord.lng}]`);
  }
  console.log("Data insertion complete!");
  client.end();
};

insertCoordinates().catch((error) => console.error("Error inserting data:", error));
