// Tour de France 2025 Route - Real stages and coordinates
export const tourDeFranceRoute = [
  // Stage 1: Grand Départ
  {
    city: "Florence",
    coordinates: {
      latitude: 43.7696,
      longitude: 11.2558,
    },
    stage: 1,
    stageType: "flat",
    distance: 206,
    description: "Grand Départ - Renaissance city start",
    pointsRequired: 0,
  },
  
  // Stage 2
  {
    city: "Rimini", 
    coordinates: {
      latitude: 44.0678,
      longitude: 12.5695,
    },
    stage: 2,
    stageType: "flat", 
    distance: 199,
    description: "Adriatic coast sprint finish",
    pointsRequired: 160,
  },

  // Stage 3
  {
    city: "Bologna",
    coordinates: {  
      latitude: 44.4949,
      longitude: 11.3426,
    },
    stage: 3,
    stageType: "hilly",
    distance: 230,
    description: "Rolling hills through Emilia-Romagna", 
    pointsRequired: 320,
  },

  // Stage 4
  {
    city: "Turin",
    coordinates: {
      latitude: 45.0703,
      longitude: 7.6869,
    },
    stage: 4,
    stageType: "flat",
    distance: 152,
    description: "Into Piedmont - sprinters' stage",
    pointsRequired: 480,
  },

  // Stage 5 - First mountain stage
  {
    city: "Valloire",
    coordinates: {
      latitude: 45.1667,
      longitude: 6.4333,
    },
    stage: 5,
    stageType: "mountain",
    distance: 177,
    description: "First Alpine test - Col du Galibier",
    pointsRequired: 640,
  },

  // Stage 6
  {
    city: "Superdévoluy",
    coordinates: {
      latitude: 44.6833,
      longitude: 5.9167,
    },
    stage: 6,
    stageType: "mountain", 
    distance: 187,
    description: "Summit finish in the Alps",
    pointsRequired: 800,
  },

  // Stage 7
  {
    city: "Mâcon",
    coordinates: {
      latitude: 46.3063,
      longitude: 4.8281,
    },
    stage: 7,
    stageType: "flat",
    distance: 168,
    description: "Through Provence to Burgundy",
    pointsRequired: 960,
  },

  // Stage 8  
  {
    city: "Dijon",
    coordinates: {
      latitude: 47.322,
      longitude: 5.0415,
    },
    stage: 8,
    stageType: "flat",
    distance: 176,
    description: "Burgundy wine country sprint",
    pointsRequired: 1120,
  },

  // Stage 9 - Time Trial
  {
    city: "Colombey-les-Deux-Églises",
    coordinates: {
      latitude: 48.2225,
      longitude: 4.8903,
    },
    stage: 9,
    stageType: "time_trial",
    distance: 34,
    description: "Individual Time Trial - race of truth",
    pointsRequired: 1280,
  },

  // Stage 10
  {
    city: "Troyes",
    coordinates: {
      latitude: 48.2973,
      longitude: 4.0744,
    },
    stage: 10,
    stageType: "flat",
    distance: 187,
    description: "Circuit race around historic Troyes",
    pointsRequired: 1440,
  },

  // Stage 11
  {
    city: "Saint-Amand-Montrond",
    coordinates: {
      latitude: 46.7206,
      longitude: 2.5044,
    },
    stage: 11,
    stageType: "flat",
    distance: 166,
    description: "Through Loire Valley châteaux",
    pointsRequired: 1600,
  },

  // Stage 12
  {
    city: "Le Lioran",
    coordinates: {
      latitude: 45.0833,
      longitude: 2.75,
    },
    stage: 12,
    stageType: "mountain",
    distance: 200,
    description: "Volcanic mountains of Auvergne",
    pointsRequired: 1760,
  },

  // Stage 13
  {
    city: "Villeneuve-sur-Lot",
    coordinates: {
      latitude: 44.4089,
      longitude: 0.7053,
    },
    stage: 13,
    stageType: "hilly",
    distance: 165,
    description: "Rolling green countryside of Lot",
    pointsRequired: 1920,
  },

  // Stage 14 - Gateway to Pyrenees  
  {
    city: "Pau",
    coordinates: {
      latitude: 43.2951,
      longitude: -0.3708,
    },
    stage: 14,
    stageType: "flat",
    distance: 198, 
    description: "Gateway to the Pyrenees",
    pointsRequired: 2080,
  },

  // Stage 15 - Queen stage
  {
    city: "Saint-Lary-Soulan",
    coordinates: {
      latitude: 42.8167,
      longitude: 0.32,
    },
    stage: 15,
    stageType: "mountain",
    distance: 159,
    description: "First Pyrenean mountain stage",
    pointsRequired: 2240,
  },

  // Stage 16 - Pyrenees queen stage
  {
    city: "Plateau de Beille",
    coordinates: {
      latitude: 42.7167,
      longitude: 1.7833,
    },
    stage: 16,
    stageType: "mountain",
    distance: 188,
    description: "Queen stage of the Pyrenees",
    pointsRequired: 2400,
  },

  // Stage 17
  {
    city: "Nîmes",
    coordinates: {
      latitude: 43.8367,
      longitude: 4.3601,
    },
    stage: 17,
    stageType: "flat",
    distance: 177,
    description: "Roman amphitheatre finish",
    pointsRequired: 2560,
  },

  // Stage 18 - Back to Alps 
  {
    city: "Superdévoluy",
    coordinates: {
      latitude: 44.6833,
      longitude: 5.9167,
    },
    stage: 18,
    stageType: "mountain",
    distance: 179,
    description: "Return to Alpine heights",
    pointsRequired: 2720,
  },

  // Stage 19
  {
    city: "Barcelonnette",
    coordinates: {
      latitude: 44.3856,
      longitude: 6.6522,
    },
    stage: 19,
    stageType: "mountain",
    distance: 145,
    description: "Through Alpine valleys",
    pointsRequired: 2880,
  },

  // Stage 20 - Final mountain stage
  {
    city: "Isola 2000",
    coordinates: {
      latitude: 44.1833,
      longitude: 6.95,
    },
    stage: 20,
    stageType: "mountain", 
    distance: 132,
    description: "Final mountain top finish",
    pointsRequired: 3040,
  },

  // Stage 21 - Champs-Élysées  
  {
    city: "Nice",
    coordinates: {
      latitude: 43.7102,
      longitude: 7.262,
    },
    stage: 21,
    stageType: "ceremonial",
    distance: 115,
    description: "Traditional final stage to Nice",
    pointsRequired: 3200,
  },

  // Final destination
  {
    city: "Champs-Élysées, Paris",
    coordinates: {
      latitude: 48.8698,
      longitude: 2.3076,
    },
    stage: 22,  
    stageType: "ceremonial",
    distance: 0,
    description: "Final celebration - Tour complete!",
    pointsRequired: 3360,
  }
];

// Stage types for filtering and display
export const stageTypes = {
  flat: "Étape plate",
  hilly: "Étape vallonnée", 
  mountain: "Étape de montagne",
  time_trial: "Contre-la-montre",
  ceremonial: "Étape d'honneur"
};

// Points calculation by activity intensity
export const activityPoints = {
  high: 4,      // Juoksu, CrossFit, Spinning, etc.
  medium: 3,    // Pyöräily, Sali, Tennis, etc.  
  low: 2        // Uinti, Jooga, Golf, etc.
};

// Bonus multipliers for special conditions
export const bonusMultipliers = {
  "vent_arriere": 2.0,        // Tailwind (perfect weather)
  "peloton": 1.5,             // Group training (3+ people) 
  "echappee": 3.0             // Solo breakaway (individual achievement)
};

// Total challenge parameters
export const challengeParams = {
  totalStages: 21,
  totalPoints: 3360,
  startDate: "2025-08-01",
  endDate: "2025-12-19", 
  totalDays: 140,
  totalDistance: 3338.8  // Real Tour de France distance in km
};