// master - MARSISCA - BEGIN 2025-12-08
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
// master - MARSISCA - BEGIN 2026-02-06
import { provideApiConfiguration } from './api/api-configuration';
import { environment } from '../environments/environment';
// master - MARSISCA - END 2026-02-06

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
    provideApiConfiguration(environment.apiUrl)
    // master - MARSISCA - END 2026-02-06
  ]
};
// master - MARSISCA - END 2025-12-08
