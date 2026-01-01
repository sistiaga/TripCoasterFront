// master - MARSISCA - BEGIN 2026-01-01
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Diary } from '../../../core/models/diary.model';
import { DiaryService } from '../../../core/services/diary.service';
import { DiaryEntryFormModal } from '../diary-entry-form-modal/diary-entry-form-modal';
import { format } from 'date-fns';
// master - MARSISCA - END 2026-01-01

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

  constructor(
    private diaryService: DiaryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.tripId) {
      this.loadDiaries();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDiaries(): void {
    this.diaryService
      .getTripDiaries(this.tripId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Sort by day (ISO date string format)
            this.diaries = response.data.sort((a, b) => a.day.localeCompare(b.day));
          }
        },
        error: (error) => {
          console.error('Error loading diaries:', error);
        }
      });
  }

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

  deleteDiary(diary: Diary): void {
    const formattedDate = this.formatDate(diary.day);
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

// master - MARSISCA - BEGIN 2026-01-01
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return format(date, 'dd/MM/yyyy');
  }
  // master - MARSISCA - END 2026-01-01
}
// master - MARSISCA - END 2026-01-01
