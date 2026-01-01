// master - MARSISCA - BEGIN 2025-12-31
export interface Weather {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeathersResponse {
  success: boolean;
  message: string;
  data: Weather[];
}

export interface WeatherResponse {
  success: boolean;
  message: string;
  data: Weather;
}

export interface CreateWeatherRequest {
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
}

export interface UpdateWeatherRequest {
  nameSpanish?: string;
  nameEnglish?: string;
  icon?: string;
}
// master - MARSISCA - END 2025-12-31
