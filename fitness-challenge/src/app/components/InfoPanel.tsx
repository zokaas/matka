// InfoPanel.tsx
import React from "react";
import ProgressBar from "./ProgressBar";
import styles from "../styles/styles";

const InfoPanel = ({
  totalKm,
  progressPercentage,
  currentCity,
  nextCity,
  distanceToNext,
}: {
  totalKm: number;
  progressPercentage: number;
  currentCity: string;
  nextCity: string;
  distanceToNext: number | null;
}) => {
  return (
    <div style={styles.infoPanel}>
      <ProgressBar progressPercentage={progressPercentage} />

      <div style={styles.distanceInfo}>
        <span style={styles.distance}>
          {totalKm.toLocaleString(undefined, { maximumFractionDigits: 0 })} km
        </span>
        <span style={styles.percentage}>{progressPercentage.toFixed(0)}%</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.locationInfo}>
        <div style={styles.locationLabel}>Nykyinen sijainti</div>
        <div style={styles.currentCity}>{currentCity}</div>

        {distanceToNext !== null && (
          <div style={styles.routeInfo}>
            <div style={styles.distanceToNext}>
              {distanceToNext.toLocaleString()} km seuraavaan kohteeseen
            </div>
          </div>
        )}

        <div style={styles.nextDestination}>
          <div style={styles.locationLabel}>Seuraava kohde</div>
          <div style={styles.nextCity}>{nextCity}</div>
        </div>
      </div>

      {progressPercentage >= 100 && (
        <div style={styles.completedBadge}>🎉 Haaste suoritettu!</div>
      )}
    </div>
  );
};

export default InfoPanel;
