// utils/challengeClock.ts

export const startOfLocalDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const endOfLocalDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

export const diffDays = (a: Date, b: Date) => {
  // full days between start-of-day(a) and start-of-day(b)
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    (startOfLocalDay(b).getTime() - startOfLocalDay(a).getTime()) / msPerDay
  );
};

/**
 * Returns { totalDays, daysPassedInclCutoff, daysRemainingExclCutoff }
 * Progress includes activities up to cutoff (inclusive).
 * Remaining days start tomorrow (exclude cutoff day).
 */
export const getChallengeDays = (
  challengeStart: Date,
  challengeEnd: Date,
  cutoff: Date
) => {
  const start = startOfLocalDay(challengeStart);
  const end = endOfLocalDay(challengeEnd);
  const co = startOfLocalDay(cutoff);

  // clamp cutoff into [start, end]
  const clamped = co < start ? start : co > end ? end : co;

  const totalDays = diffDays(start, end) + 1; // inclusive
  const daysPassedInclCutoff = Math.min(
    Math.max(diffDays(start, clamped) + 1, 0),
    totalDays
  );
  const daysRemainingExclCutoff = Math.max(
    totalDays - daysPassedInclCutoff,
    0
  );

  return { totalDays, daysPassedInclCutoff, daysRemainingExclCutoff };
};

/** Sum user km up to and including cutoff */
export const sumKmUpTo = <
  T extends { date: string; kilometers: number }
>(
  items: T[],
  cutoff: Date
) => {
  const coe = endOfLocalDay(cutoff).getTime();
  return items.reduce((s, a) => {
    const t = new Date(a.date).getTime();
    return s + (t <= coe ? a.kilometers : 0);
  }, 0);
};
