// master - MARSISCA - BEGIN 2026-01-24
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Diary } from '../../../core/models/diary.model';
import { DiaryType } from '../../../core/models/diary-type.model';
import { Weather } from '../../../core/models/weather.model';
import { DiaryService } from '../../../core/services/diary.service';
import { DiaryTypeService } from '../../../core/services/diary-type.service';
import { WeatherService } from '../../../core/services/weather.service';
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
    MatIconModule,
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
// master - MARSISCA - BEGIN 2026-01-24
export class DiaryEntryFormModal implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode: boolean;
  diaryTypes: DiaryType[] = [];
  weatherTypes: Weather[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private diaryService: DiaryService,
    private diaryTypeService: DiaryTypeService,
    private weatherService: WeatherService,
    private authService: AuthService,
    private translateService: TranslateService,
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

    const initialDate = this.minDate ? this.minDate : new Date();

    this.form = this.fb.group({
      date: [initialDate, [Validators.required]],
      time: ['12:00', [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      diaryTypeId: [null],
      weatherTypeId: [null]
    });
  }
  // master - MARSISCA - END 2026-01-24

  // master - MARSISCA - BEGIN 2026-01-24
  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    forkJoin({
      diaryTypes: this.diaryTypeService.getUserDiaryTypes(currentUser.id),
      weatherTypes: this.weatherService.getWeathers()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (responses) => {
        if (responses.diaryTypes.success) {
          this.diaryTypes = responses.diaryTypes.data;
        }
        if (responses.weatherTypes.success) {
          this.weatherTypes = responses.weatherTypes.data;
        }
        // Patch form after data is loaded
        if (this.isEditMode && this.data.diary) {
          this.patchFormValues();
        }
      },
      error: (error) => {
        console.error('Error loading form data:', error);
      }
    });
  }

  patchFormValues(): void {
    if (!this.data.diary) return;

    const dateTime = new Date(this.data.diary.dateTime);
    const timeString = format(dateTime, 'HH:mm');

    this.form.patchValue({
      date: dateTime,
      time: timeString,
      title: this.data.diary.title,
      description: this.data.diary.description,
      diaryTypeId: this.data.diary.diaryTypeId,
      weatherTypeId: this.data.diary.weatherTypeId
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getWeatherName(weather: Weather): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? weather.nameSpanish : weather.nameEnglish;
  }
  // master - MARSISCA - END 2026-01-24

  // master - MARSISCA - BEGIN 2026-01-24
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    // Combine date and time into ISO 8601 datetime format
    const selectedDate = formValue.date instanceof Date ? formValue.date : new Date(formValue.date);
    const [hours, minutes] = formValue.time.split(':').map(Number);
    selectedDate.setHours(hours, minutes, 0, 0);
    const dateTimeFormatted = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss");

    const dataToSend = {
      dateTime: dateTimeFormatted,
      title: formValue.title,
      description: formValue.description,
      diaryTypeId: formValue.diaryTypeId,
      weatherTypeId: formValue.weatherTypeId
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
  // master - MARSISCA - END 2026-01-24

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2026-01-01
