// master - MARSISCA - BEGIN 2025-12-08
import { Injectable } from '@angular/core';
// master - MARSISCA - BEGIN 2026-01-10
import { Observable, map } from 'rxjs';
// master - MARSISCA - END 2026-01-10
import { ApiService } from './api.service';
import { TripsResponse, Trip, PhotoUpdateRequest, PhotoResponse } from '../models/trip.model';

export interface CreateTripData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  rating?: number;
  userId: number;
}

export interface UpdateTripData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  rating?: number;
  userId: number;
}

export interface CreateTripResponse {
  success: boolean;
  message: string;
  data?: Trip;
}

export interface UpdateTripResponse {
  success: boolean;
  message: string;
  data?: Trip;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor(private apiService: ApiService) {}

  getUserTrips(userId: number): Observable<TripsResponse> {
    return this.apiService.get<TripsResponse>(`/trips/user/${userId}`);
  }

  // master - MARSISCA - BEGIN 2025-12-28
  getTripById(tripId: number): Observable<{ success: boolean; message: string; data: Trip }> {
    return this.apiService.get<{ success: boolean; message: string; data: Trip }>(`/trips/${tripId}`);
  }
  // master - MARSISCA - END 2025-12-28

  createTrip(tripData: CreateTripData): Observable<CreateTripResponse> {
    return this.apiService.post<CreateTripResponse>('/trips', tripData);
  }

  updateTrip(tripId: number, tripData: UpdateTripData): Observable<UpdateTripResponse> {
    return this.apiService.put<UpdateTripResponse>(`/trips/${tripId}`, tripData);
  }

  uploadPhotos(tripId: number, photos: File[]): Observable<any> {
    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });
    return this.apiService.post(`/photos/trips/${tripId}/photos`, formData);
  }

  getTripPhotos(tripId: number): Observable<any> {
    return this.apiService.get(`/photos/trips/${tripId}/photos`);
  }

  updatePhoto(photoId: number, data: PhotoUpdateRequest): Observable<PhotoResponse> {
    return this.apiService.put<PhotoResponse>(`/photos/${photoId}`, data);
  }

  deletePhoto(photoId: number): Observable<any> {
    return this.apiService.delete(`/photos/${photoId}`);
  }

  getPhotoById(photoId: number): Observable<PhotoResponse> {
    return this.apiService.get<PhotoResponse>(`/photos/${photoId}`);
  }

  // master - MARSISCA - BEGIN 2026-01-10
  /**
   * Get trip with full details (including diaries, photos, locations, etc.)
   * @param tripId - ID of the trip
   * @returns Observable with full trip details
   */
  getTripWithFullDetails(tripId: number): Observable<Trip> {
    return this.apiService.get<{ success: boolean; message: string; data: Trip }>(
      `/trips/${tripId}?include=photos,diaries,locations,countries,weather`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Calculate trip duration in days
   * @param trip - Trip object
   * @returns Number of days
   */
  getTripDurationInDays(trip: Trip): number {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Check if trip is upcoming
   * @param trip - Trip object
   * @returns true if trip start date is in the future
   */
  isUpcomingTrip(trip: Trip): boolean {
    const startDate = new Date(trip.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate > today;
  }

  /**
   * Check if trip is past
   * @param trip - Trip object
   * @returns true if trip end date is in the past
   */
  isPastTrip(trip: Trip): boolean {
    const endDate = new Date(trip.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  }

  /**
   * Check if trip is currently ongoing
   * @param trip - Trip object
   * @returns true if today is between start and end dates
   */
  isOngoingTrip(trip: Trip): boolean {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate <= today && endDate >= today;
  }

  /**
   * Format trip date range for display
   * @param trip - Trip object
   * @returns Formatted date range string
   */
  formatTripDateRange(trip: Trip): string {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = start.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  }
  // master - MARSISCA - END 2026-01-10
}
// master - MARSISCA - END 2025-12-08
