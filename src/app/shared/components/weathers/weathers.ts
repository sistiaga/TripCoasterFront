// master - MARSISCA - BEGIN 2026-01-01
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Weather } from '../../../core/models/weather.model';
import { WeatherService } from '../../../core/services/weather.service';
import { WeatherFormModal } from '../weather-form-modal/weather-form-modal';
import { environment } from '../../../../environments/environment';
// master - MARSISCA - END 2026-01-01

@Component({
  selector: 'app-weathers',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './weathers.html',
  styleUrl: './weathers.scss'
})
export class Weathers implements OnInit, OnDestroy {
  weathers: Weather[] = [];
  displayedColumns: string[] = ['nameSpanish', 'nameEnglish', 'icon', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadWeathers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWeathers(): void {
    this.weatherService
      .getWeathers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.weathers = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading weathers:', error);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(WeatherFormModal, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWeathers();
      }
    });
  }

  openEditDialog(weather: Weather): void {
    const dialogRef = this.dialog.open(WeatherFormModal, {
      width: '500px',
      data: { weather }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWeathers();
      }
    });
  }

  deleteWeather(weather: Weather): void {
    const currentLang = this.translateService.currentLang || 'en';
    const weatherName = currentLang === 'es' ? weather.nameSpanish : weather.nameEnglish;

    if (confirm(`Are you sure you want to delete "${weatherName}"?`)) {
      this.weatherService
        .deleteWeather(weather.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadWeathers();
            }
          },
          error: (error) => {
            console.error('Error deleting weather:', error);
          }
        });
    }
  }

  getWeatherName(weather: Weather): string {
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'es' ? weather.nameSpanish : weather.nameEnglish;
  }

  // master - MARSISCA - BEGIN 2026-01-01
  getIconUrl(icon: string | undefined): string | null {
    if (!icon) return null;

    // If it's already a full URL, return it
    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:')) {
      return icon;
    }

    // If it's a relative path, construct the full URL
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${icon}`;
  }
  // master - MARSISCA - END 2026-01-01
}
// master - MARSISCA - END 2026-01-01
