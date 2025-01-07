import React from 'react';

const ProgressBar = ({ progress, totalDistance, currentCity, nextDestination }) => {
  const progressPercentage = Math.min((progress / totalDistance) * 100, 100);
  
  // Round the distances to whole numbers
  const roundedProgress = Math.round(progress);
  const roundedTotal = Math.round(totalDistance);

  return (
    <div style={{ backgroundColor: '#F2E7C9', color: '#2C5F2D' }} className="p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-bold mb-4">Team Progress</h3>
      <div style={{ backgroundColor: '#4C7C5A' }} className="relative w-full h-6 rounded-full overflow-hidden">
        <div
          style={{ width: `${progressPercentage}%`, backgroundColor: '#D4A017' }}
          className="absolute top-0 left-0 h-full"
        ></div>
      </div>
      <p className="mt-2 text-sm">
        {roundedProgress} km / {roundedTotal} km
      </p>
      <p className="mt-2 text-sm">
        <strong>Current City:</strong> {currentCity}
      </p>
      <p className="mt-2 text-sm">
        <strong>Next Destination:</strong> {nextDestination}
      </p>
    </div>
  );
};

export default ProgressBar;