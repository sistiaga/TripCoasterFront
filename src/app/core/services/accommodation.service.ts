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
  // master - MARSISCA - BEGIN 2026-01-10
  private readonly endpoint = '/accommodation-types';
  // master - MARSISCA - END 2026-01-10

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

  // master - MARSISCA - BEGIN 2026-01-10
  uploadIcon(id: number, iconFile: File): Observable<AccommodationResponse> {
    const formData = new FormData();
    formData.append('icon', iconFile);
    return this.apiService.post<AccommodationResponse>(`${this.endpoint}/${id}/icon`, formData);
  }
  // master - MARSISCA - END 2026-01-10
}
// master - MARSISCA - END 2025-12-31
