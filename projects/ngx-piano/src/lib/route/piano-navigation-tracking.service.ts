import { inject, Injectable } from '@angular/core';
import { PianoTracker, RouteData } from '../piano-tracker';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// @ts-ignore
function isNavigationEnd(event: Event): event is NavigationEnd {
  return event instanceof NavigationEnd;
}

// TODO: voir pour mettre tout ce qui concerne l'interception des requêtes dans un module à part

export function createRouteDataInterceptor(): PianoNavigationTracking {
  const pianoTracker = inject(PianoTracker);
  const router = inject(Router);

  return new PianoNavigationTracking(pianoTracker, router);
}

@Injectable({
  providedIn: "root",
  useFactory: createRouteDataInterceptor
})
export class PianoNavigationTracking {
  constructor(private readonly pianoTracker: PianoTracker, private readonly router: Router) {
  }

  beforePageTrack(event: NavigationEnd) {
    const routeData: RouteData = {
      url: event.url,
      pageTitle: event.url // TODO: extract title
    }
    this.pianoTracker.trackNavigation(routeData);
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
      this.beforePageTrack(event);
    });
  }
}
