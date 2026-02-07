// master - MARSISCA - BEGIN 2025-11-15
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  LocationSuggestion,
  LocationSearchResponse,
  TripLocationsResponse,
  AddLocationToTripResponse,
  // master - MARSISCA - BEGIN 2024-12-24
  CreateLocationRequest,
  CreateLocationResponse,
  // master - MARSISCA - END 2024-12-24
  // master - MARSISCA - BEGIN 2026-01-18
  LocationsResponse,
  LocationResponse,
  UpdateLocationRequest,
  DeleteLocationResponse
  // master - MARSISCA - END 2026-01-18
} from '../models/location.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllLocations } from '../../api/fn/locations/get-all-locations';
import { getLocationById } from '../../api/fn/locations/get-location-by-id';
import { createLocation } from '../../api/fn/locations/create-location';
import { deleteLocation } from '../../api/fn/locations/delete-location';
import { searchLocations } from '../../api/fn/locations/search-locations';
import { getLocationsByTripId } from '../../api/fn/trips/get-locations-by-trip-id';
import { addLocationToTrip } from '../../api/fn/trips/add-location-to-trip';
import { removeLocationFromTrip } from '../../api/fn/trips/remove-location-from-trip';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  search(query: string): Observable<LocationSearchResponse> {
    return searchLocations(this.http, this.apiConfig.rootUrl, { q: query }).pipe(
      map(r => r.body as LocationSearchResponse)
    );
  }

  // master - MARSISCA - BEGIN 2024-12-24
  createLocation(locationData: LocationSuggestion): Observable<CreateLocationResponse> {
    const requestData: CreateLocationRequest = {
      externalId: locationData.externalId,
      name: locationData.name,
      country: locationData.country,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    };

    return createLocation(this.http, this.apiConfig.rootUrl, { body: requestData as any }).pipe(
      map(r => r.body as CreateLocationResponse)
    );
  }
  // master - MARSISCA - END 2024-12-24

  addLocationToTrip(tripId: number, locationId: number | string): Observable<AddLocationToTripResponse> {
    return addLocationToTrip(this.http, this.apiConfig.rootUrl, {
      id: tripId,
      body: { locationId } as any
    }).pipe(
      map(r => r.body as AddLocationToTripResponse)
    );
  }

  getTripLocations(tripId: number): Observable<TripLocationsResponse> {
    return getLocationsByTripId(this.http, this.apiConfig.rootUrl, { id: tripId }).pipe(
      map(r => r.body as unknown as TripLocationsResponse)
    );
  }

  removeLocationFromTrip(tripId: number, locationId: number | string): Observable<any> {
    return removeLocationFromTrip(this.http, this.apiConfig.rootUrl, {
      id: tripId,
      locationId: locationId as number
    }).pipe(
      map(r => r.body)
    );
  }

  // master - MARSISCA - BEGIN 2026-01-18
  getLocations(): Observable<LocationsResponse> {
    return getAllLocations(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as LocationsResponse)
    );
  }

  getLocation(id: number): Observable<LocationResponse> {
    return getLocationById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as LocationResponse)
    );
  }

  updateLocation(id: number, locationData: UpdateLocationRequest): Observable<LocationResponse> {
    return this.http.put<LocationResponse>(`${this.apiConfig.rootUrl}/locations/${id}`, locationData);
  }

  deleteLocation(id: number): Observable<DeleteLocationResponse> {
    return deleteLocation(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as DeleteLocationResponse)
    );
  }
  // master - MARSISCA - END 2026-01-18
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-11-15
