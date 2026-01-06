// master - MARSISCA - BEGIN 2026-01-03
export interface Accommodation {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}
// master - MARSISCA - END 2026-01-03

export interface AccommodationsResponse {
  success: boolean;
  message: string;
  data: Accommodation[];
}

export interface AccommodationResponse {
  success: boolean;
  message: string;
  data: Accommodation;
}

export interface CreateAccommodationRequest {
  nameSpanish: string;
  nameEnglish: string;
}

export interface UpdateAccommodationRequest {
  nameSpanish?: string;
  nameEnglish?: string;
}
// master - MARSISCA - END 2025-12-31
