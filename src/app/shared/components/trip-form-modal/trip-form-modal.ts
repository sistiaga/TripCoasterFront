// master - MARSISCA - BEGIN 2026-01-03
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// master - MARSISCA - END 2026-01-03
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TripService } from '../../../core/services/trip.service';
import { AuthService } from '../../../core/services/auth.service';
import { StarRating } from '../star-rating/star-rating';
import { Trip } from '../../../core/models/trip.model';
import { parse, format } from 'date-fns';
// master - MARSISCA - BEGIN 2026-01-03
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WeatherService } from '../../../core/services/weather.service';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { TransportationTypeService } from '../../../core/services/transportation-type.service';
import { CountryService } from '../../../core/services/country.service';
import { Weather } from '../../../core/models/weather.model';
import { Accommodation } from '../../../core/models/accommodation.model';
import { TransportationType } from '../../../core/models/transportation-type.model';
import { Country } from '../../../core/models/country.model';
import { environment } from '../../../../environments/environment';
// master - MARSISCA - END 2026-01-03

export const EUROPEAN_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
// master - MARSISCA - END 2026-01-01

export interface TripFormData {
  trip?: Trip;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-trip-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    TranslateModule,
    StarRating
  ],
// master - MARSISCA - BEGIN 2026-01-01
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: EUROPEAN_DATE_FORMATS },
  ],
  // master - MARSISCA - END 2026-01-01
  templateUrl: './trip-form-modal.html',
  styleUrl: './trip-form-modal.scss'
})
export class TripFormModal implements OnInit {
  tripForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  mode: 'create' | 'edit' = 'create';
  tripId?: number;
  tripStartDate?: string;
  tripEndDate?: string;
  // master - MARSISCA - BEGIN 2026-01-03
  weathers: Weather[] = [];
  accommodations: Accommodation[] = [];
  transportationTypes: TransportationType[] = [];
  countries: Country[] = [];
  countryControl = new FormControl<string | Country>('');
  filteredCountries!: Observable<Country[]>;
  // master - MARSISCA - END 2026-01-03

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<TripFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: TripFormData,
    // master - MARSISCA - BEGIN 2026-01-03
    private weatherService: WeatherService,
    private accommodationService: AccommodationService,
    private transportationTypeService: TransportationTypeService,
    private countryService: CountryService,
    private translateService: TranslateService
    // master - MARSISCA - END 2026-01-03
  ) {
    this.mode = data?.mode || 'create';
    this.tripId = data?.trip?.id;

    this.tripForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      rating: [null, [Validators.min(0), Validators.max(5)]],
      // master - MARSISCA - BEGIN 2026-01-03
      weatherTypeId: [null],
      accommodationTypeId: [null],
      transportationTypeId: [null],
      countryId: [null]
      // master - MARSISCA - END 2026-01-03
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    // master - MARSISCA - BEGIN 2026-01-03
    // Track loading states
    let weathersLoaded = false;
    let accommodationsLoaded = false;
    let transportationTypesLoaded = false;
    let countriesLoaded = false;

    const checkAllLoaded = () => {
      if (weathersLoaded && accommodationsLoaded && transportationTypesLoaded && countriesLoaded) {
        if (this.mode === 'edit' && this.data?.trip) {
          this.populateForm(this.data.trip);
        }
      }
    };

    // Load weather types
    this.weatherService.getWeathers().subscribe({
      next: (response) => {
        if (response.success) {
          this.weathers = response.data;
        }
        weathersLoaded = true;
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading weathers:', error);
        weathersLoaded = true;
        checkAllLoaded();
      }
    });

    // Load accommodations
    this.accommodationService.getAccommodations().subscribe({
      next: (response) => {
        if (response.success) {
          this.accommodations = response.data;
        }
        accommodationsLoaded = true;
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading accommodations:', error);
        accommodationsLoaded = true;
        checkAllLoaded();
      }
    });

    // Load transportation types
    this.transportationTypeService.getTransportationTypes().subscribe({
      next: (response) => {
        if (response.success) {
          this.transportationTypes = response.data;
        }
        transportationTypesLoaded = true;
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading transportation types:', error);
        transportationTypesLoaded = true;
        checkAllLoaded();
      }
    });

    // Load countries
    this.countryService.getCountries().subscribe({
      next: (response) => {
        if (response.success) {
          this.countries = response.data;
          // Setup country autocomplete filter
          this.filteredCountries = this.countryControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCountries(value || ''))
          );
        }
        countriesLoaded = true;
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        countriesLoaded = true;
        checkAllLoaded();
      }
    });
    // master - MARSISCA - END 2026-01-03

    if (this.mode === 'edit' && this.data?.trip) {
      this.tripStartDate = this.data.trip.startDate;
      this.tripEndDate = this.data.trip.endDate;
    }
  }

  // master - MARSISCA - BEGIN 2026-01-03
  private _filterCountries(value: string | Country): Country[] {
    if (typeof value === 'object' && value !== null) {
      return this.countries;
    }

    const filterValue = (value as string).toLowerCase();
    const currentLang = this.translateService.currentLang || 'en';

    return this.countries.filter(country => {
      const name = currentLang === 'es' ? country.nameSpanish : country.nameEnglish;
      return name.toLowerCase().includes(filterValue);
    });
  }

  displayCountryFn(country: Country): string {
    return country ? this.getCurrentLangName(country) : '';
  }

  onCountrySelected(event: MatAutocompleteSelectedEvent): void {
    const country: Country = event.option.value;
    this.tripForm.patchValue({ countryId: country.id });
  }

  clearCountry(): void {
    this.countryControl.setValue('');
    this.tripForm.patchValue({ countryId: null });
  }

  isCountryObject(value: any): boolean {
    return typeof value === 'object' && value !== null && 'id' in value;
  }
  // master - MARSISCA - END 2026-01-03

// master - MARSISCA - BEGIN 2026-01-03
  private populateForm(trip: Trip): void {

    // Extract IDs from nested objects if they exist
    const weatherTypeId = trip.weatherTypeId || trip.weatherType?.id || null;
    const accommodationTypeId = trip.accommodationTypeId || trip.accommodationType?.id || null;
    const transportationTypeId = trip.transportationTypeId || trip.transportationType?.id || null;
    const countryId = trip.countryId || (trip.countries && trip.countries.length > 0 ? trip.countries[0].id : null);

    this.tripForm.patchValue({
      name: trip.name,
      description: trip.description,
      startDate: new Date(trip.startDate),
      endDate: new Date(trip.endDate),
      rating: trip.rating,
      weatherTypeId: weatherTypeId,
      accommodationTypeId: accommodationTypeId,
      transportationTypeId: transportationTypeId,
      countryId: countryId
    });

    // master - MARSISCA - BEGIN 2026-01-09
    // Set country control value - find country object from loaded countries
    if (countryId) {
      const country = this.countries.find(c => c.id === countryId);
      if (country) {
        this.countryControl.setValue(country);
      } else if (trip.countries && trip.countries.length > 0) {
        // Fallback: use trip.countries[0] if provided
        this.countryControl.setValue(trip.countries[0]);
      }
    }
  }

  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (end.getTime() < start.getTime()) {
      return { dateRange: true };
    }

    return null;
  }
  // master - MARSISCA - END 2026-01-01

  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';


    const tripData = {
      name: this.tripForm.value.name?.trim(),
      description: this.tripForm.value.description?.trim() || undefined,
      startDate: this.formatDate(this.tripForm.value.startDate),
      endDate: this.formatDate(this.tripForm.value.endDate),
      rating: this.tripForm.value.rating ? parseFloat(this.tripForm.value.rating) : undefined,
      userId: user.id,
      weatherTypeId: this.tripForm.value.weatherTypeId !== null ? this.tripForm.value.weatherTypeId : undefined,
      accommodationTypeId: this.tripForm.value.accommodationTypeId !== null ? this.tripForm.value.accommodationTypeId : undefined,
      transportationTypeId: this.tripForm.value.transportationTypeId !== null ? this.tripForm.value.transportationTypeId : undefined,
      countryId: this.tripForm.value.countryId !== null ? this.tripForm.value.countryId : undefined
    };

    if (this.mode === 'create') {
      this.tripService.createTrip(tripData).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.isLoading = false;
            this.tripForm.reset();
            this.dialogRef.close(true);
          } else {
            this.isLoading = false;
            this.errorMessage = response.message || 'Error creating trip';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error connecting to server';
        }
      });
    } else {
      if (!this.tripId) {
        this.errorMessage = 'Trip ID is missing';
        this.isLoading = false;
        return;
      }

      this.tripService.updateTrip(this.tripId, tripData).subscribe({
        next: (response) => {
          if (response.success) {
            this.isLoading = false;
            this.dialogRef.close(true);
          } else {
            this.isLoading = false;
            this.errorMessage = response.message || 'Error updating trip';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error connecting to server';
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

// master - MARSISCA - BEGIN 2026-01-01
  private formatDate(date: any): string {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return format(dateObj, 'yyyy-MM-dd');
  }
  // master - MARSISCA - END 2026-01-01

  getNameError(): string {
    const control = this.tripForm.get('name');
    if (control?.hasError('required')) {
      return 'Name is required';
    }
    if (control?.hasError('maxlength')) {
      return 'Name must be less than 100 characters';
    }
    return '';
  }

  getStartDateError(): string {
    const control = this.tripForm.get('startDate');
    if (control?.hasError('required')) {
      return 'Start date is required';
    }
    return '';
  }

  getEndDateError(): string {
    const control = this.tripForm.get('endDate');
    if (control?.hasError('required')) {
      return 'End date is required';
    }
    if (this.tripForm.hasError('dateRange')) {
      return 'End date must be after start date';
    }
    return '';
  }

  getRatingError(): string {
    const control = this.tripForm.get('rating');
    if (control?.hasError('min') || control?.hasError('max')) {
      return 'Rating must be between 0 and 5';
    }
    return '';
  }

  // master - MARSISCA - BEGIN 2026-01-03
  getIconUrl(icon: string | undefined): string | null {
    if (!icon) return null;
    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:')) {
      return icon;
    }
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${icon}`;
  }

  getFlagUrl(flagPath: string | undefined): string | null {
    if (!flagPath) return null;
    if (flagPath.startsWith('http://') || flagPath.startsWith('https://') || flagPath.startsWith('data:')) {
      return flagPath;
    }
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${flagPath}`;
  }

  getCurrentLangName(item: { nameSpanish: string; nameEnglish: string }): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? item.nameSpanish : item.nameEnglish;
  }
  // master - MARSISCA - END 2026-01-03
}
// master - MARSISCA - END 2026-01-01
