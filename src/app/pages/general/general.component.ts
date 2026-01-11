// master - MARSISCA - BEGIN 2025-11-30
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// master - MARSISCA - BEGIN 2026-01-10
import { MatTooltipModule } from '@angular/material/tooltip';
// master - MARSISCA - END 2026-01-10
import { MatDialog } from '@angular/material/dialog';
import { TripFormModal } from '../../shared/components/trip-form-modal/trip-form-modal';
// master - MARSISCA - BEGIN 2026-01-10
import { PhotoUploadModalComponent } from '../../shared/components/photo-upload-modal/photo-upload-modal.component';
// master - MARSISCA - END 2026-01-10
import { AuthService } from '../../core/services/auth.service';
import { TripService } from '../../core/services/trip.service';
import { Trip } from '../../core/models/trip.model';
import { StarRating } from '../../shared/components/star-rating/star-rating';
// master - MARSISCA - BEGIN 2024-12-24
import { environment } from '../../../environments/environment';
// master - MARSISCA - END 2024-12-24

@Component({
  selector: 'app-general',
  standalone: true,
  // master - MARSISCA - BEGIN 2026-01-10
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, StarRating],
  // master - MARSISCA - END 2026-01-10
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  protected trips: Trip[] = [];
  protected isLoading = false;

  constructor(
    private authService: AuthService,
    private tripService: TripService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadUserTrips(user.id);
    }
  }

  private loadUserTrips(userId: number): void {
    this.isLoading = true;
    this.tripService.getUserTrips(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.trips = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trips:', error);
        this.isLoading = false;
      }
    });
  }

  openAddTripModal(): void {
    const dialogRef = this.dialog.open(TripFormModal, {
      width: '90vw',
      maxWidth: '700px',
      disableClose: false,
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.loadUserTrips(user.id);
        }
      }
    });
  }

  // master - MARSISCA - BEGIN 2026-01-10
  /**
   * Open photo upload modal to create trip from photos
   */
  openPhotoUploadModal(): void {
    const dialogRef = this.dialog.open(PhotoUploadModalComponent, {
      width: '90vw',
      maxWidth: '900px',
      disableClose: true,
      panelClass: 'photo-upload-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Reload trips after modal closes (trip creation is handled inside modal)
      const user = this.authService.getCurrentUser();
      if (user) {
        this.loadUserTrips(user.id);
      }
    });
  }
  // master - MARSISCA - END 2026-01-10

  viewTripDetail(trip: Trip): void {
    this.router.navigate(['/trip', trip.id]);
  }

  openEditTripModal(trip: Trip): void {
    const dialogRef = this.dialog.open(TripFormModal, {
      width: '90vw',
      maxWidth: '700px',
      disableClose: false,
      data: { mode: 'edit', trip }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.loadUserTrips(user.id);
        }
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // master - MARSISCA - BEGIN 2024-12-24
  getMainPhotoUrl(trip: Trip): string | null {
    const baseUrl = environment.apiUrl.replace('/api', '');

    if (trip.mainPhoto?.path) {
      return `${baseUrl}${trip.mainPhoto.path}`;
    }

    if (trip.photos && trip.photos.length > 0) {
      const mainPhoto = trip.photos.find(photo => photo.isMain);
      const photoToUse = mainPhoto || trip.photos[0];
      return photoToUse.path ? `${baseUrl}${photoToUse.path}` : photoToUse.url;
    }

    return null;
  }
  // master - MARSISCA - END 2024-12-24

  // master - MARSISCA - BEGIN 2026-01-09
  getMainCountry(trip: Trip): any | null {
    if (trip.countries && trip.countries.length > 0) {
      return trip.countries[0];
    }
    return null;
  }
  // master - MARSISCA - END 2026-01-09
}
// master - MARSISCA - END 2025-11-30
