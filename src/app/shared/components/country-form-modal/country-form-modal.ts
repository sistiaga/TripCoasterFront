// master - MARSISCA - BEGIN 2025-12-14
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../core/models/country.model';
import { CountryService } from '../../../core/services/country.service';

export interface CountryFormModalData {
  country?: Country;
}

@Component({
  selector: 'app-country-form-modal',
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
  templateUrl: './country-form-modal.html',
  styleUrl: './country-form-modal.scss'
})
export class CountryFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

// master - MARSISCA - BEGIN 2026-01-02
  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private dialogRef: MatDialogRef<CountryFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: CountryFormModalData
  ) {
    this.isEditMode = !!data?.country;
    this.form = this.fb.group({
      nameSpanish: ['', [Validators.required, Validators.maxLength(100)]],
      nameEnglish: ['', [Validators.required, Validators.maxLength(100)]],
      flagPath: ['', [Validators.required, Validators.maxLength(255)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      continent: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.country) {
      this.form.patchValue({
        nameSpanish: this.data.country.nameSpanish,
        nameEnglish: this.data.country.nameEnglish,
        flagPath: this.data.country.flagPath,
        latitude: this.data.country.latitude,
        longitude: this.data.country.longitude,
        continent: this.data.country.continent
      });
    }
  }
// master - MARSISCA - END 2026-01-02

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode && this.data.country) {
      this.countryService.updateCountry(this.data.country.id, formValue).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error updating country:', error);
        }
      });
    } else {
      this.countryService.createCountry(formValue).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          console.error('Error creating country:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-14
