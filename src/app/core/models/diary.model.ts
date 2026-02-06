// master - MARSISCA - BEGIN 2026-01-24
import { Weather } from './weather.model';

export interface Diary {
  id: number;
  tripId: number;
  diaryTypeId: number | null;
  weatherTypeId: number | null;
  dateTime: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  diaryType?: {
    id: number;
    name: string;
    description: string;
  };
  weatherType?: Weather;
  diaryWeatherId?: number | null;
  diaryWeather?: import('./diary-weather.model').DiaryWeather;
  locations?: import('./location.model').Location[];
  photos?: import('./trip.model').TripPhoto[];
}
// master - MARSISCA - END 2026-01-24

export interface DiariesResponse {
  success: boolean;
  message: string;
  data: Diary[];
}

export interface DiaryResponse {
  success: boolean;
  message: string;
  data: Diary;
}

// master - MARSISCA - BEGIN 2026-01-24
export interface CreateDiaryRequest {
  tripId: number;
  diaryTypeId?: number | null;
  weatherTypeId?: number | null;
  dateTime: string;
  title: string;
  description: string;
}

export interface UpdateDiaryRequest {
  diaryTypeId?: number | null;
  weatherTypeId?: number | null;
  dateTime?: string;
  title?: string;
  description?: string;
}
// master - MARSISCA - END 2026-01-24
