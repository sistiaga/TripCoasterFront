// master - MARSISCA - BEGIN 2025-12-08
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// master - MARSISCA - BEGIN 2026-01-10
import { Observable, map } from 'rxjs';
// master - MARSISCA - END 2026-01-10
import { ApiConfiguration } from '../../api/api-configuration';
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

// master - MARSISCA - BEGIN 2026-02-07
import { getTripsByUserId } from '../../api/fn/trips/get-trips-by-user-id';
import { getTripById as getTripByIdFn } from '../../api/fn/trips/get-trip-by-id';
import { createTrip } from '../../api/fn/trips/create-trip';
import { updateTrip } from '../../api/fn/trips/update-trip';
import { getPhotosByTripId } from '../../api/fn/photos/get-photos-by-trip-id';
import { uploadPhotos } from '../../api/fn/photos/upload-photos';
import { updatePhotoById } from '../../api/fn/photos/update-photo-by-id';
import { deletePhoto } from '../../api/fn/photos/delete-photo';
import { getPhotoById as getPhotoByIdFn } from '../../api/fn/photos/get-photo-by-id';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class TripService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getUserTrips(userId: number): Observable<TripsResponse> {
    return getTripsByUserId(this.http, this.apiConfig.rootUrl, { userId }).pipe(
      map(r => r.body as TripsResponse)
    );
  }

  // master - MARSISCA - BEGIN 2025-12-28
  getTripById(tripId: number): Observable<{ success: boolean; message: string; data: Trip }> {
    return getTripByIdFn(this.http, this.apiConfig.rootUrl, { id: tripId }).pipe(
      map(r => r.body as { success: boolean; message: string; data: Trip })
    );
  }
  // master - MARSISCA - END 2025-12-28

  createTrip(tripData: CreateTripData): Observable<CreateTripResponse> {
    return createTrip(this.http, this.apiConfig.rootUrl, { body: tripData as any }).pipe(
      map(r => r.body as CreateTripResponse)
    );
  }

  updateTrip(tripId: number, tripData: UpdateTripData): Observable<UpdateTripResponse> {
    return updateTrip(this.http, this.apiConfig.rootUrl, { id: tripId, body: tripData as any }).pipe(
      map(r => r.body as UpdateTripResponse)
    );
  }

  uploadPhotos(tripId: number, photos: File[]): Observable<any> {
    return uploadPhotos(this.http, this.apiConfig.rootUrl, {
      id: tripId,
      body: { photos }
    }).pipe(
      map(r => r.body)
    );
  }

  getTripPhotos(tripId: number): Observable<any> {
    return getPhotosByTripId(this.http, this.apiConfig.rootUrl, { id: tripId }).pipe(
      map(r => r.body)
    );
  }

  updatePhoto(photoId: number, data: PhotoUpdateRequest): Observable<PhotoResponse> {
    return updatePhotoById(this.http, this.apiConfig.rootUrl, { photoId, body: data as any }).pipe(
      map(r => r.body as PhotoResponse)
    );
  }

  deletePhoto(photoId: number): Observable<any> {
    return deletePhoto(this.http, this.apiConfig.rootUrl, { photoId }).pipe(
      map(r => r.body)
    );
  }

  getPhotoById(photoId: number): Observable<PhotoResponse> {
    return getPhotoByIdFn(this.http, this.apiConfig.rootUrl, { photoId }).pipe(
      map(r => r.body as PhotoResponse)
    );
  }
  // master - MARSISCA - END 2026-02-07

  // master - MARSISCA - BEGIN 2026-02-07
  getTripsByMonth(year: number, month: number, userId: number): Observable<Trip[]> {
    return this.http.get<{ success: boolean; data: Trip[] }>(
      `${this.apiConfig.rootUrl}/calendar/${year}/${month}?userId=${userId}`
    ).pipe(
      map(response => response.data)
    );
  }
  // master - MARSISCA - END 2026-02-07

  // master - MARSISCA - BEGIN 2026-01-10
  getTripWithFullDetails(tripId: number): Observable<Trip> {
    return this.http.get<{ success: boolean; message: string; data: Trip }>(
      `${this.apiConfig.rootUrl}/trips/${tripId}?include=photos,diaries,locations,countries,weather`
    ).pipe(
      map(response => response.data)
    );
  }

  getTripDurationInDays(trip: Trip): number {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  isUpcomingTrip(trip: Trip): boolean {
    const startDate = new Date(trip.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate > today;
  }

  isPastTrip(trip: Trip): boolean {
    const endDate = new Date(trip.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  }

  isOngoingTrip(trip: Trip): boolean {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate <= today && endDate >= today;
  }

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
