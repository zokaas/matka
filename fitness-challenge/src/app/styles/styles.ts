import React from "react";

// Define a type that allows media queries
type CSSStylesWithMediaQueries = React.CSSProperties & {
  "@media"?: {
    [key: string]: React.CSSProperties;
  };
};

const styles: { [key: string]: CSSStylesWithMediaQueries } = {
  pageContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
  },
  infoPanel: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "white",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "12px",
    width: "220px",
    maxWidth: "calc(100vw - 24px)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    zIndex: 1000,
    transition: "all 0.3s ease",
    "@media": {
      "(max-width: 600px)": {
        width: "calc(100% - 24px)",
        maxHeight: "50vh",
        overflowY: "auto",
        fontSize: "11px",
        padding: "10px",
        left: "12px",
        right: "12px",
      },
      "(max-width: 375px)": {
        fontSize: "10px",
        padding: "8px",
      },
    },
  },
  progressBarContainer: {
    width: "100%",
    height: "3px",
    backgroundColor: "#f0f0f0",
    borderRadius: "2px",
    marginBottom: "6px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.5s ease-in-out",
    backgroundColor: "#2196f3",
  },
  distanceInfo: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: "2px",
    marginTop: "4px",
    "@media": {
      "(max-width: 600px)": {
        // Mobile-specific adjustments if needed
      },
    },
  },
  distance: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
    "@media": {
      "(max-width: 600px)": {
        fontSize: "16px",
      },
      "(max-width: 375px)": {
        fontSize: "14px",
      },
    },
  },
  percentage: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2196f3",
    "@media": {
      "(max-width: 600px)": {
        fontSize: "12px",
      },
    },
  },
  divider: {
    height: "1px",
    background: "linear-gradient(to right, #f0f0f0, #e0e0e0, #f0f0f0)",
    width: "100%",
    margin: "10px 0",
  },
  locationInfo: {
    marginTop: "2px",
  },
  locationLabel: {
    fontSize: "10px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "3px",
    fontWeight: "500",
    "@media": {
      "(max-width: 375px)": {
        fontSize: "9px",
      },
    },
  },
  currentCity: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#e91e63",
    marginBottom: "6px",
    "@media": {
      "(max-width: 600px)": {
        fontSize: "14px",
      },
    },
  },
  routeInfo: {
    marginBottom: "10px",
  },
  distanceToNext: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "500",
    "@media": {
      "(max-width: 375px)": {
        fontSize: "10px",
      },
    },
  },
  nextDestination: {
    marginTop: "2px",
  },
  nextCity: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#2196f3",
    "@media": {
      "(max-width: 600px)": {
        fontSize: "14px",
      },
    },
  },
  completedBadge: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    marginTop: "12px",
    boxShadow: "0 2px 6px rgba(46, 125, 50, 0.1)",
    "@media": {
      "(max-width: 600px)": {
        fontSize: "11px",
        padding: "6px",
      },
    },
  },
  navigationControl: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 1000,
    "@media": {
      "(max-width: 600px)": {
        top: "8px",
        right: "8px",
      },
    },
  },
  scaleControl: {
    maxWidth: "80px",
  },
};

export default styles;
