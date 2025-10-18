// master - MARSISCA - BEGIN 2025-10-11
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TripService } from '../../../core/services/trip.service';
import { AuthService } from '../../../core/services/auth.service';

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

@Component({
  selector: 'app-add-trip-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
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
  templateUrl: './add-trip-modal.html',
  styleUrl: './add-trip-modal.scss'
})
export class AddTripModal {
  tripForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AddTripModal>
  ) {
    this.tripForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      rating: ['', [Validators.min(0), Validators.max(10)]]
    }, { validators: this.dateRangeValidator });
  }

  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Handle Moment objects
    const startTime = startDate._isAMomentObject ? startDate.valueOf() : start.getTime();
    const endTime = endDate._isAMomentObject ? endDate.valueOf() : end.getTime();

    if (endTime < startTime) {
      return { dateRange: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const tripData = {
      name: this.tripForm.value.name?.trim(),
      description: this.tripForm.value.description?.trim() || undefined,
      startDate: this.formatDate(this.tripForm.value.startDate),
      endDate: this.formatDate(this.tripForm.value.endDate),
      rating: this.tripForm.value.rating ? parseFloat(this.tripForm.value.rating) : undefined,
      userId: user.id
    };

    this.tripService.createTrip(tripData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.tripForm.reset();
          this.dialogRef.close(true);
        } else {
          this.errorMessage = response.message || 'Error creating trip';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error connecting to server';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private formatDate(date: any): string {
    if (!date) return '';

    // Handle Moment object
    if (date._isAMomentObject || (date.format && typeof date.format === 'function')) {
      return date.format('YYYY-MM-DD');
    }

    // Handle Date object
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return '';
  }

  getNameError(): string {
    const control = this.tripForm.get('name');
    if (control?.hasError('required')) {
      return 'Name is required';
    }
    if (control?.hasError('maxlength')) {
      return 'Name must be less than 100 characters';
    }
    return '';
  }

  getStartDateError(): string {
    const control = this.tripForm.get('startDate');
    if (control?.hasError('required')) {
      return 'Start date is required';
    }
    return '';
  }

  getEndDateError(): string {
    const control = this.tripForm.get('endDate');
    if (control?.hasError('required')) {
      return 'End date is required';
    }
    if (this.tripForm.hasError('dateRange')) {
      return 'End date must be after start date';
    }
    return '';
  }

  getRatingError(): string {
    const control = this.tripForm.get('rating');
    if (control?.hasError('min') || control?.hasError('max')) {
      return 'Rating must be between 0 and 10';
    }
    return '';
  }
}
// master - MARSISCA - END 2025-10-11
