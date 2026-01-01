// master - MARSISCA - BEGIN 2025-11-15
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  LocationSuggestion,
  LocationSearchResponse,
  TripLocationsResponse,
  AddLocationToTripResponse,
  // master - MARSISCA - BEGIN 2024-12-24
  CreateLocationRequest,
  CreateLocationResponse
  // master - MARSISCA - END 2024-12-24
} from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private apiService: ApiService) {}

  /**
   * Search for locations by query string
   * @param query - Search text for location name
   * @returns Observable with array of location suggestions
   */
  search(query: string): Observable<LocationSearchResponse> {
    const params = new HttpParams().set('query', query);
    return this.apiService.get<LocationSearchResponse>('locations/search', params);
  }

  // master - MARSISCA - BEGIN 2024-12-24
  /**
   * Create a new location in the database
   * @param locationData - Location data to create
   * @returns Observable with the created location
   */
  createLocation(locationData: LocationSuggestion): Observable<CreateLocationResponse> {
    const requestData: CreateLocationRequest = {
      externalId: locationData.externalId,
      name: locationData.name,
      country: locationData.country,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    };

    console.log('Creating location with data:', requestData);
    return this.apiService.post<CreateLocationResponse>('locations', requestData);
  }
  // master - MARSISCA - END 2024-12-24

  /**
   * Associate a location with a trip
   * @param tripId - ID of the trip
   * @param locationId - ID or externalId of the location to associate
   * @returns Observable with the created trip-location relationship
   */
  addLocationToTrip(tripId: number, locationId: number | string): Observable<AddLocationToTripResponse> {

    console.log(`Adding location ${locationId} to trip ${tripId}`);

    return this.apiService.post<AddLocationToTripResponse>(
      `trips/${tripId}/locations`,
      { locationId }
    );
  }

  /**
   * Get all locations associated with a trip
   * @param tripId - ID of the trip
   * @returns Observable with array of trip locations
   */
  getTripLocations(tripId: number): Observable<TripLocationsResponse> {
    return this.apiService.get<TripLocationsResponse>(`trips/${tripId}/locations`);
  }

  /**
   * Remove a location from a trip
   * @param tripId - ID of the trip
   * @param locationId - ID or externalId of the location to remove
   * @returns Observable with the result
   */
  removeLocationFromTrip(tripId: number, locationId: number | string): Observable<any> {
    return this.apiService.delete(`trips/${tripId}/locations/${locationId}`);
  }
}
// master - MARSISCA - END 2025-11-15
