// master - MARSISCA - BEGIN 2025-12-31
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Accommodation } from '../../../core/models/accommodation.model';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { AccommodationFormModal } from '../accommodation-form-modal/accommodation-form-modal';

@Component({
  selector: 'app-accommodations',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './accommodations.html',
  styleUrl: './accommodations.scss'
})
export class Accommodations implements OnInit, OnDestroy {
  accommodations: Accommodation[] = [];
  displayedColumns: string[] = ['nameSpanish', 'nameEnglish', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private accommodationService: AccommodationService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccommodations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAccommodations(): void {
    this.accommodationService
      .getAccommodations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.accommodations = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading accommodations:', error);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AccommodationFormModal, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccommodations();
      }
    });
  }

  openEditDialog(accommodation: Accommodation): void {
    const dialogRef = this.dialog.open(AccommodationFormModal, {
      width: '500px',
      data: { accommodation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccommodations();
      }
    });
  }

  deleteAccommodation(accommodation: Accommodation): void {
    const currentLang = this.translateService.currentLang || 'en';
    const accommodationName = currentLang === 'es' ? accommodation.nameSpanish : accommodation.nameEnglish;

    if (confirm(`Are you sure you want to delete "${accommodationName}"?`)) {
      this.accommodationService
        .deleteAccommodation(accommodation.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadAccommodations();
            }
          },
          error: (error) => {
            console.error('Error deleting accommodation:', error);
          }
        });
    }
  }

  getAccommodationName(accommodation: Accommodation): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? accommodation.nameSpanish : accommodation.nameEnglish;
  }
}
// master - MARSISCA - END 2025-12-31
