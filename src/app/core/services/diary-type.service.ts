// master - MARSISCA - BEGIN 2025-12-08
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  DiaryType,
  DiaryTypesResponse,
  DiaryTypeResponse,
  CreateDiaryTypeRequest,
  UpdateDiaryTypeRequest
} from '../models/diary-type.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllDiaryTypes } from '../../api/fn/diaries/get-all-diary-types';
import { getDiaryTypeById } from '../../api/fn/diaries/get-diary-type-by-id';
import { createDiaryType } from '../../api/fn/diaries/create-diary-type';
import { updateDiaryType } from '../../api/fn/diaries/update-diary-type';
import { deleteDiaryType } from '../../api/fn/diaries/delete-diary-type';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class DiaryTypeService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getUserDiaryTypes(userId: number): Observable<DiaryTypesResponse> {
    return getAllDiaryTypes(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as DiaryTypesResponse)
    );
  }

  getDiaryType(id: number): Observable<DiaryTypeResponse> {
    return getDiaryTypeById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as DiaryTypeResponse)
    );
  }

  createDiaryType(data: CreateDiaryTypeRequest): Observable<DiaryTypeResponse> {
    return createDiaryType(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as DiaryTypeResponse)
    );
  }

  updateDiaryType(id: number, data: UpdateDiaryTypeRequest): Observable<DiaryTypeResponse> {
    return updateDiaryType(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as DiaryTypeResponse)
    );
  }

  deleteDiaryType(id: number): Observable<{ success: boolean; message: string }> {
    return deleteDiaryType(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-12-08
