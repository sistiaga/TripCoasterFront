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
import { Sport } from '../../../core/models/sport.model';
import { SportService } from '../../../core/services/sport.service';

export interface SportFormModalData {
  sport?: Sport;
}

@Component({
  selector: 'app-sport-form-modal',
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
  templateUrl: './sport-form-modal.html',
  styleUrl: './sport-form-modal.scss'
})
export class SportFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  selectedIconFile: File | null = null;
  iconPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private sportService: SportService,
    private dialogRef: MatDialogRef<SportFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: SportFormModalData
  ) {
    this.isEditMode = !!data?.sport;
    this.form = this.fb.group({
      nameSpanish: ['', [Validators.required, Validators.maxLength(100)]],
      nameEnglish: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.sport) {
      this.form.patchValue({
        nameSpanish: this.data.sport.nameSpanish,
        nameEnglish: this.data.sport.nameEnglish
      });
      if (this.data.sport.icon) {
        this.iconPreview = this.data.sport.icon;
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

    if (this.isEditMode && this.data.sport) {
      this.sportService.updateSport(this.data.sport.id, formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile) {
            this.sportService.uploadIcon(this.data.sport!.id, this.selectedIconFile).subscribe({
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
          console.error('Error updating sport:', error);
        }
      });
    } else {
      this.sportService.createSport(formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile && response.data) {
            this.sportService.uploadIcon(response.data.id, this.selectedIconFile).subscribe({
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
          console.error('Error creating sport:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-31
