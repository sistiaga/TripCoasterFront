// master - MARSISCA - BEGIN 2025-12-08
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TripPhoto } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip.service';

export interface PhotoDetailModalData {
  photo: TripPhoto;
  tripId: number;
  canEdit: boolean;
}

@Component({
  selector: 'app-photo-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './photo-detail-modal.html',
  styleUrl: './photo-detail-modal.scss'
})
export class PhotoDetailModal implements OnInit {
  photoForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private dialogRef: MatDialogRef<PhotoDetailModal>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoDetailModalData
  ) {
    this.photoForm = this.fb.group({
      isMain: [false]
    });
  }

  ngOnInit(): void {
    console.log('=== PHOTO DETAIL MODAL ===');
    console.log('Photo data:', this.data.photo);
    console.log('Photo URL:', this.data.photo?.url);
    console.log('Latitude:', this.data.photo?.latitude);
    console.log('Longitude:', this.data.photo?.longitude);
    console.log('Metadata:', this.data.photo?.metadata);

    if (this.data.photo) {
      this.photoForm.patchValue({
        isMain: this.data.photo.isMain || false
      });
    }
  }

  onSave(): void {
    if (this.photoForm.invalid || !this.data.canEdit) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updateData = {
      isMain: this.photoForm.value.isMain
    };

    this.tripService.updatePhoto(this.data.photo.id, updateData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.dialogRef.close(true);
        } else {
          this.errorMessage = response.message || 'Error updating photo';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error connecting to server';
      }
    });
  }

  onDelete(): void {
    if (!this.data.canEdit) {
      return;
    }

    if (confirm('Are you sure you want to delete this photo?')) {
      this.isLoading = true;
      this.tripService.deletePhoto(this.data.photo.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close('deleted');
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error deleting photo';
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
// master - MARSISCA - END 2025-12-08
