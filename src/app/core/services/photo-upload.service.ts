// master - MARSISCA - BEGIN 2026-01-10
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, map } from 'rxjs';
// master - MARSISCA - BEGIN 2026-02-07
import { ApiConfiguration } from '../../api/api-configuration';
import { validatePhotos } from '../../api/fn/trips/validate-photos';
// master - MARSISCA - END 2026-02-07
import { ValidationResult, ValidationApiResponse } from '../models/validation-result.model';
import { TripCreationApiResponse, TripCreationResponse } from '../models/trip.model';
import { ManualLocation } from '../models/manual-location.model';

/**
 * Upload progress event types
 */
export type UploadProgress =
  | { type: 'uploading'; progress: number }
  | { type: 'processing'; message: string }
  | { type: 'success'; data: TripCreationResponse }
  | { type: 'error'; error: UploadError };

/**
 * Upload error details
 */
export interface UploadError {
  code: string;
  message: string;
  details?: any;
  recoverable: boolean;
}

/**
 * Service for uploading photos and creating trips
 * Handles multipart/form-data uploads with progress tracking
 */
@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {

  // master - MARSISCA - BEGIN 2026-02-07
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  validatePhotosOnServer(photos: File[]): Observable<ValidationResult> {
    return validatePhotos(this.http, this.apiConfig.rootUrl, {
      body: { photos }
    }).pipe(
      map(r => r.body?.data as unknown as ValidationResult)
    );
  }
  // master - MARSISCA - END 2026-02-07

  /**
   * Create a trip from photos with upload progress tracking
   * Uses XMLHttpRequest for native upload progress events
   * @param photos - Array of photo files
   * @param userId - ID of the user creating the trip
   * @param manualLocation - Optional manual location for photos without GPS
   * @returns Observable emitting upload progress events
   */
  // master - MARSISCA - BEGIN 2026-01-10
  createTripFromPhotos(
    photos: File[],
    userId: number,
    manualLocation?: ManualLocation
  ): Observable<UploadProgress> {

    return new Observable<UploadProgress>((observer: Observer<UploadProgress>) => {
      const formData = this.buildFormData(photos, userId, manualLocation);
      const xhr = this.createXHRWithProgress(observer);

      const url = `${this.apiConfig.rootUrl}/trips/create-from-photos`;
      xhr.open('POST', url);

      // Add authorization header if token exists
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      } else {
        console.warn('[PhotoUploadService] No auth token found');
      }

      xhr.send(formData);

      // Return cleanup function
      return () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          console.log('[PhotoUploadService] Aborting upload');
          xhr.abort();
        }
      };
    });
  }
  // master - MARSISCA - END 2026-01-10

  /**
   * Add photos to an existing trip
   * @param tripId - ID of the trip to add photos to
   * @param photos - Array of photo files
   * @returns Observable emitting upload progress events
   */
  addPhotosToTrip(
    tripId: number,
    photos: File[]
  ): Observable<UploadProgress> {
    return new Observable<UploadProgress>((observer: Observer<UploadProgress>) => {
      const formData = this.buildFormData(photos);
      const xhr = this.createXHRWithProgress(observer);

      xhr.open('POST', `${this.apiConfig.rootUrl}/trips/${tripId}/add-photos`);

      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);

      return () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          xhr.abort();
        }
      };
    });
  }

  /**
   * Build FormData for photo upload
   * @param photos - Array of photo files
   * @param userId - Optional user ID
   * @param manualLocation - Optional manual location
   * @returns FormData ready for upload
   */
  private buildFormData(
    photos: File[],
    userId?: number,
    manualLocation?: ManualLocation
  ): FormData {
    const formData = new FormData();

    // Add all photos
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    // Add user ID if provided
    if (userId !== undefined) {
      formData.append('userId', userId.toString());
    }

    // Add manual location if provided
    if (manualLocation) {
      formData.append('manualLocation', JSON.stringify(manualLocation));
    }

    return formData;
  }

  /**
   * Create XMLHttpRequest with progress tracking
   * master - MARSISCA - BEGIN 2026-01-10
   * @param observer - RxJS observer to emit progress events
   * @returns Configured XMLHttpRequest
   */
  private createXHRWithProgress(observer: Observer<UploadProgress>): XMLHttpRequest {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        observer.next({ type: 'uploading', progress });
      }
    });

    // Handle successful response
    xhr.addEventListener('load', () => {

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: TripCreationApiResponse = JSON.parse(xhr.responseText);

          if (response.success && response.data) {
            observer.next({ type: 'success', data: response.data });
            observer.complete();
          } else {
            console.error('[PhotoUploadService] Server returned success=false:', response.message);
            observer.next({
              type: 'error',
              error: {
                code: 'UNKNOWN_ERROR',
                message: response.message || 'Unknown error occurred',
                recoverable: false
              }
            });
            observer.complete();
          }
        } catch (error) {
          console.error('[PhotoUploadService] Failed to parse response:', error);
          observer.next({
            type: 'error',
            error: {
              code: 'PARSE_ERROR',
              message: 'Failed to parse server response',
              recoverable: false
            }
          });
          observer.complete();
        }
      } else {
        // Handle HTTP error status
        console.error('[PhotoUploadService] HTTP error status:', xhr.status, xhr.statusText);
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          console.error('[PhotoUploadService] Error response:', errorResponse);
          observer.next({
            type: 'error',
            error: this.parseError(errorResponse)
          });
        } catch (error) {
          console.error('[PhotoUploadService] Could not parse error response:', error);
          observer.next({
            type: 'error',
            error: {
              code: 'HTTP_ERROR',
              message: `HTTP ${xhr.status}: ${xhr.statusText}`,
              recoverable: false
            }
          });
        }
        observer.complete();
      }
    });

    // Handle network errors
    xhr.addEventListener('error', () => {
      console.error('[PhotoUploadService] Network error occurred');
      observer.next({
        type: 'error',
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection.',
          recoverable: true
        }
      });
      observer.complete();
    });
  // master - MARSISCA - END 2026-01-10

    // Handle abort
    xhr.addEventListener('abort', () => {
      observer.next({
        type: 'error',
        error: {
          code: 'ABORTED',
          message: 'Upload was cancelled',
          recoverable: true
        }
      });
      observer.complete();
    });

    return xhr;
  }

  /**
   * Parse error response from server
   * @param error - Error response
   * @returns Structured UploadError
   */
  private parseError(error: any): UploadError {
    if (error.error?.code) {
      const code = error.error.code;

      // Determine if error is recoverable based on error code
      const recoverableErrors = [
        'MISSING_GPS_COORDINATES',
        'RATE_LIMIT_EXCEEDED',
        'NETWORK_ERROR'
      ];

      return {
        code,
        message: error.error.message || error.message || 'An error occurred',
        details: error.error.details,
        recoverable: recoverableErrors.includes(code)
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error,
      recoverable: false
    };
  }

  /**
   * Get authentication token from localStorage
   * @returns Auth token or null
   */
  private getAuthToken(): string | null {
    // This assumes the token is stored in localStorage
    // Adjust based on your actual auth implementation
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.token || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if error is recoverable
   * @param error - Upload error
   * @returns true if user can retry
   */
  isRecoverableError(error: UploadError): boolean {
    return error.recoverable;
  }

  /**
   * Get user-friendly error message
   * @param error - Upload error
   * @returns Localized error message
   */
  getErrorMessage(error: UploadError): string {
    const errorMessages: Record<string, string> = {
      'MISSING_GPS_COORDINATES': 'Some photos are missing GPS data. Please provide a manual location.',
      'MISSING_DATE_METADATA': 'Photos must have date information. Please use photos taken with a camera or smartphone.',
      'INVALID_PHOTO_FORMAT': 'One or more photos have an invalid format. Only JPEG, PNG, and HEIC are supported.',
      'PHOTO_TOO_LARGE': 'One or more photos exceed the 10MB size limit.',
      'GEOCODING_FAILED': 'Failed to identify location from GPS coordinates. Please try again.',
      'WEATHER_API_FAILED': 'Unable to fetch weather data. Trip will be created without weather information.',
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment and try again.',
      'NETWORK_ERROR': 'Network error. Please check your connection and try again.',
      'ABORTED': 'Upload was cancelled.',
    };

    return errorMessages[error.code] || error.message;
  }
}
// master - MARSISCA - END 2026-01-10
