// master - MARSISCA - BEGIN 2026-01-10

/**
 * Historical weather data for a specific date and location
 * Used in diary entries created from photos
 */
export interface DiaryWeather {
  id: number;
  date: string; // ISO 8601 date
  temperatureMin: number | null; // Celsius
  temperatureMax: number | null; // Celsius
  precipitationMm: number | null; // Millimeters
  windSpeed: number | null; // km/h
  cloudCoverage: number | null; // 0-100%
  weatherCode: number | null; // WMO weather code
  source: string; // "open-meteo"
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * WMO Weather Code mapping
 * Used to interpret weatherCode from DiaryWeather
 */
export const WMO_WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

// master - MARSISCA - END 2026-01-10
