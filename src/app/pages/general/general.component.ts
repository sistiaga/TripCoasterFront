// master - MARSISCA - BEGIN 2025-10-18
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddTripModal } from '../../shared/components/add-trip-modal/add-trip-modal';
import { AuthService } from '../../core/services/auth.service';
import { TripService } from '../../core/services/trip.service';
import { Trip } from '../../core/models/trip.model';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  protected trips: Trip[] = [];
  protected isLoading = false;

  constructor(
    private authService: AuthService,
    private tripService: TripService,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(AddTripModal, {
      width: '600px',
      disableClose: false
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
// master - MARSISCA - END 2025-10-18
