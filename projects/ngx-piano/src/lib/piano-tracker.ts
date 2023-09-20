import { inject, Injectable, NgZone } from '@angular/core';
import { PianoHolder } from './pa-instance';
import { ActionType } from './event/action-type';

declare var window: PianoHolder;

export interface RouteData {
  url: string,
  pageTitle: string,
}

export function createPianoTracker(): PianoTracker {
  return new PianoTracker(inject(NgZone));
}

@Injectable({
  providedIn: 'root',
  useFactory: createPianoTracker
})
export class PianoTracker {
  constructor(private readonly ngZone: NgZone) {
  }

  /**
   * Send event throw piano instance attached to window
   * @param eventName the name of the event to send
   * @param data data related to the event name
   * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/standard-events
   * @private
   */
  private sendEvent(eventName: string, data: any) {
    if(!window.pa) {
      throw new Error("Piano instance not found");
    }
    window.pa.sendEvent(eventName, data);
  }

  trackNavigation(routeData: RouteData) {
    this.ngZone.runOutsideAngular(() => {
      this.sendEvent('page.display', {
        'page': routeData.url
      });
    });
  }

  trackClickEvent(actionType: ActionType, name: string) {
    switch (actionType) {
      case "DOWNLOAD":
        this.sendEvent("click.download", {
          click: name
        });
        break;
      case "ACTION":
        this.sendEvent("click.action", {
          click: name
        });
        break;
      case "EXIT":
        this.sendEvent("click.exit", {
          click: name
        });
        break;
      case "NAVIGATION":
        this.sendEvent("click.navigation", {
          click: name
        });
        break;
    }
  }
}
