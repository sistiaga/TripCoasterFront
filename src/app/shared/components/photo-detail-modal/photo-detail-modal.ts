import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TripPhoto } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip.service';

export interface PhotoDetailModalData {
  photo: TripPhoto;
  tripId: number;
  canEdit: boolean;
}

@Component({
  selector: 'app-photo-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './photo-detail-modal.html',
  styleUrl: './photo-detail-modal.scss'
})
export class PhotoDetailModal implements OnInit {
  photoForm: FormGroup;
  isLoading = false;
  isLoadingDetails = true;
  errorMessage = '';
  photoDetails: TripPhoto | null = null;

  private wmoWeatherCodes: { [key: number]: { icon: string; labelKey: string } } = {
    0: { icon: 'wb_sunny', labelKey: 'WEATHER.CLEAR_SKY' },
    1: { icon: 'wb_sunny', labelKey: 'WEATHER.MAINLY_CLEAR' },
    2: { icon: 'cloud', labelKey: 'WEATHER.PARTLY_CLOUDY' },
    3: { icon: 'cloud', labelKey: 'WEATHER.OVERCAST' },
    45: { icon: 'foggy', labelKey: 'WEATHER.FOG' },
    48: { icon: 'foggy', labelKey: 'WEATHER.DEPOSITING_RIME_FOG' },
    51: { icon: 'grain', labelKey: 'WEATHER.LIGHT_DRIZZLE' },
    53: { icon: 'grain', labelKey: 'WEATHER.MODERATE_DRIZZLE' },
    55: { icon: 'grain', labelKey: 'WEATHER.DENSE_DRIZZLE' },
    61: { icon: 'water_drop', labelKey: 'WEATHER.SLIGHT_RAIN' },
    63: { icon: 'water_drop', labelKey: 'WEATHER.MODERATE_RAIN' },
    65: { icon: 'water_drop', labelKey: 'WEATHER.HEAVY_RAIN' },
    71: { icon: 'ac_unit', labelKey: 'WEATHER.SLIGHT_SNOW' },
    73: { icon: 'ac_unit', labelKey: 'WEATHER.MODERATE_SNOW' },
    75: { icon: 'ac_unit', labelKey: 'WEATHER.HEAVY_SNOW' },
    80: { icon: 'thunderstorm', labelKey: 'WEATHER.SLIGHT_RAIN_SHOWERS' },
    81: { icon: 'thunderstorm', labelKey: 'WEATHER.MODERATE_RAIN_SHOWERS' },
    82: { icon: 'thunderstorm', labelKey: 'WEATHER.VIOLENT_RAIN_SHOWERS' },
    95: { icon: 'thunderstorm', labelKey: 'WEATHER.THUNDERSTORM' },
    96: { icon: 'thunderstorm', labelKey: 'WEATHER.THUNDERSTORM_WITH_HAIL' },
    99: { icon: 'thunderstorm', labelKey: 'WEATHER.THUNDERSTORM_WITH_HEAVY_HAIL' }
  };

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<PhotoDetailModal>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoDetailModalData
  ) {
    this.photoForm = this.fb.group({
      isMain: [false]
    });
  }

  ngOnInit(): void {
    if (this.data.photo) {
      this.photoForm.patchValue({
        isMain: this.data.photo.isMain || false
      });
      this.loadPhotoDetails();
    }
  }

  loadPhotoDetails(): void {
    this.isLoadingDetails = true;
    this.tripService.getPhotoById(this.data.photo.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.photoDetails = response.data;
        }
        this.isLoadingDetails = false;
      },
      error: (error) => {
        console.error('Error loading photo details:', error);
        this.isLoadingDetails = false;
      }
    });
  }

  getWeatherIcon(wmoCode: number): string {
    return this.wmoWeatherCodes[wmoCode]?.icon || 'help_outline';
  }

  getWeatherDescription(wmoCode: number): string {
    const weather = this.wmoWeatherCodes[wmoCode];
    if (weather) {
      return this.translateService.instant(weather.labelKey);
    }
    return this.translateService.instant('WEATHER.UNKNOWN');
  }

  formatTemperature(temp: number): string {
    return `${temp.toFixed(1)}°C`;
  }

  formatWindSpeed(speed: number): string {
    return `${speed.toFixed(1)} km/h`;
  }

  formatPrecipitation(mm: number): string {
    return `${mm.toFixed(1)} mm`;
  }

  formatCloudCoverage(coverage: number): string {
    return `${coverage}%`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  onSave(): void {
    if (this.photoForm.invalid || !this.data.canEdit) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updateData = {
      isMain: this.photoForm.value.isMain
    };

    this.tripService.updatePhoto(this.data.photo.id, updateData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.dialogRef.close(true);
        } else {
          this.errorMessage = response.message || 'Error updating photo';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error connecting to server';
      }
    });
  }

  onDelete(): void {
    if (!this.data.canEdit) {
      return;
    }

    if (confirm('Are you sure you want to delete this photo?')) {
      this.isLoading = true;
      this.tripService.deletePhoto(this.data.photo.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close('deleted');
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error deleting photo';
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
