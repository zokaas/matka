// components/PaceProjectionTabs.tsx
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  TrendingUp,
  Calendar,
  Clock,
  History,
  BarChart2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface ProjectionEntry {
  estimatedEndDate: string | null;
  daysFromTarget: number | null;
}

interface Projections {
  historical: ProjectionEntry;
  recent: ProjectionEntry;
  weekly: ProjectionEntry;
}

interface PaceProjectionTabsProps {
  historicalPace: number;
  recentPace: number;
  weeklyPace: number;
  targetDate: Date;
  remainingDistance: number;
  participantCount: number;
  projections: Projections;
}

const PaceProjectionTabs: React.FC<PaceProjectionTabsProps> = ({
  historicalPace = 0,
  recentPace = 0,
  weeklyPace = 0,
  targetDate,
  remainingDistance = 0,
  participantCount = 1,
  projections,
}) => {
  const [activeTab, setActiveTab] = useState('historical');

  const parseDate = (date: string | Date | null): Date | null => {
    if (!date) return null;
    
    // If it's already a Date object, return it directly
    if (date instanceof Date) return date;
    
    // Otherwise, parse it as an ISO string
    try {
      return parseISO(date);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };
  
  const projectionEntries = {
    historical: {
      label: 'Koko historia',
      description: 'Perustuu koko haasteen aikana kertyneeseen keskimääräiseen vauhtiin.',
      pacePerUser: Math.round(historicalPace),
      estimatedEndDate: parseDate(projections.historical.estimatedEndDate),
      daysFromTarget: projections.historical.daysFromTarget ?? 0,
      icon: <History className="w-5 h-5" />,
    },
    recent: {
      label: 'Viimeaikaiset',
      description: 'Perustuu viimeisen 4 viikon aikana kertyneeseen vauhtiin.',
      pacePerUser: Math.round(recentPace),
      estimatedEndDate: parseDate(projections.recent.estimatedEndDate),
      daysFromTarget: projections.recent.daysFromTarget ?? 0,
      icon: <Clock className="w-5 h-5" />,
    },
    weekly: {
      label: 'Viikon',
      description:
        'Perustuu viimeisimmän seitsemän päivän tahtiin.',
      pacePerUser: Math.round(weeklyPace),
      estimatedEndDate: parseDate(projections.weekly.estimatedEndDate),
      daysFromTarget: projections.weekly.daysFromTarget ?? 0,
      icon: <BarChart2 className="w-5 h-5" />,
    },
    required: {
      label: 'Vaadittu',
      description: 'Vaadittu vauhti tavoitepäivään (22.6.) mennessä.',
      pacePerUser: Math.ceil(remainingDistance / (Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) / 7) / participantCount),
      estimatedEndDate: targetDate,
      daysFromTarget: 0,
      icon: <Calendar className="w-5 h-5" />,
    },
  };

  const projectionsArray = Object.entries(projectionEntries);
  const activeProjection = projectionEntries[activeTab as keyof typeof projectionEntries];
  const activeIndex = projectionsArray.findIndex(([key]) => key === activeTab);

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % projectionsArray.length;
    setActiveTab(projectionsArray[nextIndex][0]);
  };

  const goToPrevious = () => {
    const prevIndex = (activeIndex - 1 + projectionsArray.length) % projectionsArray.length;
    setActiveTab(projectionsArray[prevIndex][0]);
  };

  const daysFromTargetText =
    activeProjection.daysFromTarget === 0
      ? 'Täsmällisesti'
      : activeProjection.daysFromTarget > 0
      ? `+${activeProjection.daysFromTarget} päivää`
      : `${activeProjection.daysFromTarget} päivää`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
        Vauhtiennusteet
      </h3>

      {/* Tabs (desktop) */}
      <div className="hidden md:flex border-b mb-4">
        {projectionsArray.map(([key, projection]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === key
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              {projection.icon}
              <span className="ml-1">{projection.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile carousel-style */}
      <div className="md:hidden mb-4 flex items-center justify-between border-b pb-2">
        <button onClick={goToPrevious} className="bg-gray-100 rounded-full p-1 text-gray-600 hover:bg-gray-200">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center px-2 text-purple-600">
          {activeProjection.icon}
          <span className="ml-1 font-medium">{activeProjection.label}</span>
        </div>
        <button onClick={goToNext} className="bg-gray-100 rounded-full p-1 text-gray-600 hover:bg-gray-200">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Details */}
      <p className="text-sm text-gray-600 mb-3">{activeProjection.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-700 font-medium">Vauhti / hlö</div>
          <div className="text-xl font-bold text-purple-800">{activeProjection.pacePerUser} km/vko</div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-700 font-medium">Arvioitu valmistuminen</div>
          <div className="text-xl font-bold text-blue-800">
            {activeProjection.estimatedEndDate 
              ? format(activeProjection.estimatedEndDate, 'd.M.yyyy')
              : 'Ei tietoa'}
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${
            activeProjection.daysFromTarget > 0
              ? 'bg-red-50'
              : activeProjection.daysFromTarget < 0
              ? 'bg-green-50'
              : 'bg-gray-50'
          }`}
        >
          <div
            className={`text-sm font-medium ${
              activeProjection.daysFromTarget > 0
                ? 'text-red-700'
                : activeProjection.daysFromTarget < 0
                ? 'text-green-700'
                : 'text-gray-700'
            }`}
          >
            Ero tavoitteesta
          </div>
          <div
            className={`text-xl font-bold ${
              activeProjection.daysFromTarget > 0
                ? 'text-red-800'
                : activeProjection.daysFromTarget < 0
                ? 'text-green-800'
                : 'text-gray-800'
            }`}
          >
            {daysFromTargetText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaceProjectionTabs;