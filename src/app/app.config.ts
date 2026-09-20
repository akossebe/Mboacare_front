import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr-FR');

import { routes } from './app.routes';

// L'application tourne en mode « zoneless » (défaut Angular 22) :
// chaque composant appelle ChangeDetectorRef.markForCheck() après
// la mise à jour de son état dans les callbacks subscribe().
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
