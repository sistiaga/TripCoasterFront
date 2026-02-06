// master - MARSISCA - BEGIN 2026-01-03
import { TripLocationDetail } from './location.model';
import { Weather } from './weather.model';
import { Accommodation } from './accommodation.model';
import { TransportationType } from './transportation-type.model';
import { Country } from './country.model';
// master - MARSISCA - END 2026-01-03

// master - MARSISCA - BEGIN 2026-01-24
export interface PhotoWeather {
  id: number;
  dateTime: string;
  wmoCode: number;
  weatherIconUrl?: string;
  temperature: number;
  precipitationMm: number;
  windSpeed: number;
  cloudCoverage: number;
  source: string;
  latitude: number;
  longitude: number;
}
// master - MARSISCA - END 2026-01-24

export interface TripPhoto {
  id: number;
  url: string;
  path?: string;
  filename: string;
  originalName?: string;
  tripId: number;
  isMain?: boolean;
  latitude?: number;
  longitude?: number;
  metadata?: any;
  mimeType?: string;
  size?: number;
  cameraMake?: string;
  cameraModel?: string;
  dateTaken?: string;
  dateTakenUTC?: string;
  timezone?: string;
  caption?: string;
  photoWeather?: PhotoWeather;
  createdAt: string;
  updatedAt?: string;
}

export interface Trip {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  rating: number | null;
  userId: number;
  photos?: TripPhoto[];
  // master - MARSISCA - BEGIN 2024-12-24
  mainPhoto?: TripPhoto | null;
  // master - MARSISCA - END 2024-12-24
  // master - MARSISCA - BEGIN 2025-12-28
  locations?: TripLocationDetail[];
  // master - MARSISCA - END 2025-12-28
  // master - MARSISCA - BEGIN 2026-01-09
  weatherTypeId?: number;
  weatherType?: Weather;
  accommodationTypeId?: number;
  accommodationType?: Accommodation;
  transportationTypeId?: number;
  transportationType?: TransportationType;
  countryId?: number;
  countries?: Country[];
  // master - MARSISCA - END 2026-01-09
  // master - MARSISCA - BEGIN 2026-01-10
  diaries?: import('./diary.model').Diary[];
  mainCountryId?: number;
  mainCountry?: Country;
  // master - MARSISCA - END 2026-01-10
  createdAt: string;
  updatedAt: string;
}

export interface TripsResponse {
  success: boolean;
  message: string;
  data: Trip[];
}

export interface PhotoUpdateRequest {
  isMain?: boolean;
}

export interface PhotoResponse {
  success: boolean;
  message: string;
  data?: TripPhoto;
}
// master - MARSISCA - END 2025-12-08

// master - MARSISCA - BEGIN 2026-01-10
/**
 * Statistics returned when creating a trip from photos
 */
export interface TripCreationStats {
  photosProcessed: number;
  photosUploaded: number;
  photosFailed: number;
  diariesCreated: number;
  locationsFound: number;
  countriesVisited: number;
  daysOfTravel: number;
}

/**
 * Response from creating a trip from photos
 */
export interface TripCreationResponse {
  trip: Trip;
  stats: TripCreationStats;
  warnings: string[];
}

/**
 * API response for trip creation from photos
 */
export interface TripCreationApiResponse {
  success: boolean;
  message: string;
  data: TripCreationResponse;
}
// master - MARSISCA - END 2026-01-10
