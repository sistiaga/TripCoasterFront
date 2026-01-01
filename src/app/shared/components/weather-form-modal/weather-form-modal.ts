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
import { Weather } from '../../../core/models/weather.model';
import { WeatherService } from '../../../core/services/weather.service';

export interface WeatherFormModalData {
  weather?: Weather;
}

@Component({
  selector: 'app-weather-form-modal',
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
  templateUrl: './weather-form-modal.html',
  styleUrl: './weather-form-modal.scss'
})
export class WeatherFormModal implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  selectedIconFile: File | null = null;
  iconPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService,
    private dialogRef: MatDialogRef<WeatherFormModal>,
    @Inject(MAT_DIALOG_DATA) public data: WeatherFormModalData
  ) {
    this.isEditMode = !!data?.weather;
    this.form = this.fb.group({
      nameSpanish: ['', [Validators.required, Validators.maxLength(50)]],
      nameEnglish: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.weather) {
      this.form.patchValue({
        nameSpanish: this.data.weather.nameSpanish,
        nameEnglish: this.data.weather.nameEnglish
      });
      if (this.data.weather.icon) {
        this.iconPreview = this.data.weather.icon;
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

    if (this.isEditMode && this.data.weather) {
      this.weatherService.updateWeather(this.data.weather.id, formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile) {
            this.weatherService.uploadIcon(this.data.weather!.id, this.selectedIconFile).subscribe({
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
          console.error('Error updating weather:', error);
        }
      });
    } else {
      this.weatherService.createWeather(formValue).subscribe({
        next: (response) => {
          if (response.success && this.selectedIconFile && response.data) {
            this.weatherService.uploadIcon(response.data.id, this.selectedIconFile).subscribe({
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
          console.error('Error creating weather:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-31
