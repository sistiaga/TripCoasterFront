// master - MARSISCA - BEGIN 2026-01-10
import { Injectable } from '@angular/core';
import exifr from 'exifr';
import { PhotoValidation, ExifData } from '../models/photo.model';
import { ValidationResult } from '../models/validation-result.model';

/**
 * Service for client-side photo validation
 * Extracts and validates EXIF metadata from photo files
 */
@Injectable({
  providedIn: 'root'
})
export class PhotoValidationService {

  // master - MARSISCA - BEGIN 2026-01-10
  // Supported photo formats - includes multiple HEIC MIME types
  private readonly SUPPORTED_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence'
  ];
  // master - MARSISCA - END 2026-01-10

  // Maximum file size in bytes (10MB)
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  /**
   * Validate a single photo file
   * @param file - Photo file to validate
   * @returns PhotoValidation result
   */
  async validatePhoto(file: File): Promise<PhotoValidation> {
    console.log('[PhotoValidation] Validating photo:', file.name, 'type:', file.type, 'size:', file.size);
    const errors: string[] = [];
    let hasGPS = false;
    let hasDate = false;
    let metadata: ExifData | undefined;

    // Check format
    const isValidFormat = this.isValidFormat(file);
    console.log('[PhotoValidation] Format valid?', isValidFormat, 'File type:', file.type);
    if (!isValidFormat) {
      errors.push('Invalid file format. Only JPEG, PNG, and HEIC are supported.');
    }

    // Check size
    const isValidSize = this.isValidSize(file);
    console.log('[PhotoValidation] Size valid?', isValidSize, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    if (!isValidSize) {
      errors.push('File size exceeds 10MB limit.');
    }

    // master - MARSISCA - BEGIN 2026-01-10
    // Extract EXIF metadata if format is valid
    if (isValidFormat) {
      try {
        console.log('[PhotoValidation] Attempting to extract EXIF from', file.name);
        metadata = await this.extractExifData(file);
        console.log('[PhotoValidation] EXIF metadata:', metadata);

        // Check for GPS coordinates
        hasGPS = !!(metadata?.latitude && metadata?.longitude);
        console.log('[PhotoValidation] Has GPS?', hasGPS, 'Lat:', metadata?.latitude, 'Lng:', metadata?.longitude);

        // Check for date taken
        hasDate = !!(metadata?.DateTimeOriginal || metadata?.DateTimeDigitized);
        console.log('[PhotoValidation] Has Date?', hasDate, 'DateOriginal:', metadata?.DateTimeOriginal, 'DateDigitized:', metadata?.DateTimeDigitized);

        // NOTE: Date validation is temporarily disabled in frontend
        // Backend will handle date validation
        // if (!hasDate) {
        //   errors.push('Photo is missing date information.');
        // }
      } catch (error) {
        console.error('[PhotoValidation] Failed to extract EXIF:', error);
        errors.push('Failed to extract EXIF metadata.');
      }
    }

    console.log('[PhotoValidation] Final validation result:', { hasGPS, hasDate, isValidFormat, isValidSize, errors });
    // master - MARSISCA - END 2026-01-10

    return {
      file,
      hasGPS,
      hasDate,
      isValidFormat,
      isValidSize,
      metadata,
      errors
    };
  }

  /**
   * Validate multiple photos
   * @param files - Array of photo files
   * @returns ValidationResult with summary statistics
   */
  async validatePhotos(files: File[]): Promise<ValidationResult> {
    const validations = await Promise.all(
      files.map(file => this.validatePhoto(file))
    );

    const totalPhotos = files.length;
    const photosWithGPS = validations.filter(v => v.hasGPS).length;
    const photosWithoutGPS = totalPhotos - photosWithGPS;
    const photosWithDate = validations.filter(v => v.hasDate).length;
    const photosWithoutDate = totalPhotos - photosWithDate;

    const missingGPSWarning = photosWithoutGPS > 0;
    // master - MARSISCA - BEGIN 2026-01-10
    // Date validation is temporarily disabled in frontend
    const missingDateError = false; // photosWithoutDate > 0;
    // master - MARSISCA - END 2026-01-10

    // Extract date range from photos with dates
    let dateRange: { start: Date; end: Date } | undefined;
    const photoMetadataWithDates = validations
      .filter(v => v.metadata && (v.metadata.DateTimeOriginal || v.metadata.DateTimeDigitized))
      .map(v => {
        const dateStr = v.metadata!.DateTimeOriginal || v.metadata!.DateTimeDigitized;
        return this.parseExifDate(dateStr!);
      })
      .filter(date => date !== null) as Date[];

    if (photoMetadataWithDates.length > 0) {
      const sortedDates = photoMetadataWithDates.sort((a, b) => a.getTime() - b.getTime());
      dateRange = {
        start: sortedDates[0],
        end: sortedDates[sortedDates.length - 1]
      };
    }

    // master - MARSISCA - BEGIN 2026-01-10
    // Determine if valid overall - only check format and size, not date
    const valid = validations.every(v => v.isValidFormat && v.isValidSize);
    // master - MARSISCA - END 2026-01-10

    // Build message
    let message: string | undefined;
    // master - MARSISCA - BEGIN 2026-01-10
    // Date error message disabled - backend will handle date validation
    // if (missingDateError) {
    //   message = 'Some photos are missing date information. All photos must have a date taken.';
    // } else
    if (missingGPSWarning) {
    // master - MARSISCA - END 2026-01-10
      message = 'Some photos are missing GPS coordinates. You will need to provide a manual location.';
    }

    return {
      valid,
      totalPhotos,
      photosWithGPS,
      photosWithoutGPS,
      photosWithDate,
      photosWithoutDate,
      missingGPSWarning,
      missingDateError,
      message,
      dateRange
    };
  }

  /**
   * Check if file format is supported
   * master - MARSISCA - BEGIN 2026-01-10
   * Validates by MIME type AND file extension (for HEIC compatibility)
   * @param file - File to check
   * @returns true if format is supported
   */
  isValidFormat(file: File): boolean {
    const mimeType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf('.'));

    console.log('[PhotoValidation] Checking format - MIME:', mimeType, 'Extension:', extension);

    // Check by MIME type first
    if (this.SUPPORTED_FORMATS.includes(mimeType)) {
      return true;
    }

    // If MIME type is empty or unknown, check by file extension
    // This is common with HEIC files in some browsers
    const validExtensions = ['.jpg', '.jpeg', '.png', '.heic', '.heif'];
    const isValidExtension = validExtensions.includes(extension);

    console.log('[PhotoValidation] MIME type not recognized, checking extension:', extension, 'Valid?', isValidExtension);

    return isValidExtension;
  }
  // master - MARSISCA - END 2026-01-10

  /**
   * Check if file size is within limits
   * @param file - File to check
   * @returns true if size is valid
   */
  isValidSize(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  /**
   * Extract EXIF metadata from photo file
   * @param file - Photo file
   * @returns EXIF data or undefined
   */
  private async extractExifData(file: File): Promise<ExifData | undefined> {
    try {
      const exif = await exifr.parse(file);

      if (!exif) {
        return undefined;
      }

      return {
        latitude: exif.latitude,
        longitude: exif.longitude,
        DateTimeOriginal: exif.DateTimeOriginal,
        DateTimeDigitized: exif.DateTimeDigitized,
        Make: exif.Make,
        Model: exif.Model,
        ...exif
      };
    } catch (error) {
      console.error('Error extracting EXIF data:', error);
      return undefined;
    }
  }

  /**
   * Parse EXIF date string to Date object
   * EXIF dates are typically in format: "2024:06:15 09:30:00"
   * @param dateStr - EXIF date string
   * @returns Date object or null
   */
  private parseExifDate(dateStr: string | Date): Date | null {
    try {
      if (typeof dateStr !== 'string') {
        return dateStr;
      }

      // EXIF format: "YYYY:MM:DD HH:mm:ss"
      const parts = dateStr.match(/(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);

      if (parts) {
        const [, year, month, day, hour, minute, second] = parts;
        return new Date(
          parseInt(year),
          parseInt(month) - 1, // Month is 0-indexed
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        );
      }

      // Try standard date parsing as fallback
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get human-readable validation summary
   * @param validation - PhotoValidation result
   * @returns Summary string
   */
  getValidationSummary(validation: PhotoValidation): string {
    if (validation.errors.length === 0 && validation.hasGPS && validation.hasDate) {
      return 'Valid photo with GPS and date';
    }

    const issues: string[] = [];
    if (!validation.hasGPS) issues.push('No GPS');
    if (!validation.hasDate) issues.push('No date');
    if (!validation.isValidFormat) issues.push('Invalid format');
    if (!validation.isValidSize) issues.push('Too large');

    return issues.join(', ');
  }
}
// master - MARSISCA - END 2026-01-10
