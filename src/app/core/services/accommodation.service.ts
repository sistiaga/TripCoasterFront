// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  Accommodation,
  AccommodationsResponse,
  AccommodationResponse,
  CreateAccommodationRequest,
  UpdateAccommodationRequest
} from '../models/accommodation.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllAccommodationTypes } from '../../api/fn/settings/get-all-accommodation-types';
import { getAccommodationTypeById } from '../../api/fn/settings/get-accommodation-type-by-id';
import { createAccommodationType } from '../../api/fn/settings/create-accommodation-type';
import { updateAccommodationType } from '../../api/fn/settings/update-accommodation-type';
import { deleteAccommodationType } from '../../api/fn/settings/delete-accommodation-type';
import { uploadAccommodationTypeIcon } from '../../api/fn/settings/upload-accommodation-type-icon';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getAccommodations(): Observable<AccommodationsResponse> {
    return getAllAccommodationTypes(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as AccommodationsResponse)
    );
  }

  getAccommodation(id: number): Observable<AccommodationResponse> {
    return getAccommodationTypeById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as AccommodationResponse)
    );
  }

  createAccommodation(data: CreateAccommodationRequest): Observable<AccommodationResponse> {
    return createAccommodationType(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as AccommodationResponse)
    );
  }

  updateAccommodation(id: number, data: UpdateAccommodationRequest): Observable<AccommodationResponse> {
    return updateAccommodationType(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as AccommodationResponse)
    );
  }

  deleteAccommodation(id: number): Observable<{ success: boolean; message: string }> {
    return deleteAccommodationType(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }

  uploadIcon(id: number, iconFile: File): Observable<AccommodationResponse> {
    return uploadAccommodationTypeIcon(this.http, this.apiConfig.rootUrl, { id, body: { icon: iconFile } }).pipe(
      map(r => r.body as AccommodationResponse)
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-12-31
