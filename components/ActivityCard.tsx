import React, { useRef } from 'react';
import { Activity, Category } from '../types';
import { MapPin, Utensils, Train, ShoppingBag, Bed, CheckCircle, Circle } from 'lucide-react';

interface Props {
  activity: Activity;
  onToggleComplete: (id: string) => void;
  onEdit: (activity: Activity) => void;
}

const CategoryIcons: Record<Category, React.ReactNode> = {
  [Category.Transport]: <Train size={16} />,
  [Category.Food]: <Utensils size={16} />,
  [Category.Sightseeing]: <MapPin size={16} />,
  [Category.Shopping]: <ShoppingBag size={16} />,
  [Category.Accommodation]: <Bed size={16} />,
  [Category.Flexible]: <Circle size={16} />, // Fallback icon
};

const CategoryLabels: Record<Category, string> = {
  [Category.Transport]: '交通',
  [Category.Food]: '美食',
  [Category.Sightseeing]: '景點',
  [Category.Shopping]: '購物',
  [Category.Accommodation]: '住宿',
  [Category.Flexible]: '彈性',
};

// Updated to Minimalist colors (Text colors mostly)
const CategoryStyles: Record<Category, string> = {
  [Category.Transport]: 'text-blue-600 bg-blue-50 border-blue-100',
  [Category.Food]: 'text-orange-600 bg-orange-50 border-orange-100',
  [Category.Sightseeing]: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  [Category.Shopping]: 'text-pink-600 bg-pink-50 border-pink-100',
  [Category.Accommodation]: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  [Category.Flexible]: 'text-gray-600 bg-gray-50 border-gray-100',
};

const ActivityCard: React.FC<Props> = ({ activity, onToggleComplete, onEdit }) => {
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to ensure compatibility when NodeJS types are missing
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
      onEdit(activity);
    }, 3000); // 3 seconds
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cancel press if map button is clicked to avoid conflict
    cancelPress();
    const query = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelPress();
    onToggleComplete(activity.id);
  };

  return (
    <div 
        className={`relative mb-3 rounded-lg border border-gray-100 p-4 transition-all duration-300 select-none ${activity.isCompleted ? 'opacity-50 bg-gray-50 grayscale' : 'bg-white hover:shadow-zen active:scale-[0.99]'}`}
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        onTouchMove={cancelPress} // Cancel if scrolling
    >
      <div className="flex items-start gap-4 pointer-events-none"> {/* Disable pointer events on inner structure to simplify touch logic, re-enable on interactive elements */}
        {/* Time & Vertical Line */}
        <div className="flex flex-col items-center gap-1 pt-1 min-w-[3rem]">
          <span className="text-sm font-mono text-gray-500 font-medium tracking-tight">{activity.time}</span>
           <button onClick={handleCheckboxClick} className="text-gray-300 hover:text-emerald-500 transition-colors my-1 pointer-events-auto">
            {activity.isCompleted ? <CheckCircle size={20} className="text-emerald-500" /> : <Circle size={20} />}
          </button>
          <div className="h-full w-[1px] bg-gray-100 min-h-[1.5rem]"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-serif text-lg font-medium text-gray-800 truncate pr-2 ${activity.isCompleted ? 'line-through text-gray-400' : ''}`}>
              {activity.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${CategoryStyles[activity.category]}`}>
              {CategoryIcons[activity.category]}
              {CategoryLabels[activity.category]}
            </span>
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <MapPin size={10} /> {activity.location}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
            {activity.cost > 0 && (
              <span className="font-mono text-gray-500">
                ¥{activity.cost.toLocaleString()}
              </span>
            )}
            {activity.notes && (
               <span className="text-gray-400 italic pl-2 border-l border-gray-200">
                {activity.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions Footer - Minimalist */}
      <div className="flex justify-end items-center gap-4 mt-3 pt-2 border-t border-gray-50">
        <button 
          onClick={handleMapClick}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-blue-600 transition-colors pointer-events-auto"
        >
          <MapPin size={12} />
          地圖
        </button>
        {/* Edit button removed. Long press card to edit. */}
      </div>
    </div>
  );
};

export default ActivityCard;