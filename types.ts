export enum Category {
  Transport = 'Transport',
  Sightseeing = 'Sightseeing',
  Food = 'Food',
  Shopping = 'Shopping',
  Accommodation = 'Accommodation',
  Flexible = 'Flexible',
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  category: Category;
  cost: number;
  currency: 'JPY' | 'TWD';
  notes: string;
  isCompleted: boolean;
}

export interface WeatherInfo {
  location: string;
  temp: number;
  condition: string;
  icon: string;
  clothing: string;
}

export interface DaySchedule {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. "12/05 (五)"
  weather: WeatherInfo;
  activities: Activity[];
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}