// master - MARSISCA - BEGIN 2026-02-07
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  Diary,
  DiariesResponse,
  DiaryResponse,
  CreateDiaryRequest,
  UpdateDiaryRequest
} from '../models/diary.model';

import { getDiariesByTripId } from '../../api/fn/diaries/get-diaries-by-trip-id';
import { getDiaryById } from '../../api/fn/diaries/get-diary-by-id';
import { createDiary } from '../../api/fn/diaries/create-diary';
import { updateDiary } from '../../api/fn/diaries/update-diary';
import { deleteDiary } from '../../api/fn/diaries/delete-diary';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getTripDiaries(tripId: number): Observable<DiariesResponse> {
    return getDiariesByTripId(this.http, this.apiConfig.rootUrl, { tripId }).pipe(
      map(r => r.body as unknown as DiariesResponse)
    );
  }

  getDiary(id: number): Observable<DiaryResponse> {
    return getDiaryById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as unknown as DiaryResponse)
    );
  }

  createDiary(data: CreateDiaryRequest): Observable<DiaryResponse> {
    return createDiary(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as unknown as DiaryResponse)
    );
  }

  updateDiary(id: number, data: UpdateDiaryRequest): Observable<DiaryResponse> {
    return updateDiary(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as unknown as DiaryResponse)
    );
  }

  deleteDiary(id: number): Observable<{ success: boolean; message: string }> {
    return deleteDiary(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }
}
// master - MARSISCA - END 2026-02-07
