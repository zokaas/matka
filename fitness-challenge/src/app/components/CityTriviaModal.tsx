// CrazyTriviaModal.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image"; // Next.js optimized image loader
import { motion } from "framer-motion"; // Smooth animations
import { getCrazyFact } from "../utils/getCrazyFacts";
import { fetchCityImage } from "../utils/fetchCityImage";

interface CityTriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  isMobile?: boolean;
  cityStatus?: string; // Add city status to props
}

const CrazyTriviaModal: React.FC<CityTriviaModalProps> = ({
  isOpen,
  onClose,
  city,
  cityStatus = "current", // Default to current for backward compatibility
}) => {
  const [trivia, setTrivia] = useState<{
    weirdFact: string;
    crazyDetail: string;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      const fetchTriviaAndImage = async () => {
        // Only fetch trivia if we've reached this city
        if (cityStatus === "current" || cityStatus === "visited") {
          setTrivia(getCrazyFact(city));
        } else {
          setTrivia(null);
        }

        setLoadingImage(true);

        // Fetch image from Unsplash
        try {
          const image = await fetchCityImage(city);
          setImageUrl(image || null); // Convert empty string to null
          setLoadingImage(false);
        } catch (error) {
          console.error("Error in image fetch:", error);
          setImageUrl(null); // Ensure null for fallback video
          setLoadingImage(false);
        }
      };

      fetchTriviaAndImage();
    }
  }, [isOpen, city, cityStatus]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-2"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-4 relative flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-l font-bold text-gray-900">
            📍{" "}
            {cityStatus === "current" || cityStatus === "visited" ? (
              <>Ystävyyden ilosanoma on saapunut nyt myös kaupunkiin {city}</>
            ) : (
              <>Kaupunki {city} odottaa vielä saapumistasi</>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* City Image / Fallback Video */}
        <div className="w-full mt-3">
          {loadingImage ? (
            <div
              className="w-full bg-gray-200 animate-pulse rounded-lg"
              style={{ aspectRatio: "16/9" }}
            />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${city} Image`}
              width={500}
              height={300}
              className="w-full object-contain rounded-lg shadow-md"
              priority
            />
          ) : (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full object-contain rounded-lg shadow-md"
            >
              <source src="/motivationvideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Trivia Content */}
        <div className="mt-6 space-y-3">
          {cityStatus === "current" || cityStatus === "visited" ? (
            trivia && (
              <>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {trivia.weirdFact}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {trivia.crazyDetail}
                </p>
              </>
            )
          ) : (
            <p className="text-gray-700 text-lg leading-relaxed">
              Jatkakaa matkaanne! Tähän kaupunkiin ei ole vielä saavuttu. Näet
              lisätietoja, kun saavutatte tämän etapin matkallanne.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CrazyTriviaModal;
