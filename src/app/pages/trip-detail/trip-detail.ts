// master - MARSISCA - BEGIN 2025-12-08
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Trip, TripPhoto } from '../../core/models/trip.model';
import { TripService } from '../../core/services/trip.service';
import { AuthService } from '../../core/services/auth.service';
import { StarRating } from '../../shared/components/star-rating/star-rating';
import { TripDiary } from '../../shared/components/trip-diary/trip-diary';
import { TripFormModal } from '../../shared/components/trip-form-modal/trip-form-modal';
import { PhotoDetailModal } from '../../shared/components/photo-detail-modal/photo-detail-modal';

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
    TranslateModule,
    StarRating,
    TripDiary
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
    private dialog: MatDialog
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

  // master - MARSISCA - BEGIN 2025-12-28
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
  // master - MARSISCA - END 2025-12-28

  loadTripPhotos(tripId: number): void {
    this.tripService.getTripPhotos(tripId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('=== PHOTO RESPONSE ===', response);
        if (response.success && this.trip) {
          this.trip.photos = response.data;
          console.log('=== PHOTOS LOADED ===', this.trip.photos);
          if (this.trip.photos && this.trip.photos.length > 0) {
            console.log('First photo:', this.trip.photos[0]);
            console.log('First photo URL:', this.trip.photos[0].url);
            console.log('First photo metadata:', this.trip.photos[0].metadata);
          }
        }
      },
      error: (error) => {
        console.error('Error loading photos:', error);
      }
    });
  }


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
    return 'assets/default-trip-hero.jpg';
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
}
// master - MARSISCA - END 2025-12-08
