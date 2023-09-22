import { inject, Injectable } from '@angular/core';
import { PianoTracker, RouteData } from '../piano-tracker';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NgxPianoConfiguration, PIANO_CONFIG } from "../ngx-piano.module";

// @ts-ignore
function isNavigationEnd(event: Event): event is NavigationEnd {
  return event instanceof NavigationEnd;
}

export function createRouteDataInterceptor(): PianoNavigationTracking {
  const pianoTracker = inject(PianoTracker);
  const router = inject(Router);
  const config: NgxPianoConfiguration | null | undefined = inject(PIANO_CONFIG);

  return new PianoNavigationTracking(pianoTracker, router, config);
}

@Injectable({
  providedIn: "root",
  useFactory: createRouteDataInterceptor
})
export class PianoNavigationTracking {
  constructor(private readonly pianoTracker: PianoTracker,
              private readonly router: Router,
              private readonly pianoConfig: NgxPianoConfiguration | null | undefined) { }

  beforePageTrack(event: NavigationEnd) {
    const routeData: RouteData = {
      url: event.url,
    }
    this.pianoTracker.sendNavigationEvent(routeData);
  }

  /**
   * Call this method when the piano object is defined
   */
  initialize() {
    this.router.events.pipe(
      // @ts-ignore
      filter(isNavigationEnd)
      // @ts-ignore
    ).subscribe((event: NavigationEnd) => {
      if(this.pianoConfig?.excludedRoutePatterns?.some(rx => event.urlAfterRedirects.match(rx))) {
        return;
      }
      this.beforePageTrack(event);
    });
  }
}
