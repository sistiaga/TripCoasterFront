// master - MARSISCA - BEGIN 2026-01-01
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Diary } from '../../../core/models/diary.model';
import { DiaryType } from '../../../core/models/diary-type.model';
import { DiaryService } from '../../../core/services/diary.service';
import { DiaryTypeService } from '../../../core/services/diary-type.service';
import { AuthService } from '../../../core/services/auth.service';
import { format, addDays } from 'date-fns';

export const EUROPEAN_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
// master - MARSISCA - END 2026-01-01

export interface DiaryEntryFormModalData {
  tripId: number;
  tripStartDate?: string;
  tripEndDate?: string;
  diary?: Diary;
}

@Component({
  selector: 'app-diary-entry-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
// master - MARSISCA - BEGIN 2026-01-01
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: EUROPEAN_DATE_FORMATS },
  ],
  // master - MARSISCA - END 2026-01-01
  templateUrl: './diary-entry-form-modal.html',
  styleUrl: './diary-entry-form-modal.scss'
})
export class DiaryEntryFormModal implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode: boolean;
  diaryTypes: DiaryType[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private diaryService: DiaryService,
    private diaryTypeService: DiaryTypeService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<DiaryEntryFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: DiaryEntryFormModalData
  ) {
    this.isEditMode = !!data?.diary;

    // Set date range if provided
    if (data?.tripStartDate) {
      this.minDate = new Date(data.tripStartDate);
    }
    if (data?.tripEndDate) {
      this.maxDate = new Date(data.tripEndDate);
    }

// master - MARSISCA - BEGIN 2026-01-01
    const initialDate = this.minDate ? this.minDate : new Date();

    this.form = this.fb.group({
      date: [initialDate, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      diaryTypeId: [null]
    });
    // master - MARSISCA - END 2026-01-01
  }

  ngOnInit(): void {
    this.loadDiaryTypes();

    if (this.isEditMode && this.data.diary) {
      // Convert day string back to moment date
      const diaryDate = this.calculateDateFromDay(this.data.diary.day);

      this.form.patchValue({
        date: diaryDate,
        title: this.data.diary.title,
        description: this.data.diary.description,
        diaryTypeId: this.data.diary.diaryTypeId
      });
    }
  }

// master - MARSISCA - BEGIN 2026-01-01
  calculateDateFromDay(day: any): Date {
    // If day is already a date string (ISO format), parse it directly
    if (typeof day === 'string' && day.includes('-')) {
      return new Date(day);
    }
    // Otherwise treat as number (legacy format)
    if (this.minDate) {
      return addDays(this.minDate, day - 1);
    }
    return new Date();
  }
  // master - MARSISCA - END 2026-01-01


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDiaryTypes(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.diaryTypeService
      .getUserDiaryTypes(currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.diaryTypes = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading diary types:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

// master - MARSISCA - BEGIN 2026-01-01
    const formValue = this.form.value;

    // Convert date to ISO 8601 format (yyyy-MM-dd)
    const selectedDate = formValue.date instanceof Date ? formValue.date : new Date(formValue.date);
    const dayFormatted = format(selectedDate, 'yyyy-MM-dd');
    // master - MARSISCA - END 2026-01-01

    const dataToSend = {
      day: dayFormatted,
      title: formValue.title,
      description: formValue.description,
      diaryTypeId: formValue.diaryTypeId
    };

    if (this.isEditMode && this.data.diary) {
      this.diaryService.updateDiary(this.data.diary.id, dataToSend).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error updating diary entry:', error);
        }
      });
    } else {
      const createData = {
        ...dataToSend,
        tripId: this.data.tripId
      };

      this.diaryService.createDiary(createData).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error creating diary entry:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2026-01-01
