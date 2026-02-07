// master - MARSISCA - BEGIN 2025-12-31
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
import {
  Weather,
  WeathersResponse,
  WeatherResponse,
  CreateWeatherRequest,
  UpdateWeatherRequest
} from '../models/weather.model';

// master - MARSISCA - BEGIN 2026-02-07
import { getAllWeatherTypes } from '../../api/fn/settings/get-all-weather-types';
import { getWeatherTypeById } from '../../api/fn/settings/get-weather-type-by-id';
import { createWeatherType } from '../../api/fn/settings/create-weather-type';
import { updateWeatherType } from '../../api/fn/settings/update-weather-type';
import { deleteWeatherType } from '../../api/fn/settings/delete-weather-type';
import { uploadWeatherTypeIcon } from '../../api/fn/settings/upload-weather-type-icon';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getWeathers(): Observable<WeathersResponse> {
    return getAllWeatherTypes(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as WeathersResponse)
    );
  }

  getWeather(id: number): Observable<WeatherResponse> {
    return getWeatherTypeById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as WeatherResponse)
    );
  }

  createWeather(data: CreateWeatherRequest): Observable<WeatherResponse> {
    return createWeatherType(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as WeatherResponse)
    );
  }

  updateWeather(id: number, data: UpdateWeatherRequest): Observable<WeatherResponse> {
    return updateWeatherType(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as WeatherResponse)
    );
  }

  deleteWeather(id: number): Observable<{ success: boolean; message: string }> {
    return deleteWeatherType(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }

  uploadIcon(id: number, iconFile: File): Observable<WeatherResponse> {
    return uploadWeatherTypeIcon(this.http, this.apiConfig.rootUrl, { id, body: { icon: iconFile } }).pipe(
      map(r => r.body as WeatherResponse)
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-12-31
