// master - MARSISCA - BEGIN 2026-01-18
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Location, UpdateLocationRequest } from '../../../core/models/location.model';
import { Country } from '../../../core/models/country.model';
import { LocationService } from '../../../core/services/location.service';
import { CountryService } from '../../../core/services/country.service';
import { environment } from '../../../../environments/environment';

export interface LocationFormModalData {
  location: Location;
}

@Component({
  selector: 'app-location-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    TranslateModule
  ],
  templateUrl: './location-form-modal.html',
  styleUrl: './location-form-modal.scss'
})
export class LocationFormModal implements OnInit {
  form: FormGroup;
  countries: Country[] = [];
  countryControl = new FormControl<string | Country>('');
  filteredCountries!: Observable<Country[]>;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private countryService: CountryService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<LocationFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: LocationFormModalData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  ngOnInit(): void {
    this.loadCountries();

    if (this.data.location) {
      this.form.patchValue({
        name: this.data.location.name,
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude
      });

      if (this.data.location.country) {
        this.countryControl.setValue(this.data.location.country);
      }
    }

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nameEnglish || '';
        return name ? this.filterCountries(name) : this.countries.slice();
      })
    );
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (response) => {
        if (response.success) {
          this.countries = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  filterCountries(name: string): Country[] {
    const filterValue = name.toLowerCase();
    return this.countries.filter(country =>
      country.nameEnglish.toLowerCase().includes(filterValue) ||
      country.nameSpanish.toLowerCase().includes(filterValue)
    );
  }

  displayCountryFn(country: Country): string {
    if (!country) return '';
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? country.nameSpanish : country.nameEnglish;
  }

  onCountrySelected(event: MatAutocompleteSelectedEvent): void {
    const country = event.option.value as Country;
    this.countryControl.setValue(country);
  }

  clearCountry(): void {
    this.countryControl.setValue('');
  }

  isCountryObject(value: string | Country | null): boolean {
    return value !== null && typeof value === 'object' && 'id' in value;
  }

  getCurrentLangName(item: { nameSpanish: string; nameEnglish: string }): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? item.nameSpanish : item.nameEnglish;
  }

  getFlagUrl(flagPath: string | undefined): string | null {
    if (!flagPath) return null;
    if (flagPath.startsWith('http://') || flagPath.startsWith('https://') || flagPath.startsWith('data:')) {
      return flagPath;
    }
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${flagPath}`;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const selectedCountry = this.countryControl.value;

    const updateData: UpdateLocationRequest = {
      name: formValue.name,
      latitude: parseFloat(formValue.latitude),
      longitude: parseFloat(formValue.longitude)
    };

    if (this.isCountryObject(selectedCountry)) {
      updateData.countryId = (selectedCountry as Country).id;
    }

    this.locationService.updateLocation(this.data.location.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        console.error('Error updating location:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2026-01-18
