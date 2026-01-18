// master - MARSISCA - BEGIN 2026-01-18
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { POI } from '../../../core/models/poi.model';
import { POIService } from '../../../core/services/poi.service';
import { POIFormModal } from '../poi-form-modal/poi-form-modal';

@Component({
  selector: 'app-pois',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './pois.html',
  styleUrl: './pois.scss'
})
export class POIs implements OnInit, OnDestroy {
  pois: POI[] = [];
  displayedColumns: string[] = ['nameSpanish', 'nameEnglish', 'category', 'coordinates', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private poiService: POIService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPOIs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPOIs(): void {
    this.poiService
      .getPOIs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.pois = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading POIs:', error);
        }
      });
  }

  openEditDialog(poi: POI): void {
    const dialogRef = this.dialog.open(POIFormModal, {
      width: '500px',
      data: { poi }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPOIs();
      }
    });
  }

  deletePOI(poi: POI): void {
    if (confirm(`Are you sure you want to delete "${poi.nameSpanish}"?`)) {
      this.poiService
        .deletePOI(poi.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadPOIs();
            }
          },
          error: (error) => {
            console.error('Error deleting POI:', error);
          }
        });
    }
  }

  formatCoordinates(latitude: number, longitude: number): string {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}
// master - MARSISCA - END 2026-01-18
