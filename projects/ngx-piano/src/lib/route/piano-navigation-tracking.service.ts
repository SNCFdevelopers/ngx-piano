import { inject, Injectable } from '@angular/core';
import { PianoTracker } from '../piano-tracker';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NgxPianoConfiguration, PIANO_CONFIG } from "../ngx-piano.module";
import { NgxPianoRouteMetaData } from "./ngx-piano-route-meta-data";

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

export type NgxPianoNavigationEventData = {
  page: string
}

@Injectable({
  providedIn: "root",
  useFactory: createRouteDataInterceptor
})
export class PianoNavigationTracking {
  constructor(private readonly pianoTracker: PianoTracker,
              private readonly router: Router,
              private readonly pianoConfig: NgxPianoConfiguration | null | undefined) { }

  /**
   * Returns the current activated route snapshot or null if there is none
   * Iterates through the children is mandatory because the router state snapshot is a tree structure which represents
   * a sort of navigation stack
   *
   * @returns {ActivatedRouteSnapshot | null} The current activated route snapshot or null if there is none
   * @private
   */
  private get currentActivatedRouteSnapshot(): ActivatedRouteSnapshot | null {
    // First route of the navigation stack
    let child = this.router.routerState.snapshot.root.firstChild;
    // Iterate through the children until the last child of the navigation stack
    while(child?.firstChild) {
      child = child.firstChild;
    }
    return child;
  }

  trackNavigation(event: NavigationEnd) {
    const currentActivatedRouteSnapshot = this.currentActivatedRouteSnapshot;
    let ngxPianoRouteData = currentActivatedRouteSnapshot ? this.getRouteNgxPianoData(currentActivatedRouteSnapshot) : undefined;

    let pianoInfos: NgxPianoNavigationEventData = {
      page: event.urlAfterRedirects
    }
    pianoInfos = {
      ...pianoInfos,
      ...ngxPianoRouteData
    };

    this.pianoTracker.sendNavigationEvent(pianoInfos);
  }

  protected getRouteNgxPianoData(route: ActivatedRouteSnapshot): NgxPianoRouteMetaData | undefined {
    return route.data['ngxPianoRouteData'];
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
      this.trackNavigation(event);
    });
  }
}
