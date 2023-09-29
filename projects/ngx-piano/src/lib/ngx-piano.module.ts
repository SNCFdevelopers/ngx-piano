import {
  APP_INITIALIZER,
  EnvironmentInjector,
  inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  runInInjectionContext
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PianoHolder } from './pa-instance';
import { PianoNavigationTracking } from './route/piano-navigation-tracking.service';
import { PianoTrackClickDirective } from './event/piano-track-click.directive';

declare var window: PianoHolder;

function initializePianoScript(config: NgxPianoConfiguration, routerDataInterceptor: PianoNavigationTracking) {
  if(config.disabled) {
    return () => Promise.resolve();
  }

  const document = inject(DOCUMENT);
  const injector = inject(EnvironmentInjector);

  const scriptElementToAppend = document.createElement('script');
  scriptElementToAppend.src = config.pianoScriptUrl ? config.pianoScriptUrl : "https://tag.aticdn.net/piano-analytics.js";
  scriptElementToAppend.type = 'text/javascript';
  scriptElementToAppend.defer = true; // downloads during HTML parsing and will only execute after parsing
  scriptElementToAppend.async = true;  // downloads the file during parsing and will pause the HTML parser to execute it when it has finished downloading

  return () => new Promise<void>((resolve) => {
    runInInjectionContext(injector, (): void => {
      if(document.scripts?.item(0)) {
        const firstScriptElement = document.scripts.item(0) as HTMLScriptElement;
        document.body.insertBefore(scriptElementToAppend, firstScriptElement);
      }
    });
    scriptElementToAppend.addEventListener('error', () => {
      console.error(`Piano Analytics could not be reached. The analytics script ${scriptElementToAppend.src} is blocked. Verify you not use an tool like uBlock Origin that blocks external scripts.`);
      resolve();
    });
    scriptElementToAppend.addEventListener('load', event => {
      if(window.pa) {
        window.pa.setConfigurations({
          site: config.site,
          collectDomain: config.collectDomain
        });
        routerDataInterceptor.initialize();
      }
      else {
        console.error("Piano script was not loaded correctly. Verify you provided a valid script.");
      }
      resolve();
    })
  });
}

export interface NgxPianoConfiguration {
  /**
   * Set to true to disable tracking globally
   */
  disabled?: boolean

  site: string,
  collectDomain: string,
  /**
   * Regular expressions to match routes that should be excluded from tracking.
   */
  excludedRoutePatterns?: string[],
  /**
   * Provide piano script URL to load the Piano script from a specific host.
   */
  pianoScriptUrl?: string
}

export const PIANO_CONFIG = new InjectionToken<NgxPianoConfiguration>('PianoConfig');

@NgModule({
  declarations: [PianoTrackClickDirective],
  imports: [],
  exports: [PianoTrackClickDirective]
})
export class NgxPianoModule {
  static forRoot(config: NgxPianoConfiguration): ModuleWithProviders<NgxPianoModule> {
    return {
      ngModule: NgxPianoModule,
      providers: [
        {
          provide: PIANO_CONFIG,
          useValue: config
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: initializePianoScript,
          deps: [PIANO_CONFIG, PianoNavigationTracking]
        }
      ]
    }
  }

  constructor() {
  }
}
