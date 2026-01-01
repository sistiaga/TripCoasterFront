// master - MARSISCA - BEGIN 2025-12-31
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TransportationType } from '../../../core/models/transportation-type.model';
import { TransportationTypeService } from '../../../core/services/transportation-type.service';

export interface TransportationTypeFormModalData {
  transportationType?: TransportationType;
}

@Component({
  selector: 'app-transportation-type-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './transportation-type-form-modal.html',
  styleUrl: './transportation-type-form-modal.scss'
})
export class TransportationTypeFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  selectedIconFile: File | null = null;
  iconPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transportationTypeService: TransportationTypeService,
    private dialogRef: MatDialogRef<TransportationTypeFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: TransportationTypeFormModalData
  ) {
    this.isEditMode = !!data?.transportationType;
    this.form = this.fb.group({
      nameSpanish: ['', [Validators.required, Validators.maxLength(100)]],
      nameEnglish: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.transportationType) {
      this.form.patchValue({
        nameSpanish: this.data.transportationType.nameSpanish,
        nameEnglish: this.data.transportationType.nameEnglish
      });
      if (this.data.transportationType.icon) {
        this.iconPreview = this.data.transportationType.icon;
      }
    }
  }

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

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode && this.data.transportationType) {
      this.transportationTypeService.updateTransportationType(this.data.transportationType.id, formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile) {
            this.transportationTypeService.uploadIcon(this.data.transportationType!.id, this.selectedIconFile).subscribe({
              next: () => {
                this.dialogRef.close(true);
              },
              error: (error) => {
                console.error('Error uploading icon:', error);
                this.dialogRef.close(true);
              }
            });
          } else if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error updating transportation type:', error);
        }
      });
    } else {
      this.transportationTypeService.createTransportationType(formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile && response.data) {
            this.transportationTypeService.uploadIcon(response.data.id, this.selectedIconFile).subscribe({
              next: () => {
                this.dialogRef.close(true);
              },
              error: (error) => {
                console.error('Error uploading icon:', error);
                this.dialogRef.close(true);
              }
            });
          } else if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error creating transportation type:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-31
