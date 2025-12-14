// master - MARSISCA - BEGIN 2025-12-08
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
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Diary } from '../../../core/models/diary.model';
import { DiaryType } from '../../../core/models/diary-type.model';
import { DiaryService } from '../../../core/services/diary.service';
import { DiaryTypeService } from '../../../core/services/diary-type.service';
import { AuthService } from '../../../core/services/auth.service';
import moment from 'moment';

export const EUROPEAN_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: EUROPEAN_DATE_FORMATS },
  ],
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

    const initialDate = this.minDate ? moment(this.minDate) : moment();

    this.form = this.fb.group({
      date: [initialDate, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      diaryTypeId: [null]
    });
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

  calculateDateFromDay(day: any): moment.Moment {
    // If day is already a date string (ISO format), parse it directly
    if (typeof day === 'string' && day.includes('-')) {
      return moment(day);
    }
    // Otherwise treat as number (legacy format)
    if (this.minDate) {
      return moment(this.minDate).add(day - 1, 'days');
    }
    return moment();
  }


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

    const formValue = this.form.value;

    // Convert moment date to ISO 8601 format (YYYY-MM-DD)
    let dayFormatted: string;
    if (formValue.date._isAMomentObject || (formValue.date.format && typeof formValue.date.format === 'function')) {
      dayFormatted = formValue.date.format('YYYY-MM-DD');
    } else {
      // Fallback for regular Date objects
      const selectedDate = new Date(formValue.date);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      dayFormatted = `${year}-${month}-${day}`;
    }

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
// master - MARSISCA - END 2025-12-08
