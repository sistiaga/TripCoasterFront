// master - MARSISCA - BEGIN 2025-12-08
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  DiaryType,
  DiaryTypesResponse,
  DiaryTypeResponse,
  CreateDiaryTypeRequest,
  UpdateDiaryTypeRequest
} from '../models/diary-type.model';

@Injectable({
  providedIn: 'root'
})
export class DiaryTypeService {
  private readonly endpoint = '/diaries/types';

  constructor(private apiService: ApiService) {}

  getUserDiaryTypes(userId: number): Observable<DiaryTypesResponse> {
    return this.apiService.get<DiaryTypesResponse>(this.endpoint);
  }

  getDiaryType(id: number): Observable<DiaryTypeResponse> {
    return this.apiService.get<DiaryTypeResponse>(`${this.endpoint}/${id}`);
  }

  createDiaryType(data: CreateDiaryTypeRequest): Observable<DiaryTypeResponse> {
    return this.apiService.post<DiaryTypeResponse>(this.endpoint, data);
  }

  updateDiaryType(id: number, data: UpdateDiaryTypeRequest): Observable<DiaryTypeResponse> {
    return this.apiService.put<DiaryTypeResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteDiaryType(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }
}
// master - MARSISCA - END 2025-12-08
