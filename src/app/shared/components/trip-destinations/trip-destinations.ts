// master - MARSISCA - BEGIN 2025-11-15
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { LocationService } from '../../../core/services/location.service';
import { LocationSuggestion, TripLocation } from '../../../core/models/location.model';

@Component({
  selector: 'app-trip-destinations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './trip-destinations.html',
  styleUrl: './trip-destinations.scss'
})
export class TripDestinations implements OnInit, OnDestroy {
  @Input() tripId?: number;

  searchControl = new FormControl('');
  suggestions: LocationSuggestion[] = [];
  tripLocations: TripLocation[] = [];
  selectedLocation: LocationSuggestion | null = null;

  isSearching = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadTripLocations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configure the predictive search with debounce and error handling
   */
  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        filter(query => query !== null && query.trim().length > 0),
        switchMap(query => {
          this.isSearching = true;
          this.errorMessage = '';
          return this.performSearch(query!.trim());
        })
      )
      .subscribe({
        next: (suggestions) => {
          this.suggestions = suggestions;
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.errorMessage = 'Error searching locations';
          this.suggestions = [];
          this.isSearching = false;
        }
      });
  }

  /**
   * Perform the location search
   */
  private performSearch(query: string): Observable<LocationSuggestion[]> {
    return this.locationService.search(query).pipe(
      switchMap(response => {
        console.log('Search response:', response);
        if (response.success && response.data) {
          console.log('Search data:', response.data);

          // Validate that all suggestions have required fields
          const validSuggestions = response.data.filter(suggestion => {
            const hasIdentifier = (suggestion.id !== undefined && suggestion.id !== null) ||
                                 (suggestion.externalId !== undefined && suggestion.externalId !== null);

            const isValid = suggestion &&
                           hasIdentifier &&
                           suggestion.name &&
                           suggestion.country;

            if (!isValid) {
              console.warn('Invalid suggestion found:', suggestion);
            }

            return isValid;
          });

          console.log('Valid suggestions:', validSuggestions);
          return of(validSuggestions);
        } else {
          throw new Error(response.message || 'Search failed');
        }
      }),
      catchError(error => {
        console.error('Search error:', error);
        return of([]);
      })
    );
  }

  /**
   * Load existing locations for this trip
   */
  private loadTripLocations(): void {
    if (!this.tripId) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.locationService.getTripLocations(this.tripId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.tripLocations = response.data;
            // master - MARSISCA - BEGIN 2024-12-24
            console.log('Loaded trip locations:', this.tripLocations);
            // master - MARSISCA - END 2024-12-24
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading trip locations:', error);
          this.errorMessage = 'Error loading destinations';
          this.isLoading = false;
        }
      });
  }

  /**
   * Handle location selection from autocomplete
   */
  onLocationSelected(event: any): void {
    const location: LocationSuggestion = event;
    console.log('Location selected event:', event);
    console.log('Location selected:', location);

    const hasIdentifier = (location?.id !== undefined && location?.id !== null) ||
                         (location?.externalId !== undefined && location?.externalId !== null);

    if (!location || !hasIdentifier) {
      this.errorMessage = 'Invalid location selected';
      console.error('Invalid location object:', location);
      return;
    }

    // Check if location is already added
    const locationIdentifier = location.id || location.externalId;
    const alreadyAdded = this.tripLocations.some(tl => {
      const tripLocationIdentifier = tl.location.id || tl.location.externalId;
      return tripLocationIdentifier === locationIdentifier;
    });

    if (alreadyAdded) {
      this.errorMessage = 'This location is already added to the trip';
      this.selectedLocation = null;
      this.searchControl.setValue('');
      this.suggestions = [];
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    // Store the selected location and clear suggestions
    this.selectedLocation = location;
    this.suggestions = [];
    this.errorMessage = '';
  }

  /**
   * Confirm and add the selected location to the trip
   */
  confirmAddLocation(): void {
    if (!this.selectedLocation) {
      return;
    }

    if (!this.tripId) {
      this.errorMessage = 'Cannot add location: Trip ID is missing';
      return;
    }

    this.addLocationToTrip(this.selectedLocation);
  }

  /**
   * Cancel the location selection
   */
  cancelSelection(): void {
    this.selectedLocation = null;
    this.searchControl.setValue('');
    this.suggestions = [];
    this.errorMessage = '';
  }

  /**
   * Add a location to the trip
   * Two-step process: 1) Create location in DB, 2) Associate with trip
   */
  // master - MARSISCA - BEGIN 2024-12-24
  private addLocationToTrip(location: LocationSuggestion): void {
    if (!this.tripId) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Step 1: Creating location in database', location);

    // Step 1: Create the location in the database
    this.locationService.createLocation(location)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((createResponse) => {
          console.log('Location created:', createResponse);

          if (!createResponse.success || !createResponse.data) {
            throw new Error(createResponse.message || 'Error creating location');
          }

          const createdLocationId = createResponse.data.id;
          console.log('Step 2: Associating location', createdLocationId, 'with trip', this.tripId);

          // Step 2: Associate the created location with the trip
          return this.locationService.addLocationToTrip(this.tripId!, createdLocationId);
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // master - MARSISCA - BEGIN 2024-12-24
            console.log('Location added successfully, received data:', response.data);
            // master - MARSISCA - END 2024-12-24
            this.tripLocations.push(response.data);
            this.successMessage = `${location.name} added successfully`;
            this.selectedLocation = null;
            this.searchControl.setValue('');
            this.suggestions = [];

            setTimeout(() => this.successMessage = '', 3000);
          } else {
            this.errorMessage = response.message || 'Error adding location';
          }
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error in location creation/association:', error);
          this.errorMessage = error.error?.message || 'Error adding location to trip';
          this.isSaving = false;
        }
      });
  }
  // master - MARSISCA - END 2024-12-24

  /**
   * Remove a location from the trip
   */
  removeLocation(tripLocation: TripLocation): void {
    if (!this.tripId) {
      return;
    }

    if (!confirm(`Remove ${tripLocation.location.name} from this trip?`)) {
      return;
    }

    const locationIdentifier = tripLocation.location.id || tripLocation.location.externalId;

    if (!locationIdentifier) {
      this.errorMessage = 'Cannot remove location: identifier is missing';
      return;
    }

    this.locationService.removeLocationFromTrip(this.tripId, locationIdentifier)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.tripLocations = this.tripLocations.filter(
            tl => tl.id !== tripLocation.id
          );
          this.successMessage = `${tripLocation.location.name} removed successfully`;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error removing location:', error);
          this.errorMessage = error.error?.message || 'Error removing location';
        }
      });
  }

  /**
   * Display function for autocomplete
   */
  displayLocation(location: LocationSuggestion | null): string {
    return location ? `${location.name}, ${location.country}` : '';
  }

  /**
   * Clear the search input and suggestions
   */
  clearSearch(): void {
    this.selectedLocation = null;
    this.searchControl.setValue('');
    this.suggestions = [];
    this.errorMessage = '';
  }
}
// master - MARSISCA - END 2025-11-15
