// master - MARSISCA - BEGIN 2025-12-14
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Country, CountriesResponse } from '../models/country.model';

export interface CountryResponse {
  success: boolean;
  message: string;
  data: Country;
}

export interface CreateCountryRequest {
  name: string;
  latitude: number;
  longitude: number;
  continent: string;
}

export interface UpdateCountryRequest {
  name?: string;
  latitude?: number;
  longitude?: number;
  continent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly endpoint = '/countries';

  constructor(private apiService: ApiService) {}

  getCountries(): Observable<CountriesResponse> {
    return this.apiService.get<CountriesResponse>(this.endpoint);
  }

  getCountry(id: number): Observable<CountryResponse> {
    return this.apiService.get<CountryResponse>(`${this.endpoint}/${id}`);
  }

  createCountry(data: CreateCountryRequest): Observable<CountryResponse> {
    return this.apiService.post<CountryResponse>(this.endpoint, data);
  }

  updateCountry(id: number, data: UpdateCountryRequest): Observable<CountryResponse> {
    return this.apiService.put<CountryResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteCountry(id: number): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }
}
// master - MARSISCA - END 2025-12-14
