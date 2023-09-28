import { inject, Injectable, NgZone } from '@angular/core';
import { PianoHolder } from './pa-instance';
import { NgxPianoActionType } from './event/ngx-piano-action-type';
import { NgxPianoConfiguration, PIANO_CONFIG } from "./ngx-piano.module";
import { NgxPianoNavigationEventData } from "./route/piano-navigation-tracking.service";

declare var window: PianoHolder;

export interface RouteData {
  url: string,
}

/**
 * Piano event type can be a standard event or a custom event.
 * - Standard events are predefined events that are sent to the collection domain.
 * - Custom events are events **that you have in your Data Model**. Custom events are specific to your organization
 * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/standard-events
 * @see https://support.piano.io/hc/fr/articles/4465959709202-%C3%89v%C3%A9nements
 */
export type NgxPianoEventType = "click.action" | "click.navigation" | "click.exit" | "click.download" | "page.display" | string;

/**
 * Options for the property
 */
export type NgxPianoPropertyOptions = {
  /**
   * If true, the property will be sent with each subsequent event
   */
  persistent: boolean,

  /**
   * Defines events scope of the property. By default, no scope is defined and the property will be sent with all
   * type of events.
   *
   * @example
   * "page.display" // will be sent with `page.display` event
   * ["page.*", "click.*"] // will be sent with all `page.*` and `click.*` events
   * ["page.display", "click.action"] // will be sent with `page.display` and `click.action` events
   */
  forEvents?: NgxPianoEventType[] | NgxPianoEventType
}

export function createPianoTracker(): PianoTracker {
  return new PianoTracker(inject(NgZone), inject(PIANO_CONFIG));
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
  constructor(private readonly ngZone: NgZone, private readonly pianoConfig: NgxPianoConfiguration) {
  }

  /**
   * Send event to your collection domain through piano instance attached to window
   * @param eventType the type of the event to send. You can send standard events or also your own custom events
   * @param properties properties related to the event. **IMPORTANT: properties you use must be defined in your Data
   * Model** https://management.atinternet-solutions.com/#/data-model/properties/list
   * @throws Error if the piano instance is not attached to window and the piano configuration is not disabled
   * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/standard-events
   * @private
   */
  public sendEvent(eventType: NgxPianoEventType, properties: any) {
    try {
      this.checkIfWindowHasPianoInstance();
      window.pa.sendEvent(eventType, properties);
    } catch (e) {
      if(this.pianoConfig.disabled) {
        console.warn("Piano disabled in configuration, retaining the following event: ", eventType, properties);
        return;
      }
      throw e;
    }
  }

  /**
   * Check if the piano instance is attached to window
   * @private
   * @throws Error if the piano instance is not attached to window
   */
  private checkIfWindowHasPianoInstance() {
    if(!window.pa) {
      throw new Error("Piano instance not found");
    }
  }

  /**
   * Send navigation event to collection domain through piano instance attached to window
   *
   * You don't have to directly call this method. It is called automatically when the route changes.
   * @param routeData data related to the route event
   */
  sendNavigationEvent(routeData: NgxPianoNavigationEventData) {
    this.ngZone.runOutsideAngular(() => {
      this.sendEvent('page.display', routeData);
    });
  }

  /**
   * Send click event to collection domain through piano instance attached to window
   * @param actionType the type of the action to send
   * @param name the name of the action to send. It describes the action performed by the user
   * @param properties all additional properties you want to provide. Check you use valid properties of your Data Model
   * https://management.atinternet-solutions.com/#/data-model/properties/list
   */
  sendClickEvent(actionType: NgxPianoActionType, name: string, properties?: any) {
    switch (actionType) {
      case "DOWNLOAD":
        this.sendEvent("click.download", {
          click: name,
          ...properties
        });
        break;
      case "ACTION":
        this.sendEvent("click.action", {
          click: name,
          ...properties
        });
        break;
      case "EXIT":
        this.sendEvent("click.exit", {
          click: name,
          ...properties
        });
        break;
      case "NAVIGATION":
        this.sendEvent("click.navigation", {
          click: name,
          ...properties
        });
        break;
    }
  }

  /**
   * Set a property to subsequent event through piano instance attached to window. Property name and value must be
   * defined on the data model of your collection domain.
   *
   * @example
   * // Set a property to next event which will be sent
   * pianoTracker.setProperty("property_name", "property_value");
   *
   * // Set a property to next event which will be sent and to all subsequent events
   * pianoTracker.setProperty("property_name", "property_value", { persistent: true });
   *
   * // Set a property to next event which will be sent and to all subsequent events of type `page.display`
   * pianoTracker.setProperty("property_name", "property_value", { persistent: true, forEvents: "page.display" });
   *
   * // Set a property to next event which will be sent and to all subsequent events of type `page.display` and `click.action`
   * pianoTracker.setProperty("property_name", "property_value", { persistent: true, forEvents: ["page.display", "click.action"] });
   *
   * @see https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/send-events-via-sdks#add-properties-to-subsequent-events
   * @param propertyName name of the property. Check you use a valid property of your Data Model
   * https://management.atinternet-solutions.com/#/data-model/properties/list
   * @param propertyValue value associate to the name of the property. Check you use a valid type associated with the
   * property name on your Data Model https://management.atinternet-solutions.com/#/data-model/properties/list
   * @param options options for the property. See {@link NgxPianoPropertyOptions}
   */
  setProperty(propertyName: string, propertyValue: any, options?: NgxPianoPropertyOptions) {
    try {
      this.checkIfWindowHasPianoInstance();
      window.pa.setProperty(propertyName, propertyValue, {
        'persistent': options?.persistent,
        'events': options?.forEvents
      });
    } catch (e) {
      if(this.pianoConfig.disabled) {
        console.warn("Piano disabled in configuration, cannot set property: ", propertyName, propertyValue);
        return;
      }
      throw e;
    }
  }
}
