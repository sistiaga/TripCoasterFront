// master - MARSISCA - BEGIN 2025-12-08
export interface Diary {
  id: number;
  tripId: number;
  diaryTypeId: number | null;
  day: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  diaryType?: {
    id: number;
    name: string;
    description: string;
  };
}
// master - MARSISCA - END 2025-12-08

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

// master - MARSISCA - BEGIN 2025-12-08
export interface CreateDiaryRequest {
  tripId: number;
  diaryTypeId?: number | null;
  day: string;
  title: string;
  description: string;
}
// master - MARSISCA - END 2025-12-08

// master - MARSISCA - BEGIN 2025-12-08
export interface UpdateDiaryRequest {
  diaryTypeId?: number | null;
  day?: string;
  title?: string;
  description?: string;
}
// master - MARSISCA - END 2025-12-08
