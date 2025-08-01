import { Theme } from './themeTypes';
import { ThemeTranslations } from './translationKeys';

export const tourDeFranceTheme: Theme = {
  name: "Tour de France 2025",
  totalStages: 21,
  totalDistance: 3338.8,
  totalPoints: 3338.8,

  stages: [
    {
      name: "Lille Métropole → Lille Métropole",
      pointsRequired: 0,
      emoji: "🏁",
      description: "Stage 1 loop around Lille",
      stageType: "flat",
      weather: "Sunny",
      location: "Lille, France",
      color: "from-yellow-200 to-yellow-400"
    },
    {
      name: "Lauwin‑Planque → Boulogne‑sur‑Mer",
      pointsRequired: 184.9,
      emoji: "🌊",
      description: "Stage 2 longest & hilly cross‑wind",
      stageType: "hilly",
      weather: "Windy",
      location: "Boulogne-sur-Mer, France",
      color: "from-blue-200 to-blue-400"
    },
    {
      name: "Valenciennes → Dunkerque",
      pointsRequired: 394.0,
      emoji: "🚴",
      description: "Flat northern France coastal",
      stageType: "flat",
      weather: "Cloudy",
      location: "Dunkerque, France",
      color: "from-indigo-200 to-indigo-400"
    },
    {
      name: "Amiens Métropole → Rouen",
      pointsRequired: 572.3,
      emoji: "⚡",
      description: "Flat into Normandy",
      stageType: "flat",
      weather: "Variable",
      location: "Rouen, France",
      color: "from-gray-200 to-gray-400"
    },
    {
      name: "Caen → Caen (ITT)",
      pointsRequired: 745.5,
      emoji: "⏱️",
      description: "33 km individual time trial",
      stageType: "time_trial",
      weather: "Cloudy",
      location: "Caen, France",
      color: "from-cyan-300 to-cyan-500"
    },
    {
      name: "Bayeux → Vire Normandie",
      pointsRequired: 947.0,
      emoji: "🚣️",
      description: "Hilly with climbs into Normandy",
      stageType: "hilly",
      weather: "Cloudy",
      location: "Vire Normandie, France",
      color: "from-green-300 to-green-500"
    },
    {
      name: "Saint‑Malo → Mûr‑de‑Bretagne Guerlédan",
      pointsRequired: 1141.0,
      emoji: "⛰️",
      description: "Hilly with hilltop finish",
      stageType: "hilly",
      weather: "Variable",
      location: "Mûr-de-Bretagne, France",
      color: "from-lime-400 to-lime-600"
    },
    {
      name: "Saint‑Méen‑le‑Grand → Laval Espace Mayenne",
      pointsRequired: 1312.4,
      emoji: "🍃",
      description: "Flat sprint stage",
      stageType: "flat",
      weather: "Sunny",
      location: "Laval, France",
      color: "from-amber-300 to-amber-500"
    },
    {
      name: "Chinon → Châteauroux",
      pointsRequired: 1486.5,
      emoji: "⚡",
      description: "Flat with crosswinds possible",
      stageType: "flat",
      weather: "Cloudy",
      location: "Châteauroux, France",
      color: "from-rose-300 to-rose-500"
    },
    {
      name: "Ennezat → Le Mont‑Dore (Puy de Sancy)",
      pointsRequired: 1649.8,
      emoji: "🏔️",
      description: "Mountain finish in Massif Central",
      stageType: "mountain",
      weather: "Windy",
      location: "Le Mont-Dore, France",
      color: "from-red-400 to-red-600"
    },
    {
      name: "Toulouse → Toulouse",
      pointsRequired: 1806.6,
      emoji: "🕒",
      description: "Flat loop around Toulouse",
      stageType: "flat",
      weather: "Sunny",
      location: "Toulouse, France",
      color: "from-yellow-200 to-yellow-400"
    },
    {
      name: "Auch → Hautacam",
      pointsRequired: 1987.2,
      emoji: "🔺",
      description: "Mountain finish at Hautacam",
      stageType: "mountain",
      weather: "Cloudy",
      location: "Hautacam, France",
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Loudenvielle → Peyragudes (TTT)",
      pointsRequired: 1998.1,
      emoji: "⏱️",
      description: "Mountain time trial to Peyragudes",
      stageType: "time_trial",
      weather: "Variable",
      location: "Peyragudes, France",
      color: "from-cyan-400 to-cyan-600"
    },
    {
      name: "Pau → Luchon‑Superbagnères",
      pointsRequired: 2180.7,
      emoji: "🟛",
      description: "Queen stage in Pyrenees",
      stageType: "mountain",
      weather: "Storm",
      location: "Luchon-Superbagnères, France",
      color: "from-violet-500 to-violet-700"
    },
    {
      name: "Muret → Carcassonne",
      pointsRequired: 2350.0,
      emoji: "🌿",
      description: "Hilly rolling terrain to Carcassonne",
      stageType: "hilly",
      weather: "Cloudy",
      location: "Carcassonne, France",
      color: "from-green-400 to-green-600"
    },
    {
      name: "Montpellier → Mont Ventoux",
      pointsRequired: 2521.5,
      emoji: "🌋",
      description: "Summit finish up Mont Ventoux",
      stageType: "mountain",
      weather: "Windy",
      location: "Mont Ventoux, France",
      color: "from-slate-400 to-slate-600"
    },
    {
      name: "Bollène → Valence",
      pointsRequired: 2681.9,
      emoji: "🌼",
      description: "Flat sprint through Provence",
      stageType: "flat",
      weather: "Sunny",
      location: "Valence, France",
      color: "from-orange-300 to-orange-500"
    },
    {
      name: "Vif → Courchevel (Col de la Loze)",
      pointsRequired: 2853.4,
      emoji: "🧷",
      description: "Alpine summit finish at Loze",
      stageType: "mountain",
      weather: "Cloudy",
      location: "Courchevel, France",
      color: "from-teal-400 to-teal-600"
    },
    {
      name: "Albertville → La Plagne",
      pointsRequired: 2946.5,
      emoji: "🏔️",
      description: "Shortened mountain stage to La Plagne",
      stageType: "mountain",
      weather: "Storm",
      location: "La Plagne, France",
      color: "from-gray-500 to-gray-700"
    },
    {
      name: "Nantua → Pontarlier",
      pointsRequired: 3130.7,
      emoji: "🌲",
      description: "Hilly exit from Alps",
      stageType: "hilly",
      weather: "Variable",
      location: "Pontarlier, France",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      name: "Mantes‑la‑Ville → Paris (Champs‑Élysées)",
      pointsRequired: 3338.8,
      emoji: "🏆",
      description: "Ceremonial finish in Paris with Montmartre circuit",
      stageType: "ceremonial",
      weather: "Sunny",
      location: "Paris, France",
      color: "from-yellow-400 to-yellow-600"
    }
  ],

  weatherIcons: {
    Sunny: "☀️",
    Cloudy: "☁️",
    Windy: "💨",
    Variable: "🌤️",
    Storm: "⛈️"
  },

  stageColors: {
    flat: "text-yellow-600",
    hilly: "text-green-600",
    mountain: "text-red-600",
    time_trial: "text-purple-600",
    ceremonial: "text-slate-600"
  },

translations: {
  title: "Tour de France -haaste",
  teamTitle: "Tiimi",
  dashboardTitle: "Tour de France -haaste",
  subtitle: "Joukkue etenee yhdessä etappi etapilta!",
  selectThemeLabel: "Valitse teema",
  selectUserLabel: "Valitse käyttäjä",
  selectUserPlaceholder: "Valitse oma profiilisi...",
  loginTitle: "Tervetuloa takaisin!",
  loginSubtitle: "Kirjaudu mukaan haasteeseen ja seuraa matkaa.",
  loginButton: "Liity pelotoniin",
  loginEmoji: "🚴‍♂️",
  stageLabel: "Etappi",
  stageSubtitle: "Stage {{number}} loop around {{location}}",
  nextStage: "Seuraava etappi",
  points: "Pisteet",
  pointsToNext: "pistettä seuraavaan etappiin",
  weather: "Sää",
  type: "Etappityyppi",
  stagesTitle: "Etapit",
  completed: "Valmis",
  current: "Nykyinen",
  upcoming: "Tulossa",
  leaderboardTitle: "🏆 Sijoitukset",
  weeklyGoal: "Viikon tavoite",
  kmRemaining: "{{km}} km jäljellä",
  tabs: {
    leaderboard: "Sijoitukset",
    weekly: "Viikon tilanne",
    quotes: "Kannustus"
  },
  submitQuoteTitle: "Kannusta joukkuettasi",
  submitQuotePlaceholder: "Kirjoita kannustava viesti...",
  submitButton: "Lähetä",
  activeUsers: "Aktiivisia osallistujia",
  totalPointsLabel: "Yhteispisteet",
  goalLabel: "Tavoite: 100 000 km",
  routeLabel: "Reitti: Ranska ympäri",
  loginNote: "Pisteet perustuvat liikutun matkan kilometreihin.",
  loading: "Ladataan...",
  error: "Tapahtui virhe.",

  } satisfies ThemeTranslations
};
