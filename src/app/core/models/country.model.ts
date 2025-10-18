// master - MARSISCA - BEGIN 2025-10-18
export interface Country {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  continent: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountriesResponse {
  success: boolean;
  message: string;
  data: Country[];
}
// master - MARSISCA - END 2025-10-18
