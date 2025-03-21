import React, { useState } from 'react';
import { format } from 'date-fns';
import { TrendingUp, Calendar, Clock, History, BarChart2, ChevronRight, ChevronLeft } from 'lucide-react';

// Projection data interface
interface ProjectionData {
  label: string;
  description: string;
  pacePerUser: number;
  estimatedEndDate: Date;
  daysFromTarget: number;
  icon: React.ReactNode;
}

interface PaceProjectionTabsProps {
  historicalPace: number;
  recentPace: number;
  weeklyPace: number;
  targetDate: Date;
  remainingDistance: number;
  participantCount: number;
}

const PaceProjectionTabs: React.FC<PaceProjectionTabsProps> = ({
  historicalPace,
  recentPace,
  weeklyPace,
  targetDate,
  remainingDistance,
  participantCount
}) => {
  const [activeTab, setActiveTab] = useState('historical');
  
  // Calculate date projections
  const today = new Date();
  const daysUntilTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate required pace to reach target date
  const requiredWeeklyPace = Math.ceil(remainingDistance / (daysUntilTarget / 7) / participantCount);
  
  // Calculate different projections
  const projectionEntries = {
    historical: {
        label: "Koko historia",
        description: "Perustuu koko haasteen aikana kertyneeseen keskimääräiseen vauhtiin.",
        pacePerUser: Math.round(historicalPace),
      estimatedEndDate: calculateEndDate(historicalPace * participantCount),
      daysFromTarget: calculateDaysFromTarget(calculateEndDate(historicalPace * participantCount)),
      icon: <History className="w-5 h-5" />
    },
    recent: {
      label: "Viimeaikaiset",
      description: "Perustuu viimeisen 4 viikon aikana kertyneeseen vauhtiin.",
      pacePerUser: Math.round(recentPace),
      estimatedEndDate: calculateEndDate(recentPace * participantCount),
      daysFromTarget: calculateDaysFromTarget(calculateEndDate(recentPace * participantCount)),
      icon: <Clock className="w-5 h-5" />
    },
    weekly: {
      label: "Viikottainen",
      description: "Perustuu tämän viikon vauhtiin. Huomioi, että viikkoa saattaa olla jäljellä, luvut saattavat vielä muuttua.",
      pacePerUser: Math.round(weeklyPace),
      estimatedEndDate: calculateEndDate(weeklyPace * participantCount),
      daysFromTarget: calculateDaysFromTarget(calculateEndDate(weeklyPace * participantCount)),
      icon: <BarChart2 className="w-5 h-5" />
    },
    required: {
      label: "Vaadittu",
      description: "Vaadittu vauhti tavoitepäivään (22.6.) mennessä.",
      pacePerUser: requiredWeeklyPace,
      estimatedEndDate: targetDate,
      daysFromTarget: 0,
      icon: <Calendar className="w-5 h-5" />
    }
  };
  
  const projections: Record<string, ProjectionData> = projectionEntries;
  
  // Helper function to calculate estimated end date based on pace
  function calculateEndDate(weeklyPace: number): Date {
    if (weeklyPace <= 0) return new Date(targetDate);
    
    const weeksNeeded = remainingDistance / weeklyPace;
    const daysNeeded = Math.ceil(weeksNeeded * 7);
    
    const endDate = new Date();
    endDate.setDate(today.getDate() + daysNeeded);
    return endDate;
  }
  
  // Helper function to calculate days difference from target
  function calculateDaysFromTarget(date: Date): number {
    return Math.ceil((date.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  // Convert object to array to easier navigate between tabs
  const projectionKeys = Object.keys(projections);
  const activeIndex = projectionKeys.indexOf(activeTab);
  const activeProjection = projections[activeTab];
  
  // Navigation functions for mobile swipe-like experience
  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % projectionKeys.length;
    setActiveTab(projectionKeys[nextIndex]);
  };
  
  const goToPrevious = () => {
    const prevIndex = (activeIndex - 1 + projectionKeys.length) % projectionKeys.length;
    setActiveTab(projectionKeys[prevIndex]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
        Vauhtiennusteet
      </h3>
      
      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex flex-wrap border-b mb-4">
        {Object.entries(projections).map(([key, projection]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === key
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              {projection.icon}
              <span className="ml-1">{projection.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Mobile Tab Carousel Navigation */}
      <div className="md:hidden mb-4">
        <div className="flex justify-between items-center border-b pb-2">
          <button 
            onClick={goToPrevious} 
            className="bg-gray-100 rounded-full p-1 text-gray-600 hover:bg-gray-200"
            aria-label="Previous tab"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center px-2 py-1">
            {activeProjection.icon}
            <span className="ml-1 font-medium text-purple-600">{activeProjection.label}</span>
          </div>
          
          <button 
            onClick={goToNext} 
            className="bg-gray-100 rounded-full p-1 text-gray-600 hover:bg-gray-200"
            aria-label="Next tab"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Mobile Progress Indicator */}
        <div className="flex justify-center gap-1 mt-2">
          {projectionKeys.map((key, index) => (
            <div 
              key={key} 
              className={`h-1 rounded-full ${
                index === activeIndex 
                  ? "w-4 bg-purple-500" 
                  : "w-2 bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Active Projection Details */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">{activeProjection.description}</p>
        
        {/* Desktop layout: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-700 font-medium">Vauhti / hlö</div>
            <div className="text-xl font-bold text-purple-800">{activeProjection.pacePerUser} km/vko</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-700 font-medium">Arvioitu valmistuminen</div>
            <div className="text-xl font-bold text-blue-800">{format(activeProjection.estimatedEndDate, 'd.M.yyyy')}</div>
          </div>
          
          <div className={`p-3 rounded-lg ${
              activeProjection.daysFromTarget > 0 
                ? "bg-red-50" 
                : activeProjection.daysFromTarget < 0
                  ? "bg-green-50"
                  : "bg-gray-50"
            }`}>
            <div className={`text-sm font-medium ${
              activeProjection.daysFromTarget > 0 
                ? "text-red-700" 
                : activeProjection.daysFromTarget < 0
                  ? "text-green-700"
                  : "text-gray-700"
            }`}>Ero tavoitteesta</div>
            <div className={`text-xl font-bold ${
              activeProjection.daysFromTarget > 0 
                ? "text-red-800" 
                : activeProjection.daysFromTarget < 0
                  ? "text-green-800"
                  : "text-gray-800"
            }`}>
              {activeProjection.daysFromTarget === 0 
                ? "Täsmällisesti" 
                : activeProjection.daysFromTarget > 0
                  ? `+${activeProjection.daysFromTarget} päivää`
                  : `${activeProjection.daysFromTarget} päivää`}
            </div>
          </div>
        </div>
        
        {/* Mobile layout: Card style with icons */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Pace info */}
            <div className="flex items-center p-3 border-b">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <span className="text-purple-600">📊</span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Vauhti / hlö</div>
                <div className="text-lg font-bold text-purple-700">{activeProjection.pacePerUser} km/vko</div>
              </div>
            </div>
            
            {/* Estimated completion date */}
            <div className="flex items-center p-3 border-b">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <span className="text-blue-600">📅</span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Arvioitu maaliin saapuminen</div>
                <div className="text-lg font-bold text-blue-700">{format(activeProjection.estimatedEndDate, 'd.M.yyyy')}</div>
              </div>
            </div>
            
            {/* Days from target */}
            <div className="flex items-center p-3">
              <div className={`p-2 rounded-full mr-3 ${
                activeProjection.daysFromTarget > 0 
                  ? "bg-red-100" 
                  : activeProjection.daysFromTarget < 0
                    ? "bg-green-100"
                    : "bg-gray-100"
              }`}>
                <span className={
                  activeProjection.daysFromTarget > 0 
                    ? "text-red-600" 
                    : activeProjection.daysFromTarget < 0
                      ? "text-green-600"
                      : "text-gray-600"
                }>⏱️</span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Ero tavoitteesta</div>
                <div className={`text-lg font-bold ${
                  activeProjection.daysFromTarget > 0 
                    ? "text-red-700" 
                    : activeProjection.daysFromTarget < 0
                      ? "text-green-700"
                      : "text-gray-700"
                }`}>
                  {activeProjection.daysFromTarget === 0 
                    ? "Täsmällisesti" 
                    : activeProjection.daysFromTarget > 0
                      ? `+${activeProjection.daysFromTarget} päivää`
                      : `${activeProjection.daysFromTarget} päivää`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaceProjectionTabs;