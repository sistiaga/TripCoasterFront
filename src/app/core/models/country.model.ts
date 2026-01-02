// master - MARSISCA - BEGIN 2026-01-02
export interface Country {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  flagPath: string;
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
// master - MARSISCA - END 2026-01-02
