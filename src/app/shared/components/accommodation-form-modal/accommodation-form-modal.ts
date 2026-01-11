// master - MARSISCA - BEGIN 2025-12-31
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// master - MARSISCA - BEGIN 2026-01-10
import { MatIconModule } from '@angular/material/icon';
// master - MARSISCA - END 2026-01-10
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
    // master - MARSISCA - BEGIN 2026-01-10
    MatIconModule,
    // master - MARSISCA - END 2026-01-10
    TranslateModule
  ],
  templateUrl: './accommodation-form-modal.html',
  styleUrl: './accommodation-form-modal.scss'
})
export class AccommodationFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  // master - MARSISCA - BEGIN 2026-01-10
  selectedIconFile: File | null = null;
  iconPreview: string | null = null;
  // master - MARSISCA - END 2026-01-10

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
      // master - MARSISCA - BEGIN 2026-01-10
      if (this.data.accommodation.icon) {
        this.iconPreview = this.data.accommodation.icon;
      }
      // master - MARSISCA - END 2026-01-10
    }
  }

  // master - MARSISCA - BEGIN 2026-01-10
  onIconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedIconFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.iconPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedIconFile);
    }
  }

  removeIcon(): void {
    this.selectedIconFile = null;
    this.iconPreview = null;
  }
  // master - MARSISCA - END 2026-01-10

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    // master - MARSISCA - BEGIN 2026-01-10
    if (this.isEditMode && this.data.accommodation) {
      this.accommodationService.updateAccommodation(this.data.accommodation.id, formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile) {
            this.accommodationService.uploadIcon(this.data.accommodation!.id, this.selectedIconFile).subscribe({
              next: () => {
                this.dialogRef.close(true);
              },
              error: (error) => {
                console.error('Error uploading icon:', error);
                this.dialogRef.close(true);
              }
            });
          } else {
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
          if (response.success && this.selectedIconFile && response.data) {
            this.accommodationService.uploadIcon(response.data.id, this.selectedIconFile).subscribe({
              next: () => {
                this.dialogRef.close(true);
              },
              error: (error) => {
                console.error('Error uploading icon:', error);
                this.dialogRef.close(true);
              }
            });
          } else {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error creating accommodation:', error);
        }
      });
    }
    // master - MARSISCA - END 2026-01-10
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-31
