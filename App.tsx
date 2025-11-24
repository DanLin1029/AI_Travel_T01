import React, { useState, useEffect, useMemo } from 'react';
import { DaySchedule, Activity } from './types';
import { INITIAL_ITINERARY } from './constants';
import ActivityCard from './components/ActivityCard';
import EditModal from './components/EditModal';
import ExpenseChart from './components/ExpenseChart';
import { Plus, BarChart3, Wallet } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [itinerary, setItinerary] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('fukuoka_trip_data');
    if (saved) {
        // Migration: Check if saved data has weather info, if not, use initial to get weather structure
        const parsed = JSON.parse(saved);
        if(!parsed[0].weather) {
            return INITIAL_ITINERARY;
        }
        return parsed;
    }
    return INITIAL_ITINERARY;
  });
  
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showStats, setShowStats] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('fukuoka_trip_data', JSON.stringify(itinerary));
  }, [itinerary]);

  // --- Derived State ---
  const activeDay = itinerary[activeDayIndex];
  
  // Sort activities by time
  const sortedActivities = useMemo(() => {
    return [...activeDay.activities].sort((a, b) => a.time.localeCompare(b.time));
  }, [activeDay]);

  const allActivities = useMemo(() => itinerary.flatMap(d => d.activities), [itinerary]);

  // --- Handlers ---

  const handleToggleComplete = (activityId: string) => {
    setItinerary(prev => prev.map(day => ({
      ...day,
      activities: day.activities.map(act => 
        act.id === activityId ? { ...act, isCompleted: !act.isCompleted } : act
      )
    })));
  };

  const handleSaveActivity = (activity: Activity) => {
    setItinerary(prev => prev.map((day, idx) => {
      if (idx !== activeDayIndex) return day;
      
      const existingIdx = day.activities.findIndex(a => a.id === activity.id);
      let newActivities;
      
      if (existingIdx >= 0) {
        // Update existing
        newActivities = [...day.activities];
        newActivities[existingIdx] = activity;
      } else {
        // Add new
        newActivities = [...day.activities, activity];
      }
      
      return { ...day, activities: newActivities };
    }));
  };

  const handleDeleteActivity = (id: string) => {
    setItinerary(prev => prev.map((day, idx) => {
        if (idx !== activeDayIndex) return day;
        return {
            ...day,
            activities: day.activities.filter(a => a.id !== id)
        };
    }));
  };

  const handleAddClick = () => {
    setEditingActivity(null);
    setEditModalOpen(true);
  };

  const handleEditClick = (activity: Activity) => {
    setEditingActivity(activity);
    setEditModalOpen(true);
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-jp-bg flex flex-col font-sans max-w-lg mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Hero Image Area */}
      <div className="relative h-72 w-full overflow-hidden shrink-0">
        <img 
            src="https://i.meee.com.tw/XsGdU5h.png" 
            alt="Fukuoka Trip Cover" 
            className="w-full h-full object-cover object-center opacity-95 hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Title */}
        <div className="absolute bottom-4 left-6 text-white z-10">
             <h1 className="text-3xl font-serif font-bold tracking-wide mb-1 text-shadow drop-shadow-md">福岡之旅</h1>
             <p className="text-sm font-light opacity-90 tracking-widest text-shadow">2025.10.31 - 11.03</p>
        </div>

        {/* Dynamic Weather Widget */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
            <div className="bg-gray-800/85 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-2 border border-gray-700/50 shadow-lg mb-1">
                <span>{activeDay.weather?.location || '福岡'}</span>
                <span className="text-lg">{activeDay.weather?.icon || '⛅'}</span>
                <span>{activeDay.weather?.temp || 14}°C</span>
            </div>
            <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-white/90 text-[10px] text-right max-w-[150px]">
                {activeDay.weather?.clothing || '天氣舒適'}
            </div>
        </div>
      </div>

      {/* Day Navigation (Direct Selection) */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex w-full">
            {itinerary.map((day, idx) => (
                <button 
                    key={day.id} 
                    onClick={() => setActiveDayIndex(idx)}
                    className={`flex-1 min-w-[90px] py-3 px-1 flex flex-col items-center justify-center transition-all duration-300 relative group
                        ${idx === activeDayIndex ? 'text-primary' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
                    `}
                >
                    <span className={`text-[10px] uppercase tracking-wider mb-0.5 ${idx === activeDayIndex ? 'font-bold' : 'font-medium'}`}>
                        {day.date.split('-').slice(1).join('/')}
                    </span>
                    <span className={`text-sm font-serif ${idx === activeDayIndex ? 'font-bold' : 'font-medium'}`}>
                        {day.dayName.split(' ')[1] || day.dayName}
                    </span>
                    
                    {/* Active Indicator Line */}
                    {idx === activeDayIndex && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-4 rounded-t-full" />
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 scroll-smooth no-scrollbar bg-jp-bg relative">
        
        {showStats ? (
            <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-serif font-bold text-gray-800">旅行錢包</h2>
                    <button onClick={() => setShowStats(false)} className="text-primary text-sm font-medium hover:underline">返回行程</button>
                </div>
                <ExpenseChart activities={allActivities} />
            </div>
        ) : (
            <div className="space-y-3 animate-slideIn pb-4">
                <div className="flex justify-between items-end mb-2 px-1">
                    <h3 className="text-xl font-serif font-bold text-gray-800 tracking-tight">
                        {activeDay.weather?.location} 行程
                    </h3>
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                        {activeDay.weather?.condition}
                    </span>
                </div>

                {sortedActivities.length === 0 ? (
                    <div className="text-center py-24 text-gray-300">
                        <p className="font-serif text-lg mb-2">本日無行程</p>
                        <p className="text-xs">點擊右下角 + 新增</p>
                    </div>
                ) : (
                    sortedActivities.map(activity => (
                        <ActivityCard 
                            key={activity.id} 
                            activity={activity} 
                            onToggleComplete={handleToggleComplete}
                            onEdit={handleEditClick}
                        />
                    ))
                )}
            </div>
        )}
      </main>

      {/* Floating Action Button - Minimalist */}
      <div className="absolute bottom-8 right-6 z-20 flex flex-col gap-4">
        <button 
            onClick={() => setShowStats(!showStats)}
            className="w-12 h-12 bg-white text-gray-500 rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:text-primary hover:scale-105 transition-all active:scale-95"
        >
            {showStats ? <Wallet size={20} /> : <BarChart3 size={20} />}
        </button>
        <button 
            onClick={handleAddClick}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-blue-900/20 flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all active:scale-95"
        >
            <Plus size={26} strokeWidth={2} />
        </button>
      </div>

      {/* Edit/Add Modal */}
      <EditModal 
        isOpen={isEditModalOpen} 
        activity={editingActivity}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />

    </div>
  );
};

export default App;