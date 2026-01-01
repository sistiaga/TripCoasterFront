// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  TransportationType,
  TransportationTypesResponse,
  TransportationTypeResponse,
  CreateTransportationTypeRequest,
  UpdateTransportationTypeRequest
} from '../models/transportation-type.model';

@Injectable({
  providedIn: 'root'
})
export class TransportationTypeService {
  private readonly endpoint = '/transportation-types';

  constructor(private apiService: ApiService) {}

  getTransportationTypes(): Observable<TransportationTypesResponse> {
    return this.apiService.get<TransportationTypesResponse>(this.endpoint);
  }

  getTransportationType(id: number): Observable<TransportationTypeResponse> {
    return this.apiService.get<TransportationTypeResponse>(`${this.endpoint}/${id}`);
  }

  createTransportationType(data: CreateTransportationTypeRequest): Observable<TransportationTypeResponse> {
    return this.apiService.post<TransportationTypeResponse>(this.endpoint, data);
  }

  updateTransportationType(id: number, data: UpdateTransportationTypeRequest): Observable<TransportationTypeResponse> {
    return this.apiService.put<TransportationTypeResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteTransportationType(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }

  uploadIcon(id: number, iconFile: File): Observable<TransportationTypeResponse> {
    const formData = new FormData();
    formData.append('icon', iconFile);
    return this.apiService.post<TransportationTypeResponse>(`${this.endpoint}/${id}/icon`, formData);
  }
}
// master - MARSISCA - END 2025-12-31
