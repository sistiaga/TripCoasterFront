// master - MARSISCA - BEGIN 2025-11-30
import { Routes } from '@angular/router';
import { GeneralComponent } from './pages/general/general.component';
import { MapsComponent } from './pages/maps/maps.component';
import { Settings } from './pages/settings/settings';
import { TripDetail } from './pages/trip-detail/trip-detail';
// master - MARSISCA - BEGIN 2026-02-07
import { CalendarComponent } from './pages/calendar/calendar.component';
// master - MARSISCA - END 2026-02-07

export const routes: Routes = [
  { path: '', redirectTo: '/general', pathMatch: 'full' },
  { path: 'general', component: GeneralComponent },
  // master - MARSISCA - BEGIN 2026-02-07
  { path: 'calendar', component: CalendarComponent },
  // master - MARSISCA - END 2026-02-07
  { path: 'trip/:id', component: TripDetail },
  { path: 'maps', component: MapsComponent },
  { path: 'settings', component: Settings }
];
// master - MARSISCA - END 2025-11-30
