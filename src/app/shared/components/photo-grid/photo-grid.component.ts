// master - MARSISCA - BEGIN 2026-01-10
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PhotoValidation } from '../../../core/models/photo.model';

/**
 * Photo grid component for displaying selected photos with validation status
 * Shows photo previews with GPS and date indicators
 */
@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss'
})
export class PhotoGridComponent implements OnInit, OnDestroy {

  @Input() photos: File[] = [];
  @Input() validationResults?: Map<string, PhotoValidation>;
  @Input() readonly: boolean = false;
  @Output() photoRemoved = new EventEmitter<File>();

  // Object URLs for photo previews
  private photoUrls = new Map<string, string>();

  ngOnInit(): void {
    this.createPhotoUrls();
  }

  ngOnDestroy(): void {
    this.revokePhotoUrls();
  }

  /**
   * Create object URLs for photo previews
   */
  private createPhotoUrls(): void {
    this.photos.forEach(photo => {
      const url = URL.createObjectURL(photo);
      this.photoUrls.set(photo.name, url);
    });
  }

  /**
   * Revoke object URLs to free memory
   */
  private revokePhotoUrls(): void {
    this.photoUrls.forEach(url => URL.revokeObjectURL(url));
    this.photoUrls.clear();
  }

  /**
   * Get preview URL for a photo
   * @param photo - Photo file
   * @returns Object URL for preview
   */
  getPhotoUrl(photo: File): string {
    return this.photoUrls.get(photo.name) || '';
  }

  /**
   * Check if photo has GPS coordinates
   * @param photo - Photo file
   * @returns true if photo has GPS
   */
  hasGPS(photo: File): boolean {
    if (!this.validationResults) return false;
    const validation = this.validationResults.get(photo.name);
    return validation?.hasGPS || false;
  }

  /**
   * Check if photo has date information
   * @param photo - Photo file
   * @returns true if photo has date
   */
  hasDate(photo: File): boolean {
    if (!this.validationResults) return false;
    const validation = this.validationResults.get(photo.name);
    return validation?.hasDate || false;
  }

  /**
   * Check if photo is valid (format and size)
   * @param photo - Photo file
   * @returns true if photo is valid
   */
  isValid(photo: File): boolean {
    if (!this.validationResults) return true;
    const validation = this.validationResults.get(photo.name);
    return validation ? validation.isValidFormat && validation.isValidSize : true;
  }

  /**
   * Get validation errors for a photo
   * @param photo - Photo file
   * @returns Array of error messages
   */
  getErrors(photo: File): string[] {
    if (!this.validationResults) return [];
    const validation = this.validationResults.get(photo.name);
    return validation?.errors || [];
  }

  /**
   * Get tooltip text for photo status
   * @param photo - Photo file
   * @returns Tooltip text
   */
  getTooltip(photo: File): string {
    const errors = this.getErrors(photo);
    if (errors.length > 0) {
      return errors.join(', ');
    }

    const parts: string[] = [];
    if (this.hasGPS(photo)) parts.push('GPS available');
    if (this.hasDate(photo)) parts.push('Date available');

    return parts.length > 0 ? parts.join(', ') : 'No metadata';
  }

  /**
   * Remove a photo from the grid
   * @param photo - Photo to remove
   */
  removePhoto(photo: File): void {
    if (this.readonly) return;

    // Revoke the object URL
    const url = this.photoUrls.get(photo.name);
    if (url) {
      URL.revokeObjectURL(url);
      this.photoUrls.delete(photo.name);
    }

    this.photoRemoved.emit(photo);
  }

  /**
   * Format file size for display
   * @param bytes - Size in bytes
   * @returns Formatted size string
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Get status icon for photo
   * @param photo - Photo file
   * @returns Icon name
   */
  getStatusIcon(photo: File): string {
    if (!this.isValid(photo)) return 'error';
    if (!this.hasGPS(photo)) return 'warning';
    if (!this.hasDate(photo)) return 'warning';
    return 'check_circle';
  }

  /**
   * Get status color for photo
   * @param photo - Photo file
   * @returns CSS class for color
   */
  getStatusColor(photo: File): string {
    if (!this.isValid(photo)) return 'error';
    if (!this.hasGPS(photo) || !this.hasDate(photo)) return 'warning';
    return 'success';
  }

  /**
   * Count photos with GPS
   * @returns Number of photos with GPS
   */
  getPhotosWithGPS(): number {
    return this.photos.filter(photo => this.hasGPS(photo)).length;
  }

  /**
   * Count photos with date
   * @returns Number of photos with date
   */
  getPhotosWithDate(): number {
    return this.photos.filter(photo => this.hasDate(photo)).length;
  }

  /**
   * Track by function for ngFor
   * @param index - Index
   * @param photo - Photo file
   * @returns Unique identifier
   */
  trackByName(index: number, photo: File): string {
    return photo.name;
  }
}
// master - MARSISCA - END 2026-01-10
