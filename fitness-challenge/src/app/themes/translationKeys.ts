export interface ThemeTranslations {
  title: string;
  dashboardTitle: string;
  subtitle: string;
  
  selectThemeLabel: string;
  selectUserLabel: string;
  selectUserPlaceholder: string;

  loginTitle: string;
  loginSubtitle: string;
  loginEmoji: string;
  loginButton: string;
  loginNote: string;

  stageLabel: string;
  stageSubtitle: string; // e.g., "Stage {{number}} loop around {{location}}"
  points: string;
  weather: string;
  type: string;
  nextStage: string;
  pointsToNext: string;

  stagesTitle: string;
  completed: string;
  current: string;
  upcoming: string;

  teamTitle: string;
  leaderboardTitle: string;
  activeUsers: string;
  totalPointsLabel: string;
  goalLabel: string;
  routeLabel: string;

  tabs: {
    leaderboard: string;
    weekly: string;
    quotes: string;
  };

  weeklyGoal: string;
  kmRemaining: string; // use with `{{km}} km jäljellä`

  submitQuoteTitle: string;
  submitQuotePlaceholder: string;
  submitButton: string;

  loading: string;
  error: string;
}
