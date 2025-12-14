// master - MARSISCA - BEGIN 2025-11-30
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { DiaryType } from '../../../core/models/diary-type.model';
import { DiaryTypeService } from '../../../core/services/diary-type.service';

export interface DiaryTypeFormModalData {
  diaryType?: DiaryType;
}

@Component({
  selector: 'app-diary-type-form-modal',
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
  templateUrl: './diary-type-form-modal.html',
  styleUrl: './diary-type-form-modal.scss'
})
export class DiaryTypeFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private diaryTypeService: DiaryTypeService,
    private dialogRef: MatDialogRef<DiaryTypeFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: DiaryTypeFormModalData
  ) {
    this.isEditMode = !!data?.diaryType;
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.diaryType) {
      this.form.patchValue({
        name: this.data.diaryType.name,
        description: this.data.diaryType.description
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode && this.data.diaryType) {
      this.diaryTypeService.updateDiaryType(this.data.diaryType.id, formValue).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error updating diary type:', error);
        }
      });
    } else {
      this.diaryTypeService.createDiaryType(formValue).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error creating diary type:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-11-30
