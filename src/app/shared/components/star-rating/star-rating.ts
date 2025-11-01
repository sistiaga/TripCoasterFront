// master - MARSISCA - BEGIN 2025-11-01
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule, MatIconModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRating),
      multi: true
    }
  ]
})
export class StarRating implements ControlValueAccessor {
  @Input() maxStars = 5;
  @Input() readOnly = false;
  @Input() set value(val: number | null) {
    this.rating = val || 0;
  }
  @Output() ratingChange = new EventEmitter<number>();

  rating = 0;
  hoveredStar = 0;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  get stars(): number[] {
    return Array(this.maxStars).fill(0).map((_, i) => i + 1);
  }

  writeValue(value: number | null): void {
    this.rating = value || 0;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readOnly = isDisabled;
  }

  onStarClick(star: number): void {
    if (this.readOnly) return;

    this.rating = star;
    this.onChange(this.rating);
    this.onTouched();
    this.ratingChange.emit(this.rating);
  }

  onStarHover(star: number): void {
    if (this.readOnly) return;
    this.hoveredStar = star;
  }

  onMouseLeave(): void {
    this.hoveredStar = 0;
  }

  isStarFilled(star: number): boolean {
    if (this.hoveredStar > 0) {
      return star <= this.hoveredStar;
    }
    return star <= this.rating;
  }
}
// master - MARSISCA - END 2025-11-01
