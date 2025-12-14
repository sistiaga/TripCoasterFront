// master - MARSISCA - BEGIN 2025-12-08
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
// master - MARSISCA - END 2025-12-08
