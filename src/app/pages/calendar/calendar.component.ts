// master - MARSISCA - BEGIN 2026-02-07
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TripService } from '../../core/services/trip.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiConfiguration } from '../../api/api-configuration';
import { Trip, YearSummary, MonthSummary, CalendarCountry } from '../../core/models/trip.model';

interface CalendarDay {
  day: number | null;
  date?: Date;
  trips: TripInDay[];
}

interface TripInDay extends Trip {
  color: string;
  position: 'start' | 'middle' | 'end' | 'single';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  // View mode navigation
  viewMode: 'years' | 'months' | 'days' = 'years';
  yearSummaries: YearSummary[] = [];
  monthSummaries: MonthSummary[] = [];
  selectedYear: number | null = null;
  selectedMonth: number | null = null;

  // Day view
  currentDate: Date = new Date();
  allTrips: Trip[] = [];
  tripsForMonth: Trip[] = [];
  calendarDays: CalendarDay[] = [];

  // Search
  searchQuery: string = '';
  searchResults: Trip[] = [];
  showSearchResults: boolean = false;

  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  tripColors: string[] = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private apiConfig: ApiConfiguration,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadYearsSummary();
    this.loadAllTrips();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.showSearchResults = false;
    }
  }

  // --- Year view ---

  loadYearsSummary(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.tripService.getYearsSummary(user.id).subscribe({
      next: (summaries) => {
        this.yearSummaries = summaries;
      },
      error: (error) => console.error('Error loading years summary:', error)
    });
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.loadMonthsSummary(year);
    this.viewMode = 'months';
  }

  // --- Month view ---

  loadMonthsSummary(year: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.tripService.getMonthsSummary(year, user.id).subscribe({
      next: (summaries) => {
        this.monthSummaries = summaries;
      },
      error: (error) => console.error('Error loading months summary:', error)
    });
  }

  selectMonth(month: number): void {
    if (!this.selectedYear) return;
    this.selectedMonth = month;
    this.currentDate = new Date(this.selectedYear, month - 1);
    this.loadTripsForMonth();
    this.viewMode = 'days';
  }

  getMonthSummary(month: number): MonthSummary | undefined {
    return this.monthSummaries.find(s => s.month === month);
  }

  // --- Day view ---

  loadTripsForMonth(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;

    this.tripService.getTripsByMonth(year, month, user.id).subscribe({
      next: (trips) => {
        this.tripsForMonth = trips;
        this.buildCalendar();
      },
      error: (error) => console.error('Error loading trips for month:', error)
    });
  }

  // --- Navigation ---

  goBackToYears(): void {
    this.viewMode = 'years';
    this.selectedYear = null;
    this.selectedMonth = null;
  }

  goBackToMonths(): void {
    this.viewMode = 'months';
    this.selectedMonth = null;
  }

  previousYear(): void {
    if (!this.selectedYear) return;
    this.selectedYear = this.selectedYear - 1;
    this.loadMonthsSummary(this.selectedYear);
  }

  nextYear(): void {
    if (!this.selectedYear) return;
    this.selectedYear = this.selectedYear + 1;
    this.loadMonthsSummary(this.selectedYear);
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1
    );
    this.selectedYear = this.currentDate.getFullYear();
    this.selectedMonth = this.currentDate.getMonth() + 1;
    this.loadTripsForMonth();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1
    );
    this.selectedYear = this.currentDate.getFullYear();
    this.selectedMonth = this.currentDate.getMonth() + 1;
    this.loadTripsForMonth();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.selectedYear = this.currentDate.getFullYear();
    this.selectedMonth = this.currentDate.getMonth() + 1;
    this.loadTripsForMonth();
  }

  // --- Flags ---

  getFlagUrl(country: CalendarCountry): string {
    if (!country.flagPath) return '';
    if (country.flagPath.startsWith('http')) return country.flagPath;
    return `${this.apiConfig.rootUrl}${country.flagPath}`;
  }

  // --- Search ---

  loadAllTrips(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.tripService.getUserTrips(user.id).subscribe({
      next: (response) => {
        this.allTrips = response.data;
      },
      error: (error) => console.error('Error loading all trips:', error)
    });
  }

  onSearchChange(): void {
    if (this.searchQuery.trim().length < 2) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.searchResults = this.allTrips.filter(trip =>
      trip.name.toLowerCase().includes(query)
    );
    this.showSearchResults = true;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  goToTripMonth(trip: Trip): void {
    const tripDate = new Date(trip.startDate);
    this.selectedYear = tripDate.getFullYear();
    this.selectedMonth = tripDate.getMonth() + 1;
    this.currentDate = new Date(tripDate.getFullYear(), tripDate.getMonth());
    this.viewMode = 'days';
    this.loadTripsForMonth();
    this.clearSearch();
  }

  formatSearchDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // --- Day calendar logic ---

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();

    startingDayOfWeek = (startingDayOfWeek === 0) ? 6 : startingDayOfWeek - 1;

    this.calendarDays = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push({ day: null, trips: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const tripsForDay = this.getTripsForDay(currentDate);

      this.calendarDays.push({
        day: day,
        date: currentDate,
        trips: tripsForDay
      });
    }
  }

  getTripsForDay(date: Date): TripInDay[] {
    return this.tripsForMonth
      .filter(trip => this.isTripOnDate(trip, date))
      .map(trip => ({
        ...trip,
        color: this.tripColors[(trip.id || 0) % this.tripColors.length],
        position: this.getTripPosition(trip, date)
      }));
  }

  isTripOnDate(trip: Trip, date: Date): boolean {
    if (!trip.endDate) return false;

    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tripStart = new Date(trip.startDate);
    const start = new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate());
    const tripEnd = new Date(trip.endDate);
    const end = new Date(tripEnd.getFullYear(), tripEnd.getMonth(), tripEnd.getDate());

    return checkDate >= start && checkDate <= end;
  }

  getTripPosition(trip: Trip, date: Date): 'start' | 'middle' | 'end' | 'single' {
    if (!trip.endDate) return 'single';

    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tripStart = new Date(trip.startDate);
    const start = new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate());
    const tripEnd = new Date(trip.endDate);
    const end = new Date(tripEnd.getFullYear(), tripEnd.getMonth(), tripEnd.getDate());

    const isStart = checkDate.getTime() === start.getTime();
    const isEnd = checkDate.getTime() === end.getTime();

    if (isStart && isEnd) return 'single';
    if (isStart) return 'start';
    if (isEnd) return 'end';
    return 'middle';
  }

  isToday(calDay: CalendarDay): boolean {
    if (!calDay.date) return false;
    const today = new Date();
    return calDay.date.getDate() === today.getDate()
      && calDay.date.getMonth() === today.getMonth()
      && calDay.date.getFullYear() === today.getFullYear();
  }

  goToTrip(tripId: number | undefined): void {
    if (!tripId) return;
    this.router.navigate(['/trip', tripId]);
  }

  getDuration(trip: Trip): number {
    return this.tripService.getTripDurationInDays(trip) + 1;
  }
}
// master - MARSISCA - END 2026-02-07
