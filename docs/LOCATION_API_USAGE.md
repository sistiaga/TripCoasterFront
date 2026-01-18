# Location API Usage Guide

## Overview

This guide explains how to add locations to trips from the frontend application. The backend automatically handles country creation if needed.

## Flow Diagram

```
Frontend                          Backend
   |                                 |
   |-- 1. Search Location --------->|
   |    (GeoDB/Google API)           |
   |<-- Location Data --------------|
   |                                 |
   |-- 2. POST /api/locations ------>|
   |                                 |-- Check if country exists
   |                                 |-- Create country if needed
   |                                 |-- Check if location exists
   |                                 |-- Create location if needed
   |<-- Location with ID ----------|
   |                                 |
   |-- 3. POST /trips/:id/locations->|
   |                                 |-- Associate location to trip
   |<-- Updated Trip ---------------|
```

## API Endpoints

### 1. Search Locations (Optional - External API)

Use GeoDB, Google Places, or any geocoding service to search for locations.

**Example with GeoDB:**
```javascript
const searchCity = async (query) => {
  const response = await fetch('/api/locations/search?query=' + query);
  const data = await response.json();
  return data.data; // Array of location results
};
```

**Response:**
```json
{
  "success": true,
  "message": "Locations found",
  "data": [
    {
      "externalId": "geodb:2510769",
      "name": "Granada",
      "country": "Spain",
      "latitude": 37.17694,
      "longitude": -3.59889,
      "countryCode": "ES"
    }
  ]
}
```

### 2. Create/Get Location

**Endpoint:** `POST /api/locations`

**Request Body:**
```json
{
  "externalId": "geodb:2510769",
  "name": "Granada",
  "country": "Spain",
  "latitude": 37.17694,
  "longitude": -3.59889,
  "countryIsoCode": "ES",
  "countryLatitude": 40.4637,
  "countryLongitude": -3.7492,
  "continent": "Europe"
}
```

**Required Fields:**
- `externalId`: Unique identifier from external API
- `name`: Location name
- `country`: Country name
- `latitude`: Location latitude
- `longitude`: Location longitude

**Optional Fields (Recommended):**
- `countryIsoCode`: ISO code for the country (e.g., "ES", "US", "FR")
- `countryLatitude`: Country center latitude (for auto-creation)
- `countryLongitude`: Country center longitude (for auto-creation)
- `continent`: Continent name (if not provided, will be inferred from countryIsoCode)

**Response:**
```json
{
  "success": true,
  "message": "Location created successfully",
  "data": {
    "id": 123,
    "externalId": "geodb:2510769",
    "name": "Granada",
    "latitude": 37.17694,
    "longitude": -3.59889,
    "countryId": 45,
    "country": {
      "id": 45,
      "name": "Spain",
      "isoCode": "ES"
    },
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  }
}
```

**Note:** If the location already exists, it returns the existing one (idempotent).

### 3. Add Location to Trip

**Endpoint:** `POST /api/trips/:tripId/locations`

**Request Body:**
```json
{
  "locationId": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location added to trip successfully",
  "data": {
    "id": 1,
    "name": "My Summer Trip",
    "startDate": "2025-06-01",
    "endDate": "2025-06-15",
    "locations": [
      {
        "id": 123,
        "name": "Granada",
        "country": {
          "name": "Spain",
          "isoCode": "ES"
        }
      }
    ]
  }
}
```

## Complete Frontend Example

### React/TypeScript Example

```typescript
interface LocationSearchResult {
  externalId: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
}

interface CreateLocationDto {
  externalId: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  countryIsoCode?: string;
  countryLatitude?: number;
  countryLongitude?: number;
  continent?: string;
}

class TripLocationService {
  private apiUrl = 'http://localhost:3000/api';

  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    const response = await fetch(`${this.apiUrl}/locations/search?query=${query}`);
    const data = await response.json();
    return data.data || [];
  }

  async createOrGetLocation(locationData: CreateLocationDto) {
    const response = await fetch(`${this.apiUrl}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create location');
    }

    return data.data;
  }

  async addLocationToTrip(tripId: number, locationId: number) {
    const response = await fetch(`${this.apiUrl}/trips/${tripId}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationId })
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to add location to trip');
    }

    return data.data;
  }

  async addCityToTrip(tripId: number, searchResult: LocationSearchResult) {
    // Step 1: Create/Get location in backend
    const location = await this.createOrGetLocation({
      externalId: searchResult.externalId,
      name: searchResult.name,
      country: searchResult.country,
      latitude: searchResult.latitude,
      longitude: searchResult.longitude,
      countryIsoCode: searchResult.countryCode,
    });

    // Step 2: Associate location to trip
    const trip = await this.addLocationToTrip(tripId, location.id);

    return trip;
  }
}

// Usage Example
const locationService = new TripLocationService();

async function handleAddCityToTrip() {
  try {
    // 1. Search for location
    const results = await locationService.searchLocations('Granada');
    const granada = results[0]; // Select Granada from results

    // 2. Add to trip (creates country and location if needed)
    const updatedTrip = await locationService.addCityToTrip(1, granada);

  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Vue.js Example

```javascript
export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedTrip: null,
    };
  },
  methods: {
    async searchLocations() {
      const response = await fetch(`/api/locations/search?query=${this.searchQuery}`);
      const data = await response.json();
      this.searchResults = data.data || [];
    },

    async addLocationToTrip(locationResult) {
      try {
        // Create/get location
        const locationResponse = await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            externalId: locationResult.externalId,
            name: locationResult.name,
            country: locationResult.country,
            latitude: locationResult.latitude,
            longitude: locationResult.longitude,
            countryIsoCode: locationResult.countryCode,
          })
        });
        const locationData = await locationResponse.json();

        if (!locationData.success) {
          throw new Error(locationData.error);
        }

        // Add to trip
        const tripResponse = await fetch(`/api/trips/${this.selectedTrip.id}/locations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locationId: locationData.data.id
          })
        });
        const tripData = await tripResponse.json();

        if (!tripData.success) {
          throw new Error(tripData.error);
        }

        this.$toast.success('Location added to trip!');
        this.selectedTrip = tripData.data;
      } catch (error) {
        this.$toast.error(error.message);
      }
    }
  }
};
```

## Backend Automatic Country Creation

When you send a location to the backend, it automatically:

1. **Checks if the country exists** by name
2. **If country doesn't exist:**
   - Creates it using provided `countryIsoCode` (or generates one from name)
   - Uses provided `countryLatitude`/`countryLongitude` (or defaults to 0,0)
   - Determines `continent` from ISO code if not provided
3. **Checks if location exists** by `externalId` + `countryId`
4. **Returns existing location or creates new one**

### Country Auto-Creation Examples

**With full country data (recommended):**
```json
{
  "name": "Granada",
  "country": "Spain",
  "countryIsoCode": "ES",
  "countryLatitude": 40.4637,
  "countryLongitude": -3.7492,
  "continent": "Europe"
}
```
→ Creates country: `{ name: "Spain", isoCode: "ES", continent: "Europe", lat: 40.4637, lon: -3.7492 }`

**With minimal data:**
```json
{
  "name": "Granada",
  "country": "Spain"
}
```
→ Creates country: `{ name: "Spain", isoCode: "SPA", continent: "Unknown", lat: 0, lon: 0 }`

**With ISO code only:**
```json
{
  "name": "Granada",
  "country": "Spain",
  "countryIsoCode": "ES"
}
```
→ Creates country: `{ name: "Spain", isoCode: "ES", continent: "Europe", lat: 0, lon: 0 }`
(Continent inferred from ISO code mapping)

## Error Handling

### Common Errors

**Location creation failed:**
```json
{
  "success": false,
  "message": "Failed to create location",
  "error": "Database constraint violation"
}
```

**Trip not found:**
```json
{
  "success": false,
  "message": "Failed to add location to trip",
  "error": "Trip not found"
}
```

**Location already associated:**
```json
{
  "success": false,
  "message": "Failed to add location to trip",
  "error": "Location is already associated with this trip"
}
```

## Best Practices

1. **Always send `countryIsoCode`** when available from your geocoding API
2. **Send country coordinates** for better map visualization
3. **Handle idempotency**: The API is idempotent - calling twice with same data won't create duplicates
4. **Cache location searches**: Store recent searches to avoid repeated API calls
5. **Validate coordinates** before sending to backend
6. **Show loading states** during multi-step operations
7. **Use TypeScript** for better type safety

## Performance Tips

1. **Batch operations**: If adding multiple locations, create them all first, then add to trip
2. **Debounce search input**: Wait for user to stop typing before searching
3. **Limit search results**: GeoDB API returns 10 results by default - this is optimal
4. **Cache country data**: Once a country is created, it's reused for all locations

## Security Considerations

- Backend validates all input using class-validator
- Coordinates are validated to be within valid ranges
- Country names and ISO codes are sanitized
- External IDs are validated to prevent injection attacks
