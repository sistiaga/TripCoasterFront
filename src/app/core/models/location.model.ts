// master - MARSISCA - BEGIN 2025-11-15
export interface LocationSuggestion {
  id?: number;
  externalId?: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

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
// master - MARSISCA - END 2025-11-15
