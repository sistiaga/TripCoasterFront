// master - MARSISCA - BEGIN 2026-01-18
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  POI,
  POIsResponse,
  POIResponse,
  CreatePOIRequest,
  UpdatePOIRequest,
  DeletePOIResponse
} from '../models/poi.model';

@Injectable({
  providedIn: 'root'
})
export class POIService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all POIs
   * @returns Observable with array of POIs
   */
  getPOIs(): Observable<POIsResponse> {
    return this.apiService.get<POIsResponse>('pois');
  }

  /**
   * Get a single POI by ID
   * @param id - POI ID
   * @returns Observable with the POI
   */
  getPOI(id: number): Observable<POIResponse> {
    return this.apiService.get<POIResponse>(`pois/${id}`);
  }

  /**
   * Create a new POI
   * @param poiData - POI data to create
   * @returns Observable with the created POI
   */
  createPOI(poiData: CreatePOIRequest): Observable<POIResponse> {
    return this.apiService.post<POIResponse>('pois', poiData);
  }

  /**
   * Update a POI
   * @param id - POI ID
   * @param poiData - Updated POI data
   * @returns Observable with the updated POI
   */
  updatePOI(id: number, poiData: UpdatePOIRequest): Observable<POIResponse> {
    return this.apiService.put<POIResponse>(`pois/${id}`, poiData);
  }

  /**
   * Delete a POI
   * @param id - POI ID
   * @returns Observable with the result
   */
  deletePOI(id: number): Observable<DeletePOIResponse> {
    return this.apiService.delete<DeletePOIResponse>(`pois/${id}`);
  }
}
// master - MARSISCA - END 2026-01-18
