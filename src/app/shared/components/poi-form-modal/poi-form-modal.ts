// master - MARSISCA - BEGIN 2026-01-18
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { POI, UpdatePOIRequest } from '../../../core/models/poi.model';
import { POIService } from '../../../core/services/poi.service';

export interface POIFormModalData {
  poi: POI;
}

@Component({
  selector: 'app-poi-form-modal',
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
  templateUrl: './poi-form-modal.html',
  styleUrl: './poi-form-modal.scss'
})
export class POIFormModal implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private poiService: POIService,
    private dialogRef: MatDialogRef<POIFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: POIFormModalData
  ) {
    this.form = this.fb.group({
      nameSpanish: ['', [Validators.required, Validators.maxLength(200)]],
      nameEnglish: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', [Validators.maxLength(100)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  ngOnInit(): void {
    if (this.data.poi) {
      this.form.patchValue({
        nameSpanish: this.data.poi.nameSpanish,
        nameEnglish: this.data.poi.nameEnglish,
        description: this.data.poi.description || '',
        category: this.data.poi.category || '',
        latitude: this.data.poi.latitude,
        longitude: this.data.poi.longitude
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const updateData: UpdatePOIRequest = {
      nameSpanish: formValue.nameSpanish,
      nameEnglish: formValue.nameEnglish,
      description: formValue.description || undefined,
      category: formValue.category || undefined,
      latitude: parseFloat(formValue.latitude),
      longitude: parseFloat(formValue.longitude)
    };

    this.poiService.updatePOI(this.data.poi.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        console.error('Error updating POI:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2026-01-18
