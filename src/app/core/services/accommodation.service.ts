// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Accommodation,
  AccommodationsResponse,
  AccommodationResponse,
  CreateAccommodationRequest,
  UpdateAccommodationRequest
} from '../models/accommodation.model';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private readonly endpoint = '/accommodations';

  constructor(private apiService: ApiService) {}

  getAccommodations(): Observable<AccommodationsResponse> {
    return this.apiService.get<AccommodationsResponse>(this.endpoint);
  }

  getAccommodation(id: number): Observable<AccommodationResponse> {
    return this.apiService.get<AccommodationResponse>(`${this.endpoint}/${id}`);
  }

  createAccommodation(data: CreateAccommodationRequest): Observable<AccommodationResponse> {
    return this.apiService.post<AccommodationResponse>(this.endpoint, data);
  }

  updateAccommodation(id: number, data: UpdateAccommodationRequest): Observable<AccommodationResponse> {
    return this.apiService.put<AccommodationResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteAccommodation(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }
}
// master - MARSISCA - END 2025-12-31
