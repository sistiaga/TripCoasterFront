// master - MARSISCA - BEGIN 2025-12-31
export interface Sport {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SportsResponse {
  success: boolean;
  message: string;
  data: Sport[];
}

export interface SportResponse {
  success: boolean;
  message: string;
  data: Sport;
}

export interface CreateSportRequest {
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
}

export interface UpdateSportRequest {
  nameSpanish?: string;
  nameEnglish?: string;
  icon?: string;
}
// master - MARSISCA - END 2025-12-31
