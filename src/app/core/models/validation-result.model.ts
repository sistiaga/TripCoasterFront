// master - MARSISCA - BEGIN 2026-01-10

/**
 * Result of photo validation (client-side or server-side)
 * Indicates whether photos are ready for upload
 */
export interface ValidationResult {
  valid: boolean;
  totalPhotos: number;
  photosWithGPS: number;
  photosWithoutGPS: number;
  photosWithDate: number;
  photosWithoutDate: number;
  missingGPSWarning: boolean;
  missingDateError: boolean;
  message?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  estimatedLocations?: string[];
  estimatedCountries?: string[];
  estimatedDuration?: number;
}

/**
 * API response for photo validation endpoint
 */
export interface ValidationApiResponse {
  success: boolean;
  message: string;
  data: ValidationResult;
}

// master - MARSISCA - END 2026-01-10
