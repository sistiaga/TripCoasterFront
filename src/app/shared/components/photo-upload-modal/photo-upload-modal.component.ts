// master - MARSISCA - BEGIN 2026-01-10
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotoGridComponent } from '../photo-grid/photo-grid.component';
import { LocationPickerModalComponent } from '../location-picker-modal/location-picker-modal.component';
import { PhotoValidationService } from '../../../core/services/photo-validation.service';
import { PhotoUploadService, UploadProgress } from '../../../core/services/photo-upload.service';
import { AuthService } from '../../../core/services/auth.service';
import { PhotoValidation } from '../../../core/models/photo.model';
import { ValidationResult } from '../../../core/models/validation-result.model';
import { ManualLocation } from '../../../core/models/manual-location.model';
import { TripCreationResponse } from '../../../core/models/trip.model';

/**
 * Upload state type definition
 */
type UploadState =
  | { type: 'idle' }
  | { type: 'selecting' }
  | { type: 'validating'; progress: number }
  | { type: 'validated'; result: ValidationResult }
  | { type: 'requesting_location' }
  | { type: 'uploading'; progress: number }
  | { type: 'processing'; message: string }
  | { type: 'success'; tripId: number }
  | { type: 'error'; error: ErrorDetail };

interface ErrorDetail {
  code: string;
  message: string;
  recoverable: boolean;
}

/**
 * Photo Upload Modal Component
 * Main component for creating trips from photos
 */
@Component({
  selector: 'app-photo-upload-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PhotoGridComponent
  ],
  templateUrl: './photo-upload-modal.component.html',
  styleUrl: './photo-upload-modal.component.scss'
})
export class PhotoUploadModalComponent implements OnInit {

  // State signals
  private _uploadState = signal<UploadState>({ type: 'idle' });
  private _selectedPhotos = signal<File[]>([]);
  private _validationResults = signal<Map<string, PhotoValidation>>(new Map());
  private _manualLocation = signal<ManualLocation | null>(null);

  // Read-only computed signals
  readonly uploadState = this._uploadState.asReadonly();
  readonly selectedPhotos = this._selectedPhotos.asReadonly();
  readonly validationResults = this._validationResults.asReadonly();

  // Computed values
  readonly canUpload = computed(() => {
    const photos = this._selectedPhotos();
    const state = this._uploadState();
    return photos.length > 0 && state.type === 'validated';
  });

  readonly isUploading = computed(() => {
    const state = this._uploadState();
    return state.type === 'uploading' || state.type === 'processing';
  });

  readonly photoCount = computed(() => this._selectedPhotos().length);

  readonly uploadProgress = computed(() => {
    const state = this._uploadState();
    if (state.type === 'uploading') return state.progress;
    if (state.type === 'validating') return state.progress;
    return 0;
  });

  constructor(
    public dialogRef: MatDialogRef<PhotoUploadModalComponent>,
    private photoValidationService: PhotoValidationService,
    private photoUploadService: PhotoUploadService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setState({ type: 'idle' });
  }

  /**
   * Handle file input change
   */
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.processPhotos(files);
    }
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Handle drop event
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      this.processPhotos(files);
    }
  }

  /**
   * Process selected photos
   */
  private async processPhotos(files: File[]): Promise<void> {
    this.setState({ type: 'selecting' });
    this._selectedPhotos.set(files);

    // Validate photos
    await this.validatePhotos();
  }

  /**
   * Validate selected photos
   * master - MARSISCA - BEGIN 2026-01-10
   * Only validates format and size - backend handles metadata validation
   */
  private async validatePhotos(): Promise<void> {
    console.log('[PhotoUpload] Starting validation for', this._selectedPhotos().length, 'photos');
    this.setState({ type: 'validating', progress: 0 });

    const photos = this._selectedPhotos();
    const validationMap = new Map<string, PhotoValidation>();

    // Validate each photo (format and size only)
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      console.log('[PhotoUpload] Validating photo:', photo.name, 'size:', (photo.size / 1024 / 1024).toFixed(2), 'MB');
      const validation = await this.photoValidationService.validatePhoto(photo);
      validationMap.set(photo.name, validation);

      // Update progress
      const progress = Math.round(((i + 1) / photos.length) * 100);
      this.setState({ type: 'validating', progress });
    }

    this._validationResults.set(validationMap);

    // Get overall validation result
    const validationResult = await this.photoValidationService.validatePhotos(photos);
    console.log('[PhotoUpload] Validation result:', {
      valid: validationResult.valid,
      totalPhotos: validationResult.totalPhotos,
      photosWithGPS: validationResult.photosWithGPS,
      photosWithDate: validationResult.photosWithDate
    });

    this.setState({ type: 'validated', result: validationResult });

    // Only show error if format/size validation failed
    if (!validationResult.valid) {
      console.log('[PhotoUpload] Validation failed - invalid format or size');
      this.showError({
        code: 'INVALID_PHOTOS',
        message: 'Some photos have invalid format or exceed size limit',
        recoverable: true
      });
    } else {
      console.log('[PhotoUpload] Basic validation passed - ready to upload');
    }
  }
  // master - MARSISCA - END 2026-01-10

  /**
   * Handle photo removed from grid
   */
  onPhotoRemoved(photo: File): void {
    const photos = this._selectedPhotos();
    const filtered = photos.filter(p => p.name !== photo.name);
    this._selectedPhotos.set(filtered);

    // Re-validate if photos remain
    if (filtered.length > 0) {
      this.validatePhotos();
    } else {
      this.setState({ type: 'idle' });
      this._validationResults.set(new Map());
    }
  }

  /**
   * Start upload process
   * master - MARSISCA - BEGIN 2026-01-10
   * Send directly to backend - no GPS validation in frontend
   */
  async onUploadClicked(): Promise<void> {
    console.log('[PhotoUpload] Upload button clicked');
    const state = this._uploadState();
    if (state.type !== 'validated') {
      console.log('[PhotoUpload] Cannot upload - state is not validated:', state.type);
      return;
    }

    console.log('[PhotoUpload] Starting upload process - backend will handle metadata validation');

    // Start upload directly - backend handles all metadata validation
    await this.uploadAndCreateTrip();
  }
  // master - MARSISCA - END 2026-01-10

  /**
   * Request manual location from user
   */
  private async requestManualLocation(validationResult: ValidationResult): Promise<ManualLocation | null> {
    this.setState({ type: 'requesting_location' });

    const dialogRef = this.dialog.open(LocationPickerModalComponent, {
      width: '600px',
      disableClose: true,
      data: {
        photosWithoutGPS: validationResult.photosWithoutGPS,
        totalPhotos: validationResult.totalPhotos
      }
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      // User provided location
      const state = this._uploadState();
      if (state.type === 'validated') {
        this.setState({ type: 'validated', result: state.result });
      }
      return result;
    } else {
      // User cancelled
      const state = this._uploadState();
      if (state.type === 'validated') {
        this.setState({ type: 'validated', result: state.result });
      }
      return null;
    }
  }

  /**
   * Upload photos and create trip
   * master - MARSISCA - BEGIN 2026-01-10
   */
  private async uploadAndCreateTrip(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.log('[PhotoUpload] User not authenticated');
      this.showError({
        code: 'NOT_AUTHENTICATED',
        message: 'You must be logged in to create a trip',
        recoverable: false
      });
      return;
    }

    const photos = this._selectedPhotos();
    console.log('[PhotoUpload] Uploading', photos.length, 'photos for user', user.id);
    console.log('[PhotoUpload] Photo details:', photos.map(p => ({
      name: p.name,
      type: p.type,
      size: (p.size / 1024 / 1024).toFixed(2) + ' MB'
    })));

    this.setState({ type: 'uploading', progress: 0 });

    // Send to backend without manualLocation - backend handles all metadata
    this.photoUploadService.createTripFromPhotos(photos, user.id, undefined)
      .subscribe({
        next: (progress: UploadProgress) => {
          if (progress.type === 'uploading') {
            console.log('[PhotoUpload] Upload progress:', progress.progress + '%');
            this.setState({ type: 'uploading', progress: progress.progress });
          } else if (progress.type === 'processing') {
            console.log('[PhotoUpload] Server processing:', progress.message);
            this.setState({ type: 'processing', message: progress.message });
          } else if (progress.type === 'success') {
            console.log('[PhotoUpload] Upload successful! Trip ID:', progress.data.trip.id);
            console.log('[PhotoUpload] Stats:', progress.data.stats);
            this.handleUploadSuccess(progress.data);
          } else if (progress.type === 'error') {
            console.error('[PhotoUpload] Upload error:', progress.error);
            this.showError(progress.error);
          }
        },
        error: (error) => {
          console.error('[PhotoUpload] Network/upload error:', error);
          this.showError({
            code: 'UPLOAD_FAILED',
            message: 'Failed to upload photos. Please try again.',
            recoverable: true
          });
        }
      });
  }
  // master - MARSISCA - END 2026-01-10

  /**
   * Handle successful upload
   */
  private handleUploadSuccess(data: TripCreationResponse): void {
    this.setState({ type: 'success', tripId: data.trip.id });

    // Show success message
    this.snackBar.open(
      `Trip created successfully! ${data.stats.photosUploaded} photos uploaded.`,
      'View Trip',
      { duration: 5000 }
    ).onAction().subscribe(() => {
      this.navigateToTrip(data.trip.id);
    });

    // Close modal after delay
    setTimeout(() => {
      this.navigateToTrip(data.trip.id);
    }, 2000);
  }

  /**
   * Navigate to trip detail page
   */
  private navigateToTrip(tripId: number): void {
    this.dialogRef.close();
    this.router.navigate(['/trips', tripId]);
  }

  /**
   * Show error message
   */
  private showError(error: ErrorDetail): void {
    this.setState({ type: 'error', error });
    this.snackBar.open(error.message, 'Close', { duration: 5000 });
  }

  /**
   * Show warning message
   */
  private showWarning(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 4000 });
  }

  /**
   * Cancel and close modal
   */
  onCancelClicked(): void {
    const state = this._uploadState();
    if (state.type === 'uploading' || state.type === 'processing') {
      // Confirm cancellation
      if (confirm('Upload in progress. Are you sure you want to cancel?')) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  /**
   * Update state
   */
  private setState(newState: UploadState): void {
    this._uploadState.set(newState);
  }

  /**
   * Get state type for template
   */
  getStateType(): string {
    return this._uploadState().type;
  }

  /**
   * Check if in error state
   */
  isErrorState(): boolean {
    return this._uploadState().type === 'error';
  }

  /**
   * Get error details
   */
  getError(): ErrorDetail | null {
    const state = this._uploadState();
    return state.type === 'error' ? state.error : null;
  }

  /**
   * Retry after error
   */
  onRetryClicked(): void {
    const photos = this._selectedPhotos();
    if (photos.length > 0) {
      this.validatePhotos();
    }
  }
}
// master - MARSISCA - END 2026-01-10
