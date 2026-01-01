// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Sport,
  SportsResponse,
  SportResponse,
  CreateSportRequest,
  UpdateSportRequest
} from '../models/sport.model';

@Injectable({
  providedIn: 'root'
})
export class SportService {
  private readonly endpoint = '/sports';

  constructor(private apiService: ApiService) {}

  getSports(): Observable<SportsResponse> {
    return this.apiService.get<SportsResponse>(this.endpoint);
  }

  getSport(id: number): Observable<SportResponse> {
    return this.apiService.get<SportResponse>(`${this.endpoint}/${id}`);
  }

  createSport(data: CreateSportRequest): Observable<SportResponse> {
    return this.apiService.post<SportResponse>(this.endpoint, data);
  }

  updateSport(id: number, data: UpdateSportRequest): Observable<SportResponse> {
    return this.apiService.put<SportResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteSport(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }

  uploadIcon(id: number, iconFile: File): Observable<SportResponse> {
    const formData = new FormData();
    formData.append('icon', iconFile);
    return this.apiService.post<SportResponse>(`${this.endpoint}/${id}/icon`, formData);
  }
}
// master - MARSISCA - END 2025-12-31
