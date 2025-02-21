import React from "react";
import ProgressBar from "./ProgressBar";
import { FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";
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
        <span style={styles.distance}>{totalKm.toLocaleString()} km</span>
        <span style={styles.percentage}>{progressPercentage.toFixed(1)}%</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.locationInfo}>
        <div style={styles.locationItem}>
          <div>
            <div style={styles.locationLabel}>Current Location</div>
            <div style={styles.currentCity}>{currentCity}</div>
            {/* {distanceToNext !== null && (
              <div style={styles.distanceToNext}>
                {distanceToNext} km to next destination
              </div>
            )} */}
          </div>
        </div>

        <div style={styles.locationItem}>
          <div>
            <div style={styles.locationLabel}>Next Destination</div>
            <div style={styles.nextCity}>{nextCity}</div>
          </div>
        </div>
      </div>

      {progressPercentage >= 100 && (
        <div style={styles.completedBadge}>🎉 Challenge completed!</div>
      )}
    </div>
  );
};

export default InfoPanel;
