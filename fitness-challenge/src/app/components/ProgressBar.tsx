import styles from "../styles/styles";

const ProgressBar = ({
  progressPercentage,
}: {
  progressPercentage: number;
}) => {
  return (
    <div style={styles.progressBarContainer}>
      <div
        style={{
          ...styles.progressBar,
          width: `${Math.min(progressPercentage, 100)}%`,
          backgroundColor: progressPercentage >= 100 ? "#4CAF50" : "#FF4D4D",
          transition: "width 0.6s ease-in-out", // Smooth animation
        }}
      />
    </div>
  );
};


export default ProgressBar;
