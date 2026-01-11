// master - MARSISCA - BEGIN 2026-01-10

/**
 * Extended photo model with full EXIF metadata support
 * Used for photo-based trip creation feature
 */
export interface Photo {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // bytes
  path: string; // URL path to photo
  caption: string | null;
  latitude: number | null;
  longitude: number | null;
  dateTaken: string | null; // ISO 8601 datetime (local time from EXIF)
  dateTakenUTC: string | null; // ISO 8601 datetime (UTC)
  timezone: string | null; // e.g., "Europe/Rome"
  cameraModel: string | null;
  cameraMake: string | null;
  metadata: string | null; // JSON string with additional EXIF
  isMain: boolean;
  tripId: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Photo validation result for a single photo
 * Used by PhotoValidationService
 */
export interface PhotoValidation {
  file: File;
  hasGPS: boolean;
  hasDate: boolean;
  isValidFormat: boolean;
  isValidSize: boolean;
  metadata?: ExifData;
  errors: string[];
}

/**
 * EXIF metadata extracted from photo
 */
export interface ExifData {
  latitude?: number;
  longitude?: number;
  DateTimeOriginal?: string;
  DateTimeDigitized?: string;
  Make?: string;
  Model?: string;
  [key: string]: any;
}

/**
 * Photo file with preview URL
 * Used for UI display
 */
export interface PhotoWithPreview {
  file: File;
  previewUrl: string;
  validation?: PhotoValidation;
}

// master - MARSISCA - END 2026-01-10
