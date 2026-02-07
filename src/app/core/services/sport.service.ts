// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  Sport,
  SportsResponse,
  SportResponse,
  CreateSportRequest,
  UpdateSportRequest
} from '../models/sport.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllSports } from '../../api/fn/sports/get-all-sports';
import { getSportById } from '../../api/fn/sports/get-sport-by-id';
import { createSport } from '../../api/fn/sports/create-sport';
import { updateSport } from '../../api/fn/sports/update-sport';
import { deleteSport } from '../../api/fn/sports/delete-sport';
import { uploadSportIcon } from '../../api/fn/sports/upload-sport-icon';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class SportService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getSports(): Observable<SportsResponse> {
    return getAllSports(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as SportsResponse)
    );
  }

  getSport(id: number): Observable<SportResponse> {
    return getSportById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as SportResponse)
    );
  }

  createSport(data: CreateSportRequest): Observable<SportResponse> {
    return createSport(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as SportResponse)
    );
  }

  updateSport(id: number, data: UpdateSportRequest): Observable<SportResponse> {
    return updateSport(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as SportResponse)
    );
  }

  deleteSport(id: number): Observable<{ success: boolean; message: string }> {
    return deleteSport(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }

  uploadIcon(id: number, iconFile: File): Observable<SportResponse> {
    return uploadSportIcon(this.http, this.apiConfig.rootUrl, { id, body: { icon: iconFile } }).pipe(
      map(r => r.body as SportResponse)
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-12-31
