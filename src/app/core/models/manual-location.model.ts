// master - MARSISCA - BEGIN 2026-01-10

/**
 * Manual location data provided by user
 * Used when photos don't have GPS coordinates
 */
export interface ManualLocation {
  countryId: number;
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Data passed to location picker modal
 */
export interface LocationPickerData {
  photosWithoutGPS: number;
  totalPhotos: number;
}

// master - MARSISCA - END 2026-01-10
