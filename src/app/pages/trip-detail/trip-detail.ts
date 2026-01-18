// master - MARSISCA - BEGIN 2025-12-08
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
// master - MARSISCA - BEGIN 2026-01-03
import { environment } from '../../../environments/environment';
// master - MARSISCA - END 2026-01-03
import { Trip, TripPhoto } from '../../core/models/trip.model';
import { TripService } from '../../core/services/trip.service';
import { AuthService } from '../../core/services/auth.service';
import { StarRating } from '../../shared/components/star-rating/star-rating';
import { TripDiary } from '../../shared/components/trip-diary/trip-diary';
import { TripFormModal } from '../../shared/components/trip-form-modal/trip-form-modal';
import { PhotoDetailModal } from '../../shared/components/photo-detail-modal/photo-detail-modal';
// master - MARSISCA - BEGIN 2026-01-16
import { TripMapComponent } from '../../shared/components/trip-map/trip-map.component';
// master - MARSISCA - END 2026-01-16

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    TranslateModule,
    StarRating,
    TripDiary,
    // master - MARSISCA - BEGIN 2026-01-16
    TripMapComponent
    // master - MARSISCA - END 2026-01-16
  ],
  templateUrl: './trip-detail.html',
  styleUrl: './trip-detail.scss'
})
export class TripDetail implements OnInit, OnDestroy {
  trip: Trip | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private authService: AuthService,
    private dialog: MatDialog,
    // master - MARSISCA - BEGIN 2026-01-03
    private translateService: TranslateService
    // master - MARSISCA - END 2026-01-03
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const tripId = params.get('id');
      if (tripId) {
        this.loadTripDetail(+tripId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // master - MARSISCA - BEGIN 2026-01-03
  loadTripDetail(tripId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoading = false;
      this.router.navigate(['/general']);
      return;
    }

    this.tripService.getTripById(tripId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.success) {
          this.trip = response.data;
          if (this.trip) {
            this.loadTripPhotos(tripId);
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trip:', error);
        this.isLoading = false;
      }
    });
  }
  // master - MARSISCA - END 2026-01-03

  // master - MARSISCA - BEGIN 2026-01-03
  loadTripPhotos(tripId: number): void {
    this.tripService.getTripPhotos(tripId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.success && this.trip) {
          this.trip.photos = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading photos:', error);
      }
    });
  }
  // master - MARSISCA - END 2026-01-03


  goBack(): void {
    this.router.navigate(['/general']);
  }

  editTrip(): void {
    if (!this.trip) return;

    const dialogRef = this.dialog.open(TripFormModal, {
      width: '90vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: {
        trip: this.trip,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.trip) {
        this.loadTripDetail(this.trip.id);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getHeroImage(): string {
    if (this.trip?.photos && this.trip.photos.length > 0) {
      // Try to find main photo first
      const mainPhoto = this.trip.photos.find(p => p.isMain);
      if (mainPhoto) {
        return mainPhoto.url;
      }
      // Fall back to first photo
      return this.trip.photos[0].url;
    }
//    return 'assets/default-trip-hero.jpg';
    return '';  // master - MARSISCA - 2026-01-03 - Return empty string if no photos
}

  openPhotoDetail(photo: TripPhoto): void {
    const dialogRef = this.dialog.open(PhotoDetailModal, {
      width: '90vw',
      maxWidth: '800px',
      data: {
        photo,
        tripId: this.trip?.id,
        canEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted' || result === true) {
        if (this.trip) {
          this.loadTripPhotos(this.trip.id);
        }
      }
    });
  }

  getVisiblePhotos(): any[] {
    if (!this.trip?.photos) return [];
    return this.trip.photos.slice(0, 6);
  }

  hasMorePhotos(): boolean {
    return (this.trip?.photos?.length || 0) > 6;
  }

  getMorePhotosCount(): number {
    return (this.trip?.photos?.length || 0) - 6;
  }

  // master - MARSISCA - BEGIN 2026-01-17
  getIconUrl(icon: string | undefined): string | null {
    if (!icon) return null;

    // If it's already a full URL, fix duplicated paths if present
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
      // Fix duplicated path segments (e.g., uploads/flags/uploads/flags/)
      return icon.replace(/(uploads\/flags\/)+/g, 'uploads/flags/');
    }

    if (icon.startsWith('data:')) {
      return icon;
    }

    const baseUrl = environment.apiUrl.replace('/api', '');
    // Remove leading slash to avoid double slashes in URL
    const cleanIcon = icon.startsWith('/') ? icon.substring(1) : icon;
    return `${baseUrl}/${cleanIcon}`;
  }
  // master - MARSISCA - END 2026-01-17

  getCurrentLangName(item: { nameSpanish: string; nameEnglish: string }): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? item.nameSpanish : item.nameEnglish;
  }

  // master - MARSISCA - BEGIN 2026-01-09
  getMainCountry(): any | null {
    if (this.trip?.countries && this.trip.countries.length > 0) {
      return this.trip.countries[0];
    }
    return null;
  }
  // master - MARSISCA - END 2026-01-09

  deletePhoto(photo: TripPhoto): void {
    if (confirm(this.translateService.instant('TRIP_DETAIL.CONFIRM_DELETE_PHOTO'))) {
      this.tripService.deletePhoto(photo.id).subscribe({
        next: (response) => {
          if (response.success && this.trip) {
            this.loadTripPhotos(this.trip.id);
          }
        },
        error: (error) => {
          console.error('Error deleting photo:', error);
        }
      });
    }
  }

  toggleMainPhoto(photo: TripPhoto): void {
    if (photo.isMain) return; // Already main, do nothing

    this.tripService.updatePhoto(photo.id, { isMain: true }).subscribe({
      next: (response) => {
        if (response.success && this.trip) {
          this.loadTripPhotos(this.trip.id);
        }
      },
      error: (error) => {
        console.error('Error updating photo:', error);
      }
    });
  }

  uploadNewPhotos(): void {
    // Open file input dialog
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.heic,.heif';

    input.onchange = (event: any) => {
      const files = event.target.files;
      if (files && files.length > 0 && this.trip) {
        // Convert FileList to Array
        const filesArray = Array.from(files) as File[];
        this.tripService.uploadPhotos(this.trip.id, filesArray).subscribe({
          next: (response) => {
            if (response.success && this.trip) {
              this.loadTripPhotos(this.trip.id);
            }
          },
          error: (error) => {
            console.error('Error uploading photos:', error);
          }
        });
      }
    };

    input.click();
  }
  // master - MARSISCA - END 2026-01-03
}
// master - MARSISCA - END 2025-12-08
