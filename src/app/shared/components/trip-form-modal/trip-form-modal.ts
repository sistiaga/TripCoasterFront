// master - MARSISCA - BEGIN 2026-01-01
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { TripDestinations } from '../trip-destinations/trip-destinations';
import { TripDiary } from '../trip-diary/trip-diary';
import { Trip, TripPhoto } from '../../../core/models/trip.model';
import { PhotoDetailModal } from '../photo-detail-modal/photo-detail-modal';
import { parse, format } from 'date-fns';

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
    StarRating,
    TripDestinations,
    TripDiary
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
  selectedFiles: File[] = [];
  photoPreviews: { file: File, url: string }[] = [];
  existingPhotos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TripFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: TripFormData
  ) {
    this.mode = data?.mode || 'create';
    this.tripId = data?.trip?.id;

    this.tripForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      rating: [null, [Validators.min(0), Validators.max(5)]]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.data?.trip) {
      this.tripStartDate = this.data.trip.startDate;
      this.tripEndDate = this.data.trip.endDate;
      this.populateForm(this.data.trip);
      this.loadExistingPhotos();
    }
  }

  private loadExistingPhotos(): void {
    if (this.tripId) {
      this.tripService.getTripPhotos(this.tripId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.existingPhotos = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading photos:', error);
        }
      });
    }
  }

// master - MARSISCA - BEGIN 2026-01-01
  private populateForm(trip: Trip): void {
    this.tripForm.patchValue({
      name: trip.name,
      description: trip.description,
      startDate: new Date(trip.startDate),
      endDate: new Date(trip.endDate),
      rating: trip.rating
    });
  }
  // master - MARSISCA - END 2026-01-01

// master - MARSISCA - BEGIN 2026-01-01
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
      userId: user.id
    };

    if (this.mode === 'create') {
      this.tripService.createTrip(tripData).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // If there are photos to upload, upload them after creating the trip
            if (this.selectedFiles.length > 0) {
              this.uploadPhotos(response.data.id);
            } else {
              this.isLoading = false;
              this.tripForm.reset();
              this.dialogRef.close(true);
            }
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
            // If there are photos to upload, upload them after updating the trip
            if (this.selectedFiles.length > 0) {
              this.uploadPhotos(this.tripId!);
            } else {
              this.isLoading = false;
              this.dialogRef.close(true);
            }
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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private addFiles(files: File[]): void {
    // Accept image files and HEIC/HEIF files
    const imageFiles = files.filter(file =>
      file.type.startsWith('image/') ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif')
    );

    imageFiles.forEach(file => {
      const isHeic = file.name.toLowerCase().endsWith('.heic') ||
                     file.name.toLowerCase().endsWith('.heif');

      if (isHeic) {
        // For HEIC files, show a generic image icon placeholder
        // The backend will convert to JPEG and extract metadata
        this.photoPreviews.push({
          file,
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SEVJQzwvdGV4dD48L3N2Zz4='
        });
      } else {
        // For regular image files, create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreviews.push({
            file,
            url: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    });

    this.selectedFiles.push(...imageFiles);
  }

  removePhoto(index: number): void {
    this.photoPreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  deleteExistingPhoto(photoId: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this photo?')) {
      this.tripService.deletePhoto(photoId).subscribe({
        next: () => {
          this.existingPhotos = this.existingPhotos.filter(p => p.id !== photoId);
        },
        error: (error) => {
          console.error('Error deleting photo:', error);
          this.errorMessage = 'Error deleting photo';
        }
      });
    }
  }

  viewPhoto(photo: TripPhoto): void {
    const dialogRef = this.dialog.open(PhotoDetailModal, {
      width: '90vw',
      maxWidth: '800px',
      data: {
        photo,
        tripId: this.tripId,
        canEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true || result === 'deleted') {
        // Reload photos after changes
        this.loadExistingPhotos();
      }
    });
  }

  private uploadPhotos(tripId: number): void {
    this.tripService.uploadPhotos(tripId, this.selectedFiles).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (this.mode === 'create') {
          this.tripForm.reset();
        }
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error uploading photos:', error);
        // Still close the dialog as the trip was created/updated successfully
        if (this.mode === 'create') {
          this.tripForm.reset();
        }
        this.dialogRef.close(true);
      }
    });
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
}
// master - MARSISCA - END 2026-01-01
