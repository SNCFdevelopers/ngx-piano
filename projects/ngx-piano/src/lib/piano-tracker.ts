import { inject, Injectable, NgZone } from '@angular/core';
import { PianoHolder } from './pa-instance';
import { ActionType } from './event/action-type';

declare var window: PianoHolder;

export interface RouteData {
  url: string,
}

/**
 * Piano event type can be a standard event or a custom event.
 * - Standard events are predefined events that are sent to the collection domain.
 * - Custom events are events that you define yourself.
 * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/standard-events
 */
export type NgxPianoEventType = "click.action" | "click.navigation" | "click.exit" | "click.download" | "page.display" | string;

export function createPianoTracker(): PianoTracker {
  return new PianoTracker(inject(NgZone));
}

/**
 * PianoTracker is a service that allows you to send events to your collection domain throw piano instance attached to
 * window. It is a sort of Facade for the Piano instance.
 * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/standard-events
 */
@Injectable({
  providedIn: 'root',
  useFactory: createPianoTracker
})
export class PianoTracker {
  constructor(private readonly ngZone: NgZone) {
  }

  /**
   * Send event to your collection domain through piano instance attached to window
   * @param eventType the type of the event to send. You can send standard events or also your own custom events
   * @param data data related to the event
   * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/standard-events
   * @private
   */
  public sendEvent(eventType: NgxPianoEventType, data: any) {
    if(!window.pa) {
      throw new Error("Piano instance not found");
    }
    window.pa.sendEvent(eventType, data);
  }

  /**
   * Send navigation event to collection domain through piano instance attached to window
   *
   * You don't have to directly call this method. It is called automatically when the route changes.
   * @param routeData data related to the route event
   */
  sendNavigationEvent(routeData: RouteData) {
    this.ngZone.runOutsideAngular(() => {
      this.sendEvent('page.display', {
        'page': routeData.url
      });
    });
  }

  /**
   * Send click event to collection domain through piano instance attached to window
   * @param actionType the type of the action to send
   * @param name the name of the action to send. It describes the action performed by the user
   */
  sendClickEvent(actionType: ActionType, name: string) {
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
