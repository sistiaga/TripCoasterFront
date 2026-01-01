// master - MARSISCA - BEGIN 2026-01-01
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TransportationType } from '../../../core/models/transportation-type.model';
import { TransportationTypeService } from '../../../core/services/transportation-type.service';
import { TransportationTypeFormModal } from '../transportation-type-form-modal/transportation-type-form-modal';
import { environment } from '../../../../environments/environment';
// master - MARSISCA - END 2026-01-01

@Component({
  selector: 'app-transportation-types',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './transportation-types.html',
  styleUrl: './transportation-types.scss'
})
export class TransportationTypes implements OnInit, OnDestroy {
  transportationTypes: TransportationType[] = [];
  displayedColumns: string[] = ['nameSpanish', 'nameEnglish', 'icon', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private transportationTypeService: TransportationTypeService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTransportationTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTransportationTypes(): void {
    this.transportationTypeService
      .getTransportationTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.transportationTypes = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading transportation types:', error);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TransportationTypeFormModal, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransportationTypes();
      }
    });
  }

  openEditDialog(transportationType: TransportationType): void {
    const dialogRef = this.dialog.open(TransportationTypeFormModal, {
      width: '500px',
      data: { transportationType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransportationTypes();
      }
    });
  }

  deleteTransportationType(transportationType: TransportationType): void {
    const currentLang = this.translateService.currentLang || 'en';
    const transportationTypeName = currentLang === 'es' ? transportationType.nameSpanish : transportationType.nameEnglish;

    if (confirm(`Are you sure you want to delete "${transportationTypeName}"?`)) {
      this.transportationTypeService
        .deleteTransportationType(transportationType.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadTransportationTypes();
            }
          },
          error: (error) => {
            console.error('Error deleting transportation type:', error);
          }
        });
    }
  }

  getTransportationTypeName(transportationType: TransportationType): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? transportationType.nameSpanish : transportationType.nameEnglish;
  }

  // master - MARSISCA - BEGIN 2026-01-01
  getIconUrl(icon: string | undefined): string | null {
    if (!icon) return null;

    // If it's already a full URL, return it
    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:')) {
      return icon;
    }

    // If it's a relative path, construct the full URL
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${icon}`;
  }
  // master - MARSISCA - END 2026-01-01
}
// master - MARSISCA - END 2026-01-01
