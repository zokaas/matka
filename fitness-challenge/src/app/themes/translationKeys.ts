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

  // Navbar translations
  navbar: {
    title: string;
    statistics: string;
    climbers: string;
    loadingClimbers: string;
    errorLoadingClimbers: string;
    logout: string;
    ownProfile: string;
    failedToFetchUsers: string;
  };

  // WeeklyProgressBar translations
  weeklyProgressBar: {
    weeklyGoal: string;
    remaining: string;
    goalAchieved: string;
    kmPerPerson: string;
    errorLoadingData: string;
  };

  // Reactions translations
  reactions: {
    failedToLoad: string;
    failedToSave: string;
    addReaction: string;
  };

  // ActivityForm translations
  activityForm: {
    noActivitiesFound: string;
    bonusCalculated: string;
    bonus: string;
  };

  // Leaderboard translations
  leaderboard: {
    title: string;
    rankings: string;
    position: string;
    totalDistance: string;
    noActivities: string;
    goldMedal: string;
    silverMedal: string;
    bronzeMedal: string;
  };

  // WeeklyProgress translations  
  weeklyProgress: {
    title: string;
    thisWeek: string;
    weeklyRanking: string;
    completed: string;
    remaining: string;
    dailyTarget: string;
    weeklyTarget: string;
    daysAgo: string;
    position: string;
  };

  // ActivityFeed translations
  activityFeed: {
    title: string;
    recentActivities: string;
    noActivities: string;
    addedActivity: string;
    completedWorkout: string;
    timeAgo: string;
    showComments: string;
    hideComments: string;
  };

  // General UI translations
  ui: {
    edit: string;
    delete: string;
    cancel: string;
    save: string;
    confirm: string;
    close: string;
    next: string;
    previous: string;
    viewProfile: string;
    backToHome: string;
  };

  // PersonalInsights translations
  insights: {
    title: string;
    overview: string;
    activity: string;
    totalActivities: string;
    totalHours: string;
    totalKm: string;
    weeklyKm: string;
    currentStreak: string;
    longestStreak: string;
    days: string;
    mostFrequentActivity: string;
    personalStatistics: string;
    avgDuration: string;
    avgDistance: string;
    mins: string;
    km: string;
    activityBreakdown: string;
    times: string;
    addActivitiesToSee: string;
  };

  // Comments translations
  comments: {
    addComment: string;
    placeholder: string;
    charactersLeft: string;
    send: string;
    sending: string;
    noComments: string;
    showComments: string;
    hideComments: string;
    loadingComments: string;
  };

  // Pagination translations
  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
  };

  // Modal translations
  modal: {
    confirmDelete: string;
    confirmDeleteActivity: string;
    activityLabel: string;
    dateLabel: string;
    durationLabel: string;
    areYouSure: string;
  };

  // AllTime insights translations
  allTime: {
    title: string;
    bestKmDay: string;
    longestWorkout: string;
    currentStreak: string;
    loadingStats: string;
    mostKm: string;
    longestWorkouts: string;
    currentStreakDays: string;
    since: string;
    bonusIncluded: string;
  };

  // User insights translations
  userInsights: {
    title: string;
    todayVsLastWeek: string;
    weekComparison: string;
    kmTodayLastWeek: string;
    activitiesTodayLastWeek: string;
    totalKmThisLastWeek: string;
    activitiesThisLastWeek: string;
    weekOverWeekComparison: string;
    dailyComparison: string;
    change: string;
    noDataAvailable: string;
  };

  // PaceProjection translations
  paceProjection: {
    title: string;
    fullHistoryLabel: string;
    fullHistoryDesc: string;
    recentLabel: string;
    recentDesc: string;
    weeklyLabel: string;
    weeklyDesc: string;
    requiredLabel: string;
    requiredDesc: string;
    pacePerPerson: string;
    estimatedCompletion: string;
    differenceFromTarget: string;
    exactly: string;
    daysLate: string;
    daysEarly: string;
    kmPerWeek: string;
    noData: string;
  };

  // Records/Statistics translations
  records: {
    title: string;
    currentRecords: string;
    mostKmInDay: string;
    longestWorkout: string;
    longestStreak: string;
    startingFrom: string;
    noDataAvailable: string;
    loadingRecords: string;
    weeksBest: string;
    mostPopularSports: string;
    longestWorkoutOfWeek: string;
    weeklyTopPerformers: string;
    performancesThisWeek: string;
    kmThisWeek: string;
    noPerformancesYet: string;
  };

  // Weekly activity translations
  weeklyActivity: {
    title: string;
    weeksCalculated: string;
    mondayToSunday: string;
    sport: string;
    thisWeek: string;
    lastWeek: string;
    total: string;
    times: string;
    time: string;
  };

  // Challenge closed translations
  challengeClosed: {
    newChallengeStarts: string;
    detailsWillBeReleased: string;
    prepareToBe: string;
    inspired: string;
  };

  // CommentAndReactionView translations
  commentReactionView: {
    failedToLoadReactionsOrComments: string;
    failedToLoadComments: string;
  };

  // UserProfile translations
  userProfile: {
    failedToFetchUser: string;
    failedToDeleteActivity: string;
    failedToAddActivity: string;
    failedToUpdateActivity: string;
    loginRequired: string;
    onlyLoggedInClimbersCanView: string;
    backToBasecamp: string;
    userNotFound: string;
    climberAvatar: string;
    you: string;
    meters: string;
    altitude: string;
    height: string;
    climbingPerformances: string;
    climbingStatistics: string;
    addPerformance: string;
    updatePerformance: string;
    submissionClosed: string;
    activityType: string;
    selectActivity: string;
    specifyActivity: string;
    enterActivityName: string;
    duration: string;
    date: string;
    noBonus: string;
    perfectWeatherConditions: string;
    groupClimbing: string;
    wholeTeamAtSummit: string;
    canViewStats: string;
  };

  // SubmitQuote translations
  submitQuote: {
    pleaseEnterQuote: string;
    quoteSubmittedSuccessfully: string;
    failedToSubmitQuote: string;
    submitting: string;
  };

  // Quotes translations
  quotes: {
    noQuotesAvailable: string;
    couldNotLoadQuotes: string;
    loadingQuote: string;
  };

  // OverviewCards translations
  overviewCards: {
    soFar: string;
    weeklyGoal: string;
    person: string;
    timeRemaining: string;
    days: string;
  };

  // PopularSports translations
  popularSports: {
    title: string;
    time: string;
    times: string;
  };

  // TopPerformers translations
  topPerformers: {
    title: string;
  };

  // WeeklyInsights translations
  weeklyInsights: {
    title: string;
    participant: string;
    weeklyProgress: string;
    remainingWeeklyDailyTarget: string;
  };
}