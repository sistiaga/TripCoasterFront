// master - MARSISCA - BEGIN 2025-10-18
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CountriesResponse } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private apiService: ApiService) {}

  getCountries(): Observable<CountriesResponse> {
    return this.apiService.get<CountriesResponse>('/countries');
  }
}
// master - MARSISCA - END 2025-10-18
