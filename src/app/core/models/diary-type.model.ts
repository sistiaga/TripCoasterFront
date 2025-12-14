export interface DiaryType {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryTypesResponse {
  success: boolean;
  message: string;
  data: DiaryType[];
}

export interface DiaryTypeResponse {
  success: boolean;
  message: string;
  data: DiaryType;
}

export interface CreateDiaryTypeRequest {
  name: string;
  description: string;
}

export interface UpdateDiaryTypeRequest {
  name?: string;
  description?: string;
}
