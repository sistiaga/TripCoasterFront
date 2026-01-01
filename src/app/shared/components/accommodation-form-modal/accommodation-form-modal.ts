// master - MARSISCA - BEGIN 2025-12-31
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Accommodation } from '../../../core/models/accommodation.model';
import { AccommodationService } from '../../../core/services/accommodation.service';

export interface AccommodationFormModalData {
  accommodation?: Accommodation;
}

@Component({
  selector: 'app-accommodation-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './accommodation-form-modal.html',
  styleUrl: './accommodation-form-modal.scss'
})
export class AccommodationFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private dialogRef: MatDialogRef<AccommodationFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: AccommodationFormModalData
  ) {
    this.isEditMode = !!data?.accommodation;
    this.form = this.fb.group({
      nameSpanish: ['', [Validators.required, Validators.maxLength(100)]],
      nameEnglish: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.accommodation) {
      this.form.patchValue({
        nameSpanish: this.data.accommodation.nameSpanish,
        nameEnglish: this.data.accommodation.nameEnglish
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode && this.data.accommodation) {
      this.accommodationService.updateAccommodation(this.data.accommodation.id, formValue).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error updating accommodation:', error);
        }
      });
    } else {
      this.accommodationService.createAccommodation(formValue).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error creating accommodation:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-31
