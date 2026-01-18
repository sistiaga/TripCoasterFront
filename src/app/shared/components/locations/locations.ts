// master - MARSISCA - BEGIN 2026-01-18
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '../../../core/models/location.model';
import { LocationService } from '../../../core/services/location.service';
import { LocationFormModal } from '../location-form-modal/location-form-modal';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './locations.html',
  styleUrl: './locations.scss'
})
export class Locations implements OnInit, OnDestroy {
  locations: Location[] = [];
  displayedColumns: string[] = ['name', 'country', 'coordinates', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLocations(): void {
    this.locationService
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.locations = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading locations:', error);
        }
      });
  }

  openEditDialog(location: Location): void {
    const dialogRef = this.dialog.open(LocationFormModal, {
      width: '500px',
      data: { location }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLocations();
      }
    });
  }

  deleteLocation(location: Location): void {
    if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
      this.locationService
        .deleteLocation(location.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadLocations();
            }
          },
          error: (error) => {
            console.error('Error deleting location:', error);
          }
        });
    }
  }

  formatCoordinates(latitude: number, longitude: number): string {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}
// master - MARSISCA - END 2026-01-18
