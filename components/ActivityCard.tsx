import React from 'react';
import { Activity, Category } from '../types';
import { MapPin, Utensils, Train, ShoppingBag, Bed, CheckCircle, Circle, Navigation } from 'lucide-react';

interface Props {
  activity: Activity;
  onToggleComplete: (id: string) => void;
  onEdit: (activity: Activity) => void;
}

const CategoryIcons: Record<Category, React.ReactNode> = {
  [Category.Transport]: <Train size={14} />,
  [Category.Food]: <Utensils size={14} />,
  [Category.Sightseeing]: <MapPin size={14} />,
  [Category.Shopping]: <ShoppingBag size={14} />,
  [Category.Accommodation]: <Bed size={14} />,
  [Category.Flexible]: <Circle size={14} />,
};

const CategoryLabels: Record<Category, string> = {
  [Category.Transport]: '交通',
  [Category.Food]: '美食',
  [Category.Sightseeing]: '景點',
  [Category.Shopping]: '購物',
  [Category.Accommodation]: '住宿',
  [Category.Flexible]: '彈性',
};

const CategoryStyles: Record<Category, string> = {
  [Category.Transport]: 'text-blue-500 bg-blue-50/80 border-blue-100',
  [Category.Food]: 'text-orange-500 bg-orange-50/80 border-orange-100',
  [Category.Sightseeing]: 'text-emerald-500 bg-emerald-50/80 border-emerald-100',
  [Category.Shopping]: 'text-pink-500 bg-pink-50/80 border-pink-100',
  [Category.Accommodation]: 'text-indigo-500 bg-indigo-50/80 border-indigo-100',
  [Category.Flexible]: 'text-gray-500 bg-gray-50/80 border-gray-100',
};

const ActivityCard: React.FC<Props> = ({ activity, onToggleComplete, onEdit }) => {
  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(activity.id);
  };

  return (
    <div 
        className={`relative mb-3 rounded-2xl border transition-all duration-300 select-none group
            ${activity.isCompleted 
                ? 'bg-gray-50/80 border-gray-100 grayscale opacity-70' 
                : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 active:scale-[0.99]'
            }`}
        onDoubleClick={() => onEdit(activity)}
    >
      {/* Map Button - Absolute Top Right (Cute & Minimalist) */}
      <button 
        onClick={handleMapClick}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 hover:scale-110 transition-all z-10 active:scale-95"
        title="Google Maps"
      >
        <Navigation size={14} strokeWidth={2.5} />
      </button>

      <div className="flex items-stretch gap-3 p-4 pointer-events-none">
        {/* Time & Timeline */}
        <div className="flex flex-col items-center pt-1 min-w-[3rem]">
          <span className="text-xs font-mono text-gray-400 font-medium tracking-tight mb-1">{activity.time}</span>
           <button onClick={handleCheckboxClick} className="text-gray-200 hover:text-emerald-400 transition-colors pointer-events-auto hover:scale-110 active:scale-90 duration-200">
            {activity.isCompleted ? <CheckCircle size={22} className="text-emerald-400 fill-emerald-50" /> : <Circle size={22} strokeWidth={1.5} />}
          </button>
          {/* Dotted Line for "Journal" feel */}
          <div className="flex-1 w-0 border-l-[1.5px] border-dashed border-gray-200 my-1 min-h-[1.5rem]"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Header */}
          <div className="mb-1.5 pr-8"> {/* Padding right for Map Button */}
            <h3 className={`font-serif text-[17px] font-medium text-gray-700 leading-tight ${activity.isCompleted ? 'line-through decoration-gray-300' : ''}`}>
              {activity.title}
            </h3>
          </div>

          {/* Tags & Location */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className={`flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full border shadow-sm ${CategoryStyles[activity.category]}`}>
              {CategoryIcons[activity.category]}
              {CategoryLabels[activity.category]}
            </span>
            <p className="text-[11px] text-gray-400 truncate flex items-center gap-0.5 bg-gray-50 px-2 py-0.5 rounded-full">
              <MapPin size={10} /> {activity.location}
            </p>
          </div>
          
          {/* Details Footer */}
          {(activity.cost > 0 || activity.notes) && (
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs pt-2 border-t border-dashed border-gray-100">
                {activity.cost > 0 && (
                <span className="font-mono text-gray-500 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px]">
                    ¥{activity.cost.toLocaleString()}
                </span>
                )}
                {activity.notes && (
                <span className="text-gray-400 italic text-[11px]">
                    {activity.notes}
                </span>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;