// master - MARSISCA - BEGIN 2025-10-11
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TripsResponse, Trip } from '../models/trip.model';

export interface CreateTripData {
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
}
// master - MARSISCA - END 2025-10-11
