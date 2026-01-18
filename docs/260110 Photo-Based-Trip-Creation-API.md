# Photo-Based Trip Creation - Frontend API Documentation

## Overview

This document describes the API endpoints and integration guide for the frontend to implement the photo-based trip creation feature. Users can upload photos, and the system will automatically create a complete trip with diary entries, locations, weather data, and intelligent organization.

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Data Models](#3-data-models)
4. [Integration Flow](#4-integration-flow)
5. [Error Handling](#5-error-handling)
6. [Photo Requirements](#6-photo-requirements)
7. [Best Practices](#7-best-practices)

---

## 1. Feature Overview

### What This Feature Does

Users can create a complete trip by simply uploading photos. The backend will:

1. **Extract metadata** from photos (date, location, camera info)
2. **Validate** that photos have sufficient information
3. **Reverse geocode** GPS coordinates to get countries, cities, and locations
4. **Fetch historical weather** for each location and date
5. **Create trip automatically** with:
   - Intelligent trip title (e.g., "Trip to Rome" or "Trip to Italy")
   - Start/end dates from oldest/newest photos
   - Diary entries grouped by day and location
   - All photos organized and linked to appropriate diary entries
   - Weather conditions for the trip and each diary entry
   - Associated countries and locations

### User Experience Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. User selects photos from device                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. (Optional) Validate photos before upload                │
│     → Check if photos have GPS and dates                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Upload photos to create trip                            │
│     → Backend processes photos                              │
│     → Extracts metadata                                     │
│     → Calls external APIs                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4a. SUCCESS: Trip created                                  │
│      → Display trip with all data                           │
│      → Show summary stats                                   │
│                                                             │
│  4b. ERROR: Missing GPS                                     │
│      → Prompt user to provide manual location               │
│      → Retry upload with location data                      │
│                                                             │
│  4c. ERROR: Missing dates                                   │
│      → Cannot create trip                                   │
│      → Explain issue to user                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. API Endpoints

### 2.1 Validate Photos (Optional Pre-Check)

**Purpose**: Check if uploaded photos have sufficient metadata before creating the trip. This gives users immediate feedback.

**Endpoint**: `POST /api/trips/validate-photos`

**Method**: `POST`

**Authentication**: Required (Bearer token)

**Content-Type**: `multipart/form-data`

#### Request

```typescript
// FormData structure
const formData = new FormData();

// Add multiple photos
photos.forEach(photo => {
  formData.append('photos', photo);
});
```

#### Response - Success (200 OK)

```json
{
  "success": true,
  "message": "Photos validated successfully",
  "data": {
    "valid": true,
    "totalPhotos": 24,
    "photosWithGPS": 24,
    "photosWithoutGPS": 0,
    "photosWithDate": 24,
    "photosWithoutDate": 0,
    "dateRange": {
      "start": "2024-06-15T08:30:00.000Z",
      "end": "2024-06-18T20:15:00.000Z"
    },
    "estimatedLocations": ["Rome", "Vatican City", "Florence"],
    "estimatedCountries": ["Italy"],
    "estimatedDuration": 4
  }
}
```

#### Response - Missing GPS (200 OK - but invalid)

```json
{
  "success": true,
  "message": "Photos validated - missing GPS data",
  "data": {
    "valid": false,
    "totalPhotos": 24,
    "photosWithGPS": 10,
    "photosWithoutGPS": 14,
    "photosWithDate": 24,
    "photosWithoutDate": 0,
    "missingGPSWarning": true,
    "message": "Some photos are missing GPS coordinates. You'll need to provide a location manually."
  }
}
```

#### Response - Missing Dates (200 OK - but invalid)

```json
{
  "success": true,
  "message": "Photos validated - missing date information",
  "data": {
    "valid": false,
    "totalPhotos": 24,
    "photosWithDate": 18,
    "photosWithoutDate": 6,
    "missingDateError": true,
    "message": "All photos must have date taken information in their metadata."
  }
}
```

#### Frontend Usage Example

```typescript
async function validatePhotos(photos: File[]): Promise<ValidationResult> {
  const formData = new FormData();

  photos.forEach(photo => {
    formData.append('photos', photo);
  });

  const response = await fetch('/api/trips/validate-photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  const result = await response.json();
  return result.data;
}

// Usage
const photos = await selectPhotos();
const validation = await validatePhotos(photos);

if (!validation.valid) {
  if (validation.missingGPSWarning) {
    // Show UI to let user provide manual location
    const manualLocation = await promptForLocation();
  } else if (validation.missingDateError) {
    // Show error - cannot proceed
    showError("Photos must have date information");
    return;
  }
}
```

---

### 2.2 Create Trip from Photos

**Purpose**: Upload photos and create a complete trip automatically.

**Endpoint**: `POST /api/trips/create-from-photos`

**Method**: `POST`

**Authentication**: Required (Bearer token)

**Content-Type**: `multipart/form-data`

#### Request

```typescript
// FormData structure
const formData = new FormData();

// Add photos
photos.forEach(photo => {
  formData.append('photos', photo);
});

// Add userId
formData.append('userId', userId.toString());

// Optional: Add manual location if photos don't have GPS
if (manualLocation) {
  formData.append('manualLocation', JSON.stringify({
    countryId: 45,
    cityName: "Rome",
    latitude: 41.9028,
    longitude: 12.4964
  }));
}
```

#### Response - Success (200 OK)

```json
{
  "success": true,
  "message": "Trip created successfully from photos",
  "data": {
    "trip": {
      "id": 123,
      "name": "Trip to Rome",
      "description": null,
      "startDate": "2024-06-15T00:00:00.000Z",
      "endDate": "2024-06-18T00:00:00.000Z",
      "rating": null,
      "userId": 1,
      "mainCountryId": 45,
      "weatherId": 2,
      "createdAt": "2024-06-20T10:30:00.000Z",
      "updatedAt": "2024-06-20T10:30:00.000Z",
      "mainCountry": {
        "id": 45,
        "nameEnglish": "Italy",
        "nameSpanish": "Italia",
        "isoCode": "IT",
        "flagPath": "/flags/it.svg"
      },
      "countries": [
        {
          "id": 45,
          "nameEnglish": "Italy",
          "nameSpanish": "Italia",
          "isoCode": "IT",
          "continent": "Europe",
          "flagPath": "/flags/it.svg"
        }
      ],
      "locations": [
        {
          "id": 201,
          "name": "Rome",
          "latitude": 41.9028,
          "longitude": 12.4964,
          "countryId": 45,
          "country": {
            "id": 45,
            "nameEnglish": "Italy"
          }
        },
        {
          "id": 202,
          "name": "Vatican City",
          "latitude": 41.9029,
          "longitude": 12.4534,
          "countryId": 45
        }
      ],
      "weather": {
        "id": 2,
        "nameEnglish": "Sunny",
        "nameSpanish": "Soleado",
        "icon": "/icons/weather/sunny.svg"
      },
      "diaries": [
        {
          "id": 501,
          "day": "2024-06-15T09:30:00.000Z",
          "title": "Day in Rome",
          "description": null,
          "tripId": 123,
          "diaryTypeId": null,
          "diaryWeatherId": 1001,
          "diaryWeather": {
            "id": 1001,
            "date": "2024-06-15",
            "temperatureMin": 18.5,
            "temperatureMax": 28.3,
            "precipitationMm": 0,
            "windSpeed": 12.5,
            "cloudCoverage": 20,
            "weatherCode": 1,
            "source": "open-meteo",
            "latitude": 41.9028,
            "longitude": 12.4964
          },
          "locations": [
            {
              "id": 201,
              "name": "Rome"
            }
          ],
          "photos": [
            {
              "id": 1,
              "filename": "photo_001.jpg",
              "path": "/uploads/trips/123/photo_001.jpg",
              "dateTaken": "2024-06-15T09:30:00.000Z",
              "dateTakenUTC": "2024-06-15T07:30:00.000Z",
              "latitude": 41.9028,
              "longitude": 12.4964
            }
          ]
        },
        {
          "id": 502,
          "day": "2024-06-15T14:00:00.000Z",
          "title": "Day in Vatican City",
          "description": null,
          "tripId": 123,
          "diaryWeatherId": 1001,
          "locations": [
            {
              "id": 202,
              "name": "Vatican City"
            }
          ],
          "photos": [...]
        }
      ],
      "photos": [
        {
          "id": 1,
          "filename": "photo_001.jpg",
          "originalName": "IMG_1234.jpg",
          "mimeType": "image/jpeg",
          "size": 2048576,
          "path": "/uploads/trips/123/photo_001.jpg",
          "caption": null,
          "latitude": 41.9028,
          "longitude": 12.4964,
          "dateTaken": "2024-06-15T09:30:00.000Z",
          "dateTakenUTC": "2024-06-15T07:30:00.000Z",
          "timezone": "Europe/Rome",
          "cameraModel": "iPhone 13 Pro",
          "cameraMake": "Apple",
          "isMain": true,
          "tripId": 123
        }
      ]
    },
    "stats": {
      "photosProcessed": 24,
      "photosUploaded": 24,
      "photosFailed": 0,
      "diariesCreated": 4,
      "locationsFound": 3,
      "countriesVisited": 1,
      "daysOfTravel": 4
    },
    "warnings": []
  }
}
```

#### Response - Missing GPS Coordinates (400 Bad Request)

```json
{
  "success": false,
  "message": "Photos missing GPS coordinates",
  "error": {
    "code": "MISSING_GPS_COORDINATES",
    "message": "Please provide manual location or upload photos with GPS metadata",
    "details": {
      "photosWithoutGPS": 15,
      "totalPhotos": 20,
      "missingPercentage": 75
    }
  }
}
```

#### Response - Missing Date Metadata (400 Bad Request)

```json
{
  "success": false,
  "message": "Photos missing date taken metadata",
  "error": {
    "code": "MISSING_DATE_METADATA",
    "message": "All photos must have date taken information in EXIF metadata",
    "details": {
      "photosWithoutDate": 5,
      "totalPhotos": 20
    }
  }
}
```

#### Frontend Usage Example

```typescript
interface ManualLocation {
  countryId: number;
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

async function createTripFromPhotos(
  photos: File[],
  userId: number,
  manualLocation?: ManualLocation
): Promise<Trip> {
  const formData = new FormData();

  photos.forEach(photo => {
    formData.append('photos', photo);
  });

  formData.append('userId', userId.toString());

  if (manualLocation) {
    formData.append('manualLocation', JSON.stringify(manualLocation));
  }

  const response = await fetch('/api/trips/create-from-photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.data.trip;
}

// Usage
try {
  const photos = await selectPhotos();

  // Optional: validate first
  const validation = await validatePhotos(photos);

  let manualLocation;
  if (!validation.valid && validation.missingGPSWarning) {
    manualLocation = await promptUserForLocation();
  }

  // Create trip
  const trip = await createTripFromPhotos(photos, currentUserId, manualLocation);

  // Navigate to trip view
  navigateToTrip(trip.id);

} catch (error) {
  showError(error.message);
}
```

---

### 2.3 Add Photos to Existing Trip

**Purpose**: Extend an existing trip by adding more photos. The system will create additional diary entries and update trip dates if necessary.

**Endpoint**: `POST /api/trips/:tripId/add-photos`

**Method**: `POST`

**Authentication**: Required (Bearer token)

**Content-Type**: `multipart/form-data`

#### Request

```typescript
// URL parameter
const tripId = 123;

// FormData
const formData = new FormData();
photos.forEach(photo => {
  formData.append('photos', photo);
});
```

#### Response - Success (200 OK)

```json
{
  "success": true,
  "message": "Photos added to trip successfully",
  "data": {
    "trip": {
      "id": 123,
      "name": "Trip to Rome",
      "startDate": "2024-06-14T00:00:00.000Z",
      "endDate": "2024-06-18T00:00:00.000Z",
      ...
    },
    "stats": {
      "photosAdded": 8,
      "newDiariesCreated": 1,
      "newLocationsAdded": 1,
      "tripDatesAdjusted": true,
      "startDateChanged": true,
      "endDateChanged": false
    },
    "warnings": [
      "Trip start date adjusted from 2024-06-15 to 2024-06-14 based on new photos"
    ]
  }
}
```

#### Frontend Usage Example

```typescript
async function addPhotosToTrip(tripId: number, photos: File[]): Promise<Trip> {
  const formData = new FormData();

  photos.forEach(photo => {
    formData.append('photos', photo);
  });

  const response = await fetch(`/api/trips/${tripId}/add-photos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  const result = await response.json();
  return result.data.trip;
}
```

---

## 3. Data Models

### 3.1 Trip

```typescript
interface Trip {
  id: number;
  name: string;
  description: string | null;
  startDate: string; // ISO 8601 date string
  endDate: string;   // ISO 8601 date string
  rating: number | null; // 0-10
  userId: number;
  mainCountryId: number | null;
  weatherId: number | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  mainCountry?: Country;
  countries?: Country[];
  locations?: Location[];
  weather?: Weather;
  diaries?: Diary[];
  photos?: Photo[];
}
```

### 3.2 Diary

```typescript
interface Diary {
  id: number;
  day: string; // ISO 8601 datetime string (includes time now!)
  title: string;
  description: string | null;
  tripId: number;
  diaryTypeId: number | null;
  diaryWeatherId: number | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  trip?: Trip;
  diaryType?: DiaryType;
  diaryWeather?: DiaryWeather;
  locations?: Location[];
  photos?: Photo[];
}
```

### 3.3 Photo

```typescript
interface Photo {
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

  // Relations
  trip?: Trip;
  diaries?: Diary[];
}
```

### 3.4 DiaryWeather (Historical Weather Data)

```typescript
interface DiaryWeather {
  id: number;
  date: string; // ISO 8601 date
  temperatureMin: number | null; // Celsius
  temperatureMax: number | null; // Celsius
  precipitationMm: number | null; // Millimeters
  windSpeed: number | null; // km/h
  cloudCoverage: number | null; // 0-100%
  weatherCode: number | null; // WMO weather code
  source: string; // "open-meteo"
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  diaries?: Diary[];
}
```

### 3.5 Location

```typescript
interface Location {
  id: number;
  externalId: string;
  name: string;
  latitude: number;
  longitude: number;
  countryId: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  country?: Country;
  trips?: Trip[];
  diaries?: Diary[];
}
```

### 3.6 Country

```typescript
interface Country {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  isoCode: string; // ISO 3166-1 alpha-2 (e.g., "IT", "ES")
  latitude: number;
  longitude: number;
  continent: string;
  flagPath: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  trips?: Trip[];
}
```

### 3.7 Weather (General Weather Type)

```typescript
interface Weather {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  trips?: Trip[];
  diaries?: Diary[];
}
```

---

## 4. Integration Flow

### 4.1 Complete User Flow with UI States

```typescript
// State management example
type UploadState =
  | { type: 'idle' }
  | { type: 'selecting_photos' }
  | { type: 'validating', progress: number }
  | { type: 'validation_complete', result: ValidationResult }
  | { type: 'requesting_location' }
  | { type: 'uploading', progress: number }
  | { type: 'processing', message: string }
  | { type: 'success', trip: Trip }
  | { type: 'error', error: Error };

// Implementation
async function handlePhotoUpload() {
  try {
    // 1. Select photos
    setState({ type: 'selecting_photos' });
    const photos = await selectPhotosFromDevice();

    if (photos.length === 0) {
      setState({ type: 'idle' });
      return;
    }

    // 2. Validate photos
    setState({ type: 'validating', progress: 0 });
    const validation = await validatePhotos(photos);
    setState({ type: 'validation_complete', result: validation });

    // 3. Handle validation results
    let manualLocation = undefined;

    if (!validation.valid) {
      if (validation.missingDateError) {
        // Cannot proceed
        setState({
          type: 'error',
          error: new Error('Photos must have date information')
        });
        return;
      }

      if (validation.missingGPSWarning) {
        // Request manual location
        setState({ type: 'requesting_location' });
        manualLocation = await showLocationPicker();

        if (!manualLocation) {
          // User cancelled
          setState({ type: 'idle' });
          return;
        }
      }
    }

    // 4. Upload and create trip
    setState({ type: 'uploading', progress: 0 });

    const trip = await createTripFromPhotos(
      photos,
      currentUserId,
      manualLocation
    );

    // 5. Success
    setState({ type: 'success', trip });

    // Navigate to trip
    router.push(`/trips/${trip.id}`);

  } catch (error) {
    setState({ type: 'error', error });
  }
}
```

### 4.2 Progress Tracking

For large photo uploads, implement progress tracking:

```typescript
async function uploadPhotosWithProgress(
  photos: File[],
  userId: number,
  onProgress: (progress: number) => void
): Promise<Trip> {
  const formData = new FormData();

  photos.forEach(photo => {
    formData.append('photos', photo);
  });
  formData.append('userId', userId.toString());

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        resolve(result.data.trip);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));

    xhr.open('POST', '/api/trips/create-from-photos');
    xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    xhr.send(formData);
  });
}
```

---

## 5. Error Handling

### 5.1 Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `MISSING_GPS_COORDINATES` | Some/all photos lack GPS data | Prompt for manual location |
| `MISSING_DATE_METADATA` | Some/all photos lack date taken | Show error, cannot proceed |
| `INVALID_PHOTO_FORMAT` | Unsupported photo format | Filter invalid photos |
| `PHOTO_TOO_LARGE` | Photo exceeds size limit | Compress or skip photo |
| `GEOCODING_FAILED` | Reverse geocoding API failed | Retry or use manual location |
| `WEATHER_API_FAILED` | Weather API unavailable | Create trip without weather |
| `RATE_LIMIT_EXCEEDED` | Too many API requests | Wait and retry |

### 5.2 Error Handling Examples

```typescript
async function handleTripCreation(photos: File[]) {
  try {
    const trip = await createTripFromPhotos(photos, userId);
    return trip;
  } catch (error) {
    if (error.code === 'MISSING_GPS_COORDINATES') {
      // Show location picker
      const location = await showLocationPicker();
      return await createTripFromPhotos(photos, userId, location);
    }

    if (error.code === 'MISSING_DATE_METADATA') {
      showError(
        'Cannot create trip',
        'Your photos must have date information. Please use photos taken with a camera or smartphone.'
      );
      return null;
    }

    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      showWarning(
        'Please wait',
        'Too many requests. Please try again in a few moments.'
      );
      return null;
    }

    // Generic error
    showError('Trip creation failed', error.message);
    return null;
  }
}
```

---

## 6. Photo Requirements

### 6.1 Supported Formats

- **JPEG** (.jpg, .jpeg) - Recommended
- **PNG** (.png)
- **HEIC** (.heic) - iPhone format

### 6.2 Size Limits

- **Max file size**: 10 MB per photo
- **Max upload**: 100 photos per request
- **Recommended**: Compress photos before upload for faster processing

### 6.3 Required Metadata

**Minimum (REQUIRED)**:
- Date Taken (EXIF DateTimeOriginal or DateTimeDigitized)

**Recommended**:
- GPS Coordinates (EXIF GPSLatitude, GPSLongitude)
- Camera Information (Make, Model)

### 6.4 Checking Photo Metadata (Frontend)

```typescript
// Example using exifr library (client-side)
import exifr from 'exifr';

async function checkPhotoMetadata(file: File): Promise<{
  hasDate: boolean;
  hasGPS: boolean;
  metadata: any;
}> {
  const exif = await exifr.parse(file);

  return {
    hasDate: !!(exif?.DateTimeOriginal || exif?.DateTimeDigitized),
    hasGPS: !!(exif?.latitude && exif?.longitude),
    metadata: exif
  };
}

// Usage
const photo = selectedFiles[0];
const info = await checkPhotoMetadata(photo);

if (!info.hasDate) {
  alert('This photo does not have date information');
}

if (!info.hasGPS) {
  alert('This photo does not have GPS location');
}
```

---

## 7. Best Practices

### 7.1 User Experience

1. **Show preview before upload**: Let users see selected photos
2. **Validate early**: Use validation endpoint before upload
3. **Show progress**: Display upload and processing progress
4. **Handle errors gracefully**: Provide clear feedback and recovery options
5. **Batch uploads**: For many photos, consider batching uploads
6. **Photo compression**: Compress large photos on client side

### 7.2 Performance

1. **Lazy loading**: Load photos progressively in trip view
2. **Thumbnails**: Request thumbnail versions for list views
3. **Caching**: Cache trip data and photos locally
4. **Optimistic updates**: Show trip immediately, sync in background

### 7.3 UI Recommendations

**Photo Selection Screen**:
```
┌─────────────────────────────────────────┐
│  Create Trip from Photos                │
├─────────────────────────────────────────┤
│                                         │
│  [Photo Grid]                           │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│  │   │ │   │ │   │ │   │              │
│  └───┘ └───┘ └───┘ └───┘              │
│                                         │
│  24 photos selected                     │
│  📍 22 with GPS • 📅 24 with dates     │
│                                         │
│  ⚠️  2 photos missing GPS               │
│     We'll ask for location              │
│                                         │
│  [Cancel]  [Create Trip →]              │
└─────────────────────────────────────────┘
```

**Processing Screen**:
```
┌─────────────────────────────────────────┐
│  Creating Your Trip...                  │
├─────────────────────────────────────────┤
│                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  60%              │
│                                         │
│  ✓ Photos uploaded                      │
│  ✓ Dates extracted                      │
│  ⟳ Finding locations...                 │
│  ⋯ Getting weather data                 │
│  ⋯ Creating diary entries               │
│                                         │
└─────────────────────────────────────────┘
```

**Location Picker (for missing GPS)**:
```
┌─────────────────────────────────────────┐
│  Where were these photos taken?         │
├─────────────────────────────────────────┤
│                                         │
│  2 photos don't have location data      │
│  Please tell us where they were taken   │
│                                         │
│  Country: [Italy        ▼]              │
│  City:    [Rome             ]           │
│                                         │
│  Or click on map:                       │
│  ┌───────────────────────────┐         │
│  │        🗺️ Map               │         │
│  │          📍                 │         │
│  └───────────────────────────┘         │
│                                         │
│  [Cancel]  [Confirm Location]           │
└─────────────────────────────────────────┘
```

### 7.4 Sample React Component

```tsx
import React, { useState } from 'react';

function CreateTripFromPhotos() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      // Validate
      const validation = await validatePhotos(photos);

      if (!validation.valid) {
        // Handle validation errors
        return;
      }

      // Create trip
      const trip = await uploadPhotosWithProgress(
        photos,
        currentUserId,
        setProgress
      );

      // Navigate to trip
      router.push(`/trips/${trip.id}`);

    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Create Trip from Photos</h1>

      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/heic"
        onChange={handleFileSelect}
      />

      {photos.length > 0 && (
        <div>
          <p>{photos.length} photos selected</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? `Uploading ${progress}%` : 'Create Trip'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 8. Summary

### Key Points

1. **Two-step process**: Validate first (optional), then upload
2. **Flexible location handling**: Works with or without GPS data
3. **Automatic organization**: Backend handles all the heavy lifting
4. **Rich data**: Get complete trip with diaries, weather, locations
5. **Error recovery**: Clear feedback and manual override options

### Supported Scenarios

✅ Photos with GPS and dates → Fully automatic
✅ Photos with dates but no GPS → Manual location required
❌ Photos without dates → Cannot create trip

### Next Steps for Frontend

1. Implement photo selection UI
2. Add validation step with user feedback
3. Create location picker for missing GPS
4. Show upload progress
5. Display created trip with all data
6. Handle errors gracefully

---

**Document Version**: 1.0
**Last Updated**: 2026-01-10
**Author**: MARSISCA
**Status**: Ready for Implementation
