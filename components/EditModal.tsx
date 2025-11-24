import React, { useState, useEffect } from 'react';
import { Activity, Category } from '../types';
import { X, Save, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  activity: Activity | null; // null means adding new
  onClose: () => void;
  onSave: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const CategoryLabels: Record<Category, string> = {
  [Category.Transport]: '交通',
  [Category.Food]: '美食',
  [Category.Sightseeing]: '景點',
  [Category.Shopping]: '購物',
  [Category.Accommodation]: '住宿',
  [Category.Flexible]: '彈性',
};

const EditModal: React.FC<Props> = ({ isOpen, activity, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<Partial<Activity>>({});

  useEffect(() => {
    if (activity) {
      setForm({ ...activity });
    } else {
      setForm({
        id: Math.random().toString(36).substr(2, 9),
        time: '12:00',
        title: '',
        location: '',
        category: Category.Flexible,
        cost: 0,
        currency: 'JPY',
        notes: '',
        isCompleted: false,
      });
    }
  }, [activity, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Activity, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title && form.time) {
      onSave(form as Activity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-jp-bg">
          <h2 className="text-lg font-serif font-bold text-gray-800">
            {activity ? '編輯行程' : '新增行程'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-white">
          <form id="activity-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">時間</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={e => handleChange('time', e.target.value)}
                  className="w-full rounded-md border-gray-200 border p-2 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-1">類別</label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full rounded-md border-gray-200 border p-2 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{CategoryLabels[cat]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">活動名稱</label>
              <input
                type="text"
                required
                placeholder="例如：參觀太宰府"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full rounded-md border-gray-200 border p-2 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">地點 (Google 地圖關鍵字)</label>
              <input
                type="text"
                placeholder="例如：太宰府天滿宮"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full rounded-md border-gray-200 border p-2 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">預算 (日幣)</label>
                <input
                  type="number"
                  min="0"
                  value={form.cost}
                  onChange={e => handleChange('cost', parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border-gray-200 border p-2 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50"
                />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1">狀態</label>
                 <div className="flex items-center h-10">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            checked={form.isCompleted} 
                            onChange={(e) => handleChange('isCompleted', e.target.checked)}
                            className="w-4 h-4 text-gray-600 rounded border-gray-300 focus:ring-gray-500 accent-gray-600"
                        />
                        已完成
                    </label>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">筆記</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                className="w-full rounded-md border-gray-200 border p-2 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50 resize-none"
                placeholder="詳細資訊、預約號碼等..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-50 bg-jp-bg flex justify-between items-center">
          {activity ? (
            <button
              type="button"
              onClick={() => {
                 if(confirm("確定要刪除此行程嗎？")) {
                    onDelete(activity.id);
                    onClose();
                 }
              }}
              className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 flex items-center gap-1 text-sm"
            >
              <Trash2 size={14} /> 刪除
            </button>
          ) : (
            <div></div>
          )}
          <button
            form="activity-form"
            type="submit"
            className="bg-primary hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm flex items-center gap-2 transition-all"
          >
            <Save size={14} /> 儲存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;