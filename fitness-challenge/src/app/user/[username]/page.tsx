"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { 
  Bike, 
  User, 
  Lock, 
  Search, 
  Target,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  BarChart3,
  X,
  Calendar,
  Filter,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import PersonalInsights from "@/app/components/PersonalInsights";
import CommentAndReactionView from "@/app/components/CommentAndReactionView";
import SubmitQuote from "@/app/components/SubmitQuote";
import { useTheme } from "@/app/hooks/useTheme";
import { ACTIVITY_WEIGHTS, challengeParams } from "@/app/constants/challengeParams";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string;
}

interface User {
  id: string;
  username: string;
  totalKm: number;
  profilePicture: string;
  activities: Activity[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80 ${
      type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
      type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
      'bg-blue-50 text-blue-800 border border-blue-200'
    }`}
  >
    {type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
    {type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
    {type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

// Loading skeleton component
const ActivitySkeleton = () => (
  <div className="p-4 sm:p-6 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="flex gap-4 mb-3">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const sportsOptions = Object.keys(ACTIVITY_WEIGHTS);
const commonActivities = ["Juoksu", "Kävely", "Pyöräily", "Hiihto", "Uinti"];

const UserProfile = () => {
  const params = useParams();
  const username = params?.username as string;
  const { currentUser, isLoggedIn } = useAuth();
  const { t } = useTheme();
  
  // Core state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state with drafts
  const [showAddForm, setShowAddForm] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activity, setActivity] = useState("");
  const [customActivity, setCustomActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [bonus, setBonus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'activities' | 'stats'>('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  const canEditProfile = isLoggedIn && currentUser === username;
  const canAddActivity = isLoggedIn;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const formRef = useRef<HTMLFormElement>(null);

  // Show toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Auto-save draft functionality
  const saveDraft = () => {
    if (activity || duration || customActivity) {
      localStorage.setItem('activityDraft', JSON.stringify({
        activity, duration, customActivity, date, bonus
      }));
    }
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('activityDraft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setActivity(parsed.activity || '');
      setDuration(parsed.duration || '');
      setCustomActivity(parsed.customActivity || '');
      setDate(parsed.date || new Date().toISOString().split("T")[0]);
      setBonus(parsed.bonus || null);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('activityDraft');
  };

  // Personal bests calculation
  const personalBests = useMemo(() => {
    if (!user?.activities?.length) return null;

    const activities = user.activities;
    const longestDistance = Math.max(...activities.map(a => a.kilometers));
    const longestDuration = Math.max(...activities.map(a => a.duration));
    
    // Current streak
    const uniqueDates = [...new Set(activities.map(a => a.date.split('T')[0]))].sort();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = uniqueDates[i];
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === currentStreak || (currentStreak === 0 && daysDiff <= 1)) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      longestDistance,
      longestDuration,
      currentStreak,
      totalActivities: activities.length,
      activeDays: uniqueDates.length
    };
  }, [user?.activities]);

  // Enhanced filter functionality
  const filteredActivities = useMemo(() => {
    if (!user?.activities) return [];
    
    let filtered = user.activities;
    
    // Text search
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.activity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Activity type filter
    if (selectedActivityType) {
      filtered = filtered.filter(activity => 
        activity.activity.includes(selectedActivityType)
      );
    }
    
    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(activity => 
        activity.date >= dateRange.start
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(activity => 
        activity.date <= dateRange.end
      );
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user?.activities, searchTerm, selectedActivityType, dateRange]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/users/${username}`);
      if (!response.ok) throw new Error("Käyttäjätietojen lataaminen epäonnistui");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, [username, backendUrl]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    // Load draft when component mounts
    if (showAddForm && !isEditing) {
      loadDraft();
    }
  }, [showAddForm]);

  useEffect(() => {
    // Auto-save draft
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [activity, duration, customActivity, date, bonus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddActivity || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let selectedActivity = activity;
      if (activity.startsWith("Muu(") && customActivity.trim()) {
        // Format as "CustomSport / Muu(1x)" - custom sport first
        selectedActivity = `${customActivity.trim()} / ${activity}`;
      }

      const url = isEditing 
        ? `${backendUrl}/users/${username}/activities/${editingActivity?.id}`
        : `${backendUrl}/users/${username}/activities`;
      
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: selectedActivity,
          duration: Number(duration),
          date,
          bonus,
        }),
      });

      if (!response.ok) throw new Error("Suorituksen tallentaminen epäonnistui");
      
      clearDraft();
      resetForm();
      fetchUser();
      showToast(
        isEditing ? "Suoritus päivitetty onnistuneesti!" : "Suoritus lisätty onnistuneesti!",
        'success'
      );
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingActivity(null);
    setActivity("");
    setCustomActivity("");
    setDuration("");
    setDate(new Date().toISOString().split("T")[0]);
    setBonus(null);
    setShowAddForm(false);
    clearDraft();
  };

  const startEdit = (activity: Activity) => {
    if (!canEditProfile) return;
    
    // Check if this is a custom activity in format "CustomSport / Muu(1x)"
    const customMatch = activity.activity.match(/^(.+?)\s*\/\s*(Muu\(.+?\))$/);
    if (customMatch) {
      setCustomActivity(customMatch[1].trim());
      setActivity(customMatch[2].trim());
    } else {
      setActivity(activity.activity);
      setCustomActivity("");
    }

    setEditingActivity(activity);
    setDuration(activity.duration.toString());
    setDate(activity.date.split("T")[0]);
    setBonus(activity.bonus || null);
    setIsEditing(true);
    setShowAddForm(true);
    setActiveTab('activities');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDelete = async () => {
    if (!activityToDelete?.id || !canEditProfile) return;
    try {
      const response = await fetch(
        `${backendUrl}/users/${username}/activities/${activityToDelete.id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Suorituksen poistaminen epäonnistui");
      setIsModalOpen(false);
      setActivityToDelete(null);
      fetchUser();
      showToast("Suoritus poistettu", 'success');
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    }
  };

  // Quick activity buttons
  const addQuickActivity = (activityType: string, defaultDuration: number) => {
    setActivity(activityType);
    setDuration(defaultDuration.toString());
    setDate(new Date().toISOString().split("T")[0]);
    setShowAddForm(true);
    setActiveTab('activities');
  };

  // Early returns for loading/error states
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
        <div className="text-center bg-white rounded-2xl p-6 sm:p-8 shadow-lg max-w-sm w-full">
          <Lock className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-lg sm:text-xl font-bold mb-4">Kirjautuminen vaaditaan</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Vain kirjautuneet käyttäjät voivat tarkastella profiileja.</p>
          <Link href="/" className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-medium transition-colors text-black inline-block">
            Takaisin kotiin
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-4 animate-pulse">
              <div className="w-12 h-12 sm:w-15 sm:h-15 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map(i => <ActivitySkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
        <div className="text-center bg-white rounded-2xl p-6 sm:p-8 shadow-lg max-w-sm w-full">
          <Bike className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-sm sm:text-base">{error || "Käyttäjää ei löytynyt"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Image
              src={
                user.profilePicture
                  ? `https://matka-xi.vercel.app/${user.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
              }
              alt="Profile"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-15 sm:h-15 rounded-full border-3 border-yellow-400 flex-shrink-0"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {user.username}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1">
                {user.totalKm.toFixed(1)} km yhteensä
              </p>
            </div>
            {(personalBests?.currentStreak ?? 0) > 0 && (
              <div className="text-center flex-shrink-0 bg-orange-50 px-3 py-2 rounded-lg">
                <div className="text-xl font-bold text-orange-600">
                  {personalBests?.currentStreak ?? 0}
                </div>
                <div className="text-xs text-orange-600">päivän putki</div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-gray-100">
          <div className="flex">
            {[
              { key: 'activities', label: 'Suoritukset', icon: Target },
              { key: 'stats', label: 'Tilastot', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-yellow-400 text-yellow-600 bg-yellow-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20 sm:pb-6">
        {/* Tab Content */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            {/* Add Form - Simplified back to original style */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {isEditing ? "Muokkaa suoritusta" : "Lisää suoritus"}
                      </h3>
                      <button
                        onClick={resetForm}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-3 text-sm">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Laji</label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">Valitse laji</option>
                        {sportsOptions.map((sport) => (
                          <option key={sport} value={sport}>{sport}</option>
                        ))}
                      </select>
                    </div>

                    {activity.startsWith("Muu(") && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Tarkenna laji</label>
                        <input
                          type="text"
                          value={customActivity}
                          onChange={(e) => setCustomActivity(e.target.value)}
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                          placeholder="Esim: Suunnistus"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Tallennetaan muodossa: {customActivity || "Suunnistus"} / {activity}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Kesto (min)</label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Päivämäärä</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={challengeParams.startDate}
                          max={challengeParams.endDate}
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Bonus</label>
                      <select
                        value={bonus || ""}
                        onChange={(e) => setBonus(e.target.value || null)}
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base bg-white"
                      >
                        <option value="">Ei bonusta</option>
                        <option value="juhlapäivä">🌞 Täydelliset olosuhteet 8 (juhlapäivä) (2x)</option>
                        <option value="enemmän kuin kolme urheilee yhdessä">👥 Ryhmäaktiviteetti (1.5x)</option>
                        <option value="kaikki yhdessä">🏔️ Koko tiimi mukana (3x)</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-xl font-medium transition-colors order-2 sm:order-1"
                      >
                        Peruuta
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black py-2 sm:py-3 rounded-xl text-sm font-semibold order-1 sm:order-2"
                      >
                        {isSubmitting ? "Tallennetaan..." : (isEditing ? "Tallenna" : "Lisää")}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Suoritukset ({filteredActivities.length})
                  </h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Suodattimet
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Haku</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Etsi suorituksia..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Laji</label>
                        <select
                          value={selectedActivityType}
                          onChange={(e) => setSelectedActivityType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        >
                          <option value="">Kaikki lajit</option>
                          {[...new Set(user.activities.map(a => a.activity.split(' / ')[0]))].map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Aikaväli</label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs"
                          />
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {(searchTerm || selectedActivityType || dateRange.start || dateRange.end) && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedActivityType('');
                            setDateRange({ start: '', end: '' });
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                          Tyhjennä suodattimet
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Activities List */}
              <div className="divide-y divide-gray-100">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <Bike className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-base sm:text-lg">
                      {searchTerm || selectedActivityType || dateRange.start || dateRange.end 
                        ? "Ei suorituksia valituilla suodattimilla" 
                        : "Ei suorituksia vielä"}
                    </p>
                    {canAddActivity && !searchTerm && !selectedActivityType && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors"
                      >
                        Lisää ensimmäinen suoritus
                      </button>
                    )}
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">
                            {activity.activity}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-600 mb-3">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Target className="w-4 h-4 flex-shrink-0 text-blue-500" />
                              <span className="font-medium text-sm sm:text-base">{activity.kilometers.toFixed(1)} km</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0 text-green-500" />
                              <span className="text-sm sm:text-base">{activity.duration} min</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0 text-purple-500" />
                              <span className="text-sm sm:text-base">{new Date(activity.date).toLocaleDateString("fi-FI")}</span>
                            </div>
                          </div>

                          {activity.bonus && (
                            <div className="inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3 border border-amber-200">
                              <span className="text-amber-600">⭐</span>
                              {activity.bonus}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          {canEditProfile && (
                            <>
                              <button
                                onClick={() => startEdit(activity)}
                                className="p-2 sm:p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                title="Muokkaa suoritusta"
                              >
                                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setActivityToDelete(activity);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Poista suoritus"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setExpandedActivity(
                              expandedActivity === activity.id ? null : activity.id
                            )}
                            className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            title={expandedActivity === activity.id ? "Piilota kommentit" : "Näytä kommentit"}
                          >
                            {expandedActivity === activity.id ? (
                              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedActivity === activity.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                          >
                            <CommentAndReactionView activityId={activity.id} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <PersonalInsights
            activities={user.activities}
            username={user.username}
            user={user}
          />
        )}

        {/* Quote submission */}
        {canEditProfile && activeTab === 'activities' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <SubmitQuote />
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {canAddActivity && !showAddForm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-20"
        >
          <button
            onClick={() => {
              setShowAddForm(true);
              setActiveTab('activities');
            }}
            className="w-14 h-14 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setActivityToDelete(null);
        }}
        activityDetails={
          activityToDelete
            ? {
                activity: activityToDelete.activity,
                date: activityToDelete.date,
                duration: activityToDelete.duration,
              }
            : undefined
        }
      />
    </div>
  );
};

export default UserProfile;