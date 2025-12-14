// master - MARSISCA - BEGIN 2025-11-30
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TripFormModal } from '../../shared/components/trip-form-modal/trip-form-modal';
import { AuthService } from '../../core/services/auth.service';
import { TripService } from '../../core/services/trip.service';
import { Trip } from '../../core/models/trip.model';
import { StarRating } from '../../shared/components/star-rating/star-rating';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, StarRating],
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
}
// master - MARSISCA - END 2025-11-30
