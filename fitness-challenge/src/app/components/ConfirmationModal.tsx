import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  activityDetails?: {
    activity: string;
    date: string;
    duration: number;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  activityDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <p className="text-gray-800 text-center text-lg font-bold mb-4">
          Are you sure you want to delete this activity?
        </p>
        {activityDetails && (
          <div className="mb-4">
            <p className="text-gray-600 text-center">
              <strong>Activity:</strong> {activityDetails.activity}
            </p>
            <p className="text-gray-600 text-center">
              <strong>Date:</strong>{" "}
              {new Date(activityDetails.date).toLocaleDateString("fi-FI")}
            </p>
            <p className="text-gray-600 text-center">
              <strong>Duration:</strong> {activityDetails.duration} mins
            </p>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-500 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
