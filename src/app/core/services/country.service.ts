// master - MARSISCA - BEGIN 2025-12-14
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../../api/api-configuration';
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

// master - MARSISCA - BEGIN 2026-02-07
import { getAllCountries } from '../../api/fn/countries/get-all-countries';
import { getCountryById } from '../../api/fn/countries/get-country-by-id';
import { createCountry } from '../../api/fn/countries/create-country';
import { updateCountry } from '../../api/fn/countries/update-country';
import { deleteCountry } from '../../api/fn/countries/delete-country';
// master - MARSISCA - END 2026-02-07

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  getCountries(): Observable<CountriesResponse> {
    return getAllCountries(this.http, this.apiConfig.rootUrl).pipe(
      map(r => r.body as CountriesResponse)
    );
  }

  getCountry(id: number): Observable<CountryResponse> {
    return getCountryById(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as CountryResponse)
    );
  }

  createCountry(data: CreateCountryRequest): Observable<CountryResponse> {
    return createCountry(this.http, this.apiConfig.rootUrl, { body: data as any }).pipe(
      map(r => r.body as CountryResponse)
    );
  }

  updateCountry(id: number, data: UpdateCountryRequest): Observable<CountryResponse> {
    return updateCountry(this.http, this.apiConfig.rootUrl, { id, body: data as any }).pipe(
      map(r => r.body as CountryResponse)
    );
  }

  deleteCountry(id: number): Observable<{ success: boolean; message: string }> {
    return deleteCountry(this.http, this.apiConfig.rootUrl, { id }).pipe(
      map(r => r.body as { success: boolean; message: string })
    );
  }
  // master - MARSISCA - END 2026-02-07
}
// master - MARSISCA - END 2025-12-14
