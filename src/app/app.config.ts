// master - MARSISCA - BEGIN 2025-12-08
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
// master - MARSISCA - BEGIN 2026-02-07
import { provideNativeDateAdapter, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
// master - MARSISCA - END 2026-02-07

import { routes } from './app.routes';
// master - MARSISCA - BEGIN 2026-02-06
import { provideApiConfiguration } from './api/api-configuration';
import { environment } from '../environments/environment';
// master - MARSISCA - END 2026-02-06

// master - MARSISCA - BEGIN 2026-02-07
export const DD_MM_YYYY_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearLabel: { year: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions,
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearA11yLabel: { year: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions,
  },
};
// master - MARSISCA - END 2026-02-07

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(
      TranslateModule.forRoot()
    ),
    provideTranslateHttpLoader(),
    // master - MARSISCA - BEGIN 2026-02-06
    provideApiConfiguration(environment.apiUrl),
    // master - MARSISCA - END 2026-02-06
    // master - MARSISCA - BEGIN 2026-02-07
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    // master - MARSISCA - END 2026-02-07
  ]
};
// master - MARSISCA - END 2025-12-08
