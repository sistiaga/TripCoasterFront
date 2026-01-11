// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Weather,
  WeathersResponse,
  WeatherResponse,
  CreateWeatherRequest,
  UpdateWeatherRequest
} from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // master - MARSISCA - BEGIN 2026-01-10
  private readonly endpoint = '/weather-types';
  // master - MARSISCA - END 2026-01-10

  constructor(private apiService: ApiService) {}

  getWeathers(): Observable<WeathersResponse> {
    return this.apiService.get<WeathersResponse>(this.endpoint);
  }

  getWeather(id: number): Observable<WeatherResponse> {
    return this.apiService.get<WeatherResponse>(`${this.endpoint}/${id}`);
  }

  createWeather(data: CreateWeatherRequest): Observable<WeatherResponse> {
    return this.apiService.post<WeatherResponse>(this.endpoint, data);
  }

  updateWeather(id: number, data: UpdateWeatherRequest): Observable<WeatherResponse> {
    return this.apiService.put<WeatherResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteWeather(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }

  uploadIcon(id: number, iconFile: File): Observable<WeatherResponse> {
    const formData = new FormData();
    formData.append('icon', iconFile);
    return this.apiService.post<WeatherResponse>(`${this.endpoint}/${id}/icon`, formData);
  }
}
// master - MARSISCA - END 2025-12-31
