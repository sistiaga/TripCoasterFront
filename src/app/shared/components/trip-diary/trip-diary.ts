// master - MARSISCA - BEGIN 2026-01-24
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Diary } from '../../../core/models/diary.model';
import { DiaryService } from '../../../core/services/diary.service';
import { DiaryEntryFormModal } from '../diary-entry-form-modal/diary-entry-form-modal';
import { format } from 'date-fns';
// master - MARSISCA - END 2026-01-24

@Component({
  selector: 'app-trip-diary',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './trip-diary.html',
  styleUrl: './trip-diary.scss'
})
export class TripDiary implements OnInit, OnDestroy {
  @Input() tripId!: number;
  @Input() tripStartDate?: string;
  @Input() tripEndDate?: string;

  diaries: Diary[] = [];
  private destroy$ = new Subject<void>();

  // master - MARSISCA - BEGIN 2026-01-24
  constructor(
    private diaryService: DiaryService,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {}
  // master - MARSISCA - END 2026-01-24

  ngOnInit(): void {
    if (this.tripId) {
      this.loadDiaries();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // master - MARSISCA - BEGIN 2026-01-24
  loadDiaries(): void {
    this.diaryService
      .getTripDiaries(this.tripId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Sort by dateTime (ISO datetime string format)
            this.diaries = response.data.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
          }
        },
        error: (error) => {
          console.error('Error loading diaries:', error);
        }
      });
  }
  // master - MARSISCA - END 2026-01-24

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DiaryEntryFormModal, {
      width: '600px',
      data: {
        tripId: this.tripId,
        tripStartDate: this.tripStartDate,
        tripEndDate: this.tripEndDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDiaries();
      }
    });
  }

  openEditDialog(diary: Diary): void {
    const dialogRef = this.dialog.open(DiaryEntryFormModal, {
      width: '600px',
      data: {
        tripId: this.tripId,
        tripStartDate: this.tripStartDate,
        tripEndDate: this.tripEndDate,
        diary
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDiaries();
      }
    });
  }

  // master - MARSISCA - BEGIN 2026-01-24
  deleteDiary(diary: Diary): void {
    const formattedDate = this.formatDateTime(diary.dateTime);
    if (confirm(`Are you sure you want to delete entry from ${formattedDate}: "${diary.title}"?`)) {
      this.diaryService
        .deleteDiary(diary.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadDiaries();
            }
          },
          error: (error) => {
            console.error('Error deleting diary entry:', error);
          }
        });
    }
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return dateTimeString;
    }
    return format(date, 'dd/MM/yyyy HH:mm');
  }

  getWeatherName(diary: Diary): string {
    if (!diary.weatherType) {
      return '';
    }
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? diary.weatherType.nameSpanish : diary.weatherType.nameEnglish;
  }
  // master - MARSISCA - END 2026-01-24
}
