// master - MARSISCA - BEGIN 2026-01-10
import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';
import { LocationPickerData, ManualLocation } from '../../../core/models/manual-location.model';

/**
 * Location Picker Modal Component
 * Allows users to manually select a country and optionally a city
 * when photos don't have GPS coordinates
 */
@Component({
  selector: 'app-location-picker-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './location-picker-modal.component.html',
  styleUrl: './location-picker-modal.component.scss'
})
export class LocationPickerModalComponent implements OnInit {

  locationForm: FormGroup;
  countries = signal<Country[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<LocationPickerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationPickerData,
    private fb: FormBuilder,
    private countryService: CountryService
  ) {
    this.locationForm = this.fb.group({
      countryId: [null, Validators.required],
      cityName: [''],
      latitude: [null],
      longitude: [null]
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  /**
   * Load countries from API
   */
  private loadCountries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.countryService.getCountries().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Sort countries alphabetically by English name
          const sortedCountries = response.data.sort((a, b) =>
            a.nameEnglish.localeCompare(b.nameEnglish)
          );
          this.countries.set(sortedCountries);
          this.loading.set(false);
        } else {
          this.error.set('Failed to load countries');
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading countries:', err);
        this.error.set('Failed to load countries. Please try again.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Get selected country object
   */
  getSelectedCountry(): Country | null {
    const countryId = this.locationForm.get('countryId')?.value;
    if (!countryId) return null;

    return this.countries().find(c => c.id === countryId) || null;
  }

  /**
   * Handle country selection
   * Automatically populate lat/lng from country data
   */
  onCountrySelected(): void {
    const country = this.getSelectedCountry();
    if (country) {
      this.locationForm.patchValue({
        latitude: country.latitude,
        longitude: country.longitude
      });
    }
  }

  /**
   * Handle form submission
   */
  onConfirm(): void {
    if (this.locationForm.valid) {
      const formValue = this.locationForm.value;
      const manualLocation: ManualLocation = {
        countryId: formValue.countryId,
        cityName: formValue.cityName || undefined,
        latitude: formValue.latitude || undefined,
        longitude: formValue.longitude || undefined
      };

      this.dialogRef.close(manualLocation);
    }
  }

  /**
   * Handle cancel action
   */
  onCancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Retry loading countries
   */
  retryLoadCountries(): void {
    this.loadCountries();
  }

  /**
   * Check if form is valid
   */
  isFormValid(): boolean {
    return this.locationForm.valid;
  }

  /**
   * Get country display name (with flag if available)
   */
  getCountryDisplayName(country: Country): string {
    return country.nameEnglish;
  }

  /**
   * Get warning message about missing GPS
   */
  getWarningMessage(): string {
    const { photosWithoutGPS, totalPhotos } = this.data;
    if (photosWithoutGPS === totalPhotos) {
      return `All ${totalPhotos} photos are missing GPS coordinates.`;
    }
    return `${photosWithoutGPS} of ${totalPhotos} photos are missing GPS coordinates.`;
  }
}
// master - MARSISCA - END 2026-01-10
