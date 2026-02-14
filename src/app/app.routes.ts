// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { GeneralComponent } from './pages/general/general.component';
import { MapsComponent } from './pages/maps/maps.component';
import { Settings } from './pages/settings/settings';
import { TripDetail } from './pages/trip-detail/trip-detail';
import { CalendarComponent } from './pages/calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent }
    ]
  },
  {
    path: 'es',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent, data: { lang: 'es' } }
    ]
  },
  {
    path: 'legal-notice',
    component: LegalNoticeComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'general', component: GeneralComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'trip/:id', component: TripDetail },
      { path: 'maps', component: MapsComponent },
      { path: 'settings', component: Settings }
    ]
  }
];
// feature/landing-page - MARSISCA - END 2026-02-13
