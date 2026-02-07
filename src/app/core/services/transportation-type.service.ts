// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  TransportationType,
  TransportationTypesResponse,
  TransportationTypeResponse,
  CreateTransportationTypeRequest,
  UpdateTransportationTypeRequest
} from '../models/transportation-type.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllTransportationTypes } from '../../api/fn/settings/get-all-transportation-types';
import { getTransportationTypeById } from '../../api/fn/settings/get-transportation-type-by-id';
import { createTransportationType } from '../../api/fn/settings/create-transportation-type';
import { updateTransportationType } from '../../api/fn/settings/update-transportation-type';
import { deleteTransportationType } from '../../api/fn/settings/delete-transportation-type';
import { uploadTransportationTypeIcon } from '../../api/fn/settings/upload-transportation-type-icon';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class TransportationTypeService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getTransportationTypes(): Observable<TransportationTypesResponse> {
    return getAllTransportationTypes(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as TransportationTypesResponse)
    );
  }

  getTransportationType(id: number): Observable<TransportationTypeResponse> {
    return getTransportationTypeById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as TransportationTypeResponse)
    );
  }

  createTransportationType(data: CreateTransportationTypeRequest): Observable<TransportationTypeResponse> {
    return createTransportationType(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as TransportationTypeResponse)
    );
  }

  updateTransportationType(id: number, data: UpdateTransportationTypeRequest): Observable<TransportationTypeResponse> {
    return updateTransportationType(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as TransportationTypeResponse)
    );
  }

  deleteTransportationType(id: number): Observable<{ success: boolean; message: string }> {
    return deleteTransportationType(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }

  uploadIcon(id: number, iconFile: File): Observable<TransportationTypeResponse> {
    return uploadTransportationTypeIcon(this.http, this.apiConfig.rootUrl, { id, body: { icon: iconFile } }).pipe(
      map(r => r.body as TransportationTypeResponse)
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-12-31
