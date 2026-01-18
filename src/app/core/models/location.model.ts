// master - MARSISCA - BEGIN 2026-01-02
import { Country } from './country.model';
// master - MARSISCA - END 2026-01-02

// master - MARSISCA - BEGIN 2025-11-15
export interface LocationSuggestion {
  id?: number;
  externalId?: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Location {
  id: number;
  externalId?: string;
  name: string;
  latitude: number;
  longitude: number;
  countryId: number;
  country: Country;
  createdAt: string;
  updatedAt: string;
}

export interface TripLocationDetail {
  id: number;
  externalId?: string;
  name: string;
  latitude: number;
  longitude: number;
  countryId: number;
  country: Country;
  createdAt: string;
  updatedAt: string;
}
// master - MARSISCA - END 2025-12-28

export interface TripLocation {
  id: number;
  tripId: number;
  locationId: number;
  location: LocationSuggestion;
  createdAt: string;
}

export interface LocationSearchResponse {
  success: boolean;
  message: string;
  data: LocationSuggestion[];
}

export interface TripLocationsResponse {
  success: boolean;
  message: string;
  data: TripLocation[];
}

export interface AddLocationToTripResponse {
  success: boolean;
  message: string;
  data?: TripLocation;
}

// master - MARSISCA - BEGIN 2024-12-24
export interface CreateLocationRequest {
  externalId?: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CreateLocationResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    externalId?: string;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
  };
}
// master - MARSISCA - END 2024-12-24

// master - MARSISCA - BEGIN 2026-01-18
export interface LocationsResponse {
  success: boolean;
  message: string;
  data: Location[];
}

export interface LocationResponse {
  success: boolean;
  message: string;
  data?: Location;
}

export interface UpdateLocationRequest {
  name?: string;
  latitude?: number;
  longitude?: number;
  countryId?: number;
}

export interface DeleteLocationResponse {
  success: boolean;
  message: string;
}
// master - MARSISCA - END 2026-01-18
// master - MARSISCA - END 2025-11-15
