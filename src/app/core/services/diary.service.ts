import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Diary,
  DiariesResponse,
  DiaryResponse,
  CreateDiaryRequest,
  UpdateDiaryRequest
} from '../models/diary.model';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private readonly endpoint = '/diaries';

  constructor(private apiService: ApiService) {}

  getTripDiaries(tripId: number): Observable<DiariesResponse> {
    return this.apiService.get<DiariesResponse>(`${this.endpoint}/trip/${tripId}`);
  }

  getDiary(id: number): Observable<DiaryResponse> {
    return this.apiService.get<DiaryResponse>(`${this.endpoint}/${id}`);
  }

  createDiary(data: CreateDiaryRequest): Observable<DiaryResponse> {
    return this.apiService.post<DiaryResponse>(this.endpoint, data);
  }

  updateDiary(id: number, data: UpdateDiaryRequest): Observable<DiaryResponse> {
    return this.apiService.put<DiaryResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteDiary(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }
}
