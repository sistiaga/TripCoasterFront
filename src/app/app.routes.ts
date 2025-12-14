// master - MARSISCA - BEGIN 2025-11-30
import { Routes } from '@angular/router';
import { GeneralComponent } from './pages/general/general.component';
import { MapsComponent } from './pages/maps/maps.component';
import { Settings } from './pages/settings/settings';
import { TripDetail } from './pages/trip-detail/trip-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/general', pathMatch: 'full' },
  { path: 'general', component: GeneralComponent },
  { path: 'trip/:id', component: TripDetail },
  { path: 'maps', component: MapsComponent },
  { path: 'settings', component: Settings }
];
// master - MARSISCA - END 2025-11-30
