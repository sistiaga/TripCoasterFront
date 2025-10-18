// master - MARSISCA - BEGIN 2025-10-18
import { Routes } from '@angular/router';
import { GeneralComponent } from './pages/general/general.component';
import { MapsComponent } from './pages/maps/maps.component';

export const routes: Routes = [
  { path: '', redirectTo: '/general', pathMatch: 'full' },
  { path: 'general', component: GeneralComponent },
  { path: 'maps', component: MapsComponent }
];
// master - MARSISCA - END 2025-10-18
