// master - MARSISCA - BEGIN 2026-01-18
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  POI,
  POIsResponse,
  POIResponse,
  CreatePOIRequest,
  UpdatePOIRequest,
  DeletePOIResponse
} from '../models/poi.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllPois } from '../../api/fn/po-is/get-all-pois';
import { getPoiById } from '../../api/fn/po-is/get-poi-by-id';
import { createPoi } from '../../api/fn/po-is/create-poi';
import { updatePoi } from '../../api/fn/po-is/update-poi';
import { deletePoi } from '../../api/fn/po-is/delete-poi';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class POIService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getPOIs(): Observable<POIsResponse> {
    return getAllPois(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as POIsResponse)
    );
  }

  getPOI(id: number): Observable<POIResponse> {
    return getPoiById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as POIResponse)
    );
  }

  createPOI(poiData: CreatePOIRequest): Observable<POIResponse> {
    return createPoi(this.http, this.apiConfig.rootUrl, { body: poiData as any }).pipe(
      map(r => r.body as POIResponse)
    );
  }

  updatePOI(id: number, poiData: UpdatePOIRequest): Observable<POIResponse> {
    return updatePoi(this.http, this.apiConfig.rootUrl, { id, body: poiData as any }).pipe(
      map(r => r.body as POIResponse)
    );
  }

  deletePOI(id: number): Observable<DeletePOIResponse> {
    return deletePoi(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as DeletePOIResponse)
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2026-01-18
