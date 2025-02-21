export const calculateVisitDate = (
  cityIndex: number,
  currentIndex: number,
  totalKm: number
): string | undefined => {
  const currentDate = new Date();

  if (cityIndex < currentIndex) {
    const progressPerCity = totalKm / currentIndex;
    const citiesBehind = currentIndex - cityIndex;
    const estimatedDaysAgo = Math.round(
      (citiesBehind * (106462 / progressPerCity)) / 365
    );

    const visitDate = new Date();
    visitDate.setDate(currentDate.getDate() - estimatedDaysAgo);

    return visitDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return undefined;
};

export const calculateZoomLevel = (distance: number): number => {
  const zoomLevels = [
    { maxDistance: 5000, zoom: 2 },
    { maxDistance: 2000, zoom: 3 },
    { maxDistance: 1000, zoom: 4 },
    { maxDistance: 500, zoom: 5 },
    { maxDistance: 250, zoom: 6 },
    { maxDistance: 100, zoom: 7 },
    { maxDistance: 50, zoom: 8 },
    { maxDistance: 25, zoom: 9 },
    { maxDistance: Infinity, zoom: 10 },
  ];

  return zoomLevels.find((level) => distance <= level.maxDistance)?.zoom || 10;
};
