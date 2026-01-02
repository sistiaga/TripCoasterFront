// master - MARSISCA - BEGIN 2026-01-02
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../../core/models/country.model';
import { CountryService } from '../../../core/services/country.service';
import { CountryFormModal } from '../country-form-modal/country-form-modal';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.scss'
})
export class Countries implements OnInit, OnDestroy {
  countries: Country[] = [];
  displayedColumns: string[] = ['flag', 'nameSpanish', 'nameEnglish', 'continent', 'latitude', 'longitude', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private countryService: CountryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCountries(): void {
    this.countryService
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.countries = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading countries:', error);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CountryFormModal, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCountries();
      }
    });
  }

  openEditDialog(country: Country): void {
    const dialogRef = this.dialog.open(CountryFormModal, {
      width: '500px',
      data: { country }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCountries();
      }
    });
  }

  deleteCountry(country: Country): void {
    if (confirm(`Are you sure you want to delete "${country.nameSpanish}"?`)) {
      this.countryService
        .deleteCountry(country.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadCountries();
            }
          },
          error: (error) => {
            console.error('Error deleting country:', error);
          }
        });
    }
  }

  getFlagUrl(flagPath: string | null): string | null {
    if (!flagPath) return null;

    if (flagPath.startsWith('http://') || flagPath.startsWith('https://') || flagPath.startsWith('data:')) {
      return flagPath;
    }

    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${flagPath}`;
  }
}
// master - MARSISCA - END 2026-01-02
