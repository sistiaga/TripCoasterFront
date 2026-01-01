// master - MARSISCA - BEGIN 2026-01-01
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Sport } from '../../../core/models/sport.model';
import { SportService } from '../../../core/services/sport.service';
import { SportFormModal } from '../sport-form-modal/sport-form-modal';
import { environment } from '../../../../environments/environment';
// master - MARSISCA - END 2026-01-01

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './sports.html',
  styleUrl: './sports.scss'
})
export class Sports implements OnInit, OnDestroy {
  sports: Sport[] = [];
  displayedColumns: string[] = ['nameSpanish', 'nameEnglish', 'icon', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private sportService: SportService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSports(): void {
    this.sportService
      .getSports()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sports = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading sports:', error);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(SportFormModal, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSports();
      }
    });
  }

  openEditDialog(sport: Sport): void {
    const dialogRef = this.dialog.open(SportFormModal, {
      width: '500px',
      data: { sport }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSports();
      }
    });
  }

  deleteSport(sport: Sport): void {
    const currentLang = this.translateService.currentLang || 'en';
    const sportName = currentLang === 'es' ? sport.nameSpanish : sport.nameEnglish;

    if (confirm(`Are you sure you want to delete "${sportName}"?`)) {
      this.sportService
        .deleteSport(sport.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadSports();
            }
          },
          error: (error) => {
            console.error('Error deleting sport:', error);
          }
        });
    }
  }

  getSportName(sport: Sport): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? sport.nameSpanish : sport.nameEnglish;
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
