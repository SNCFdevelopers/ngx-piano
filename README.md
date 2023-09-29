# NgxPiano

This library aims to provide an integration for the Piano Analytics product into Angular applications.

## Prerequisite

This library is only compatible with the Angular 16.x.x version and above, make sure to update your project with the following [Angular guide](https://update.angular.io/) 

## Installation

- Run `npm install @sncf/ngx-piano`
- Import `ngx-piano-module` into your target module
- In `forRoute` static method of NgxPianoModule define the `siteId` and the `collectDomain`

```ts
import {
  NgxPianoModule
} from 'ngx-piano';

@NgModule({
  imports: [
    NgxPianoModule.forRoot({
      site: "123456", // replace with your id
      collectDomain: "piano.example.com" // replace with your collect domain
    })
  ],
})
export class AppModule {
}
```

- The installation is finished !

## Usage

### Tracking page view
By importing `NgxPianoModule`, the different routes are automatically tracked. When `NgxPianoModule` is bootstrapping, we subscribe to `RouteEvent` of type [NavigationEnd](https://angular.io/api/router/NavigationEnd). This event is triggered when a navigation ends successfully.

#### Adding info to the page view
#### Using route data

You can add info to the page view by using the `data` property of the route.  
💡By defining `ngxPianoRouteData` as a property of the route data, it is not anymore the URL that is sent as page title but the value of the property `page` of the `ngxPianoRouteData` object.

```ts
import { NgxPianoRouteMetaData } from "ngx-piano";

const routes: Routes = [
  {
    path: 'reservation',
    component: 'ReservationComponent',
    data: {
      piano: {
        ngxPianoRouteData: {
          page: 'Reservation',
          page_chapter1: 'Home',
          page_chapter2: 'Train'
        } as NgxPianoRouteMetaData // IMPORTANT to have completion and to respect NgxPianoRouteData attributes
      }
    }
  }
];
```

### Tracking events
[What is an event?](https://support.piano.io/hc/fr/articles/4465959709202-%C3%89v%C3%A9nements#Définition)

#### Click event

A directive exists for catching click's event named `ngxPianoTrackClick`. You can track click events directly from the template

```html

<button ngxPianoTrackClick ngxPianoClickName="Login" ngxPianoActionType="ACTION">
  Your button text
</button>
```

`ngxPianoActionType` is an input of the directive of type `NgxPianoActionType` which is a union type with the different possible values.

#### Custom events

[Two types of events exist](https://support.piano.io/hc/fr/articles/4465959709202-%C3%89v%C3%A9nements#Cr%C3%A9erun%C3%A9v%C3%A9nement:~:text=Standard%20%26%20Custom,%C3%A0%20votre%20organisation.):
- standard which are defined by Piano (`page.display`, `click.action`, `click.download`, ...)
- custom which are specific events that you have in your Data Model 

You can track custom events by using the `NgxPianoService` and it's `sendEvent(...)` method.

- Inject `PianoTracker` into your component
- Call the `sendEvent(...)` method of `PianoTracker` with the event type you want to track and the event data 

```ts
import {
    PianoTracker,
    NgxPianoEventType
} from 'ngx-piano';

@Component({
    selector: 'your-component',
    template: `
    <input type="text" (blur)="onSearchBlur($event)" />
  `,
    styleUrls: ['./your-component.component.scss']
})
export class YourComponent {
    constructor(private pianoTracker: PianoTracker) {
    }

    /**
     * You can track custom events by using the PianoTracker and its trackEvent method
     * @param event - The blur event
     */
    onSearchBlur(event: FocusEvent) {
        const input = event.target as HTMLInputElement;

        const customNgxPianoEventType: NgxPianoEventType = "search.value"; // custom event type, not a standard event type => ⚠️MUST BE DEFINED IN YOUR DATA MODEL⚠️
        this.pianoTracker.sendEvent(customNgxPianoEventType, {
            name: input.name,
            value: input.value
        });
    }
}
```

### Tracking some properties

You can add some properties to subsequent events, by using a specific method of `PianoTracker` service.
⚠️ [Custom properties are defined in your Data Model](https://management.atinternet-solutions.com/#/data-model/properties/list). Refer to it to be able to know which properties you can provide

Imagine you have these properties in your data model: 
- `user_logged`: `string`

You can track these properties throw your events you send to your Piano collect domain.

_Example_
```ts
import { PianoTracker } from 'ngx-piano';

@Component({
  selector: 'your-login-component',
  template: '<button (click)="trackProperties()">Track Properties</button>',
})
export class YourLoginComponent {
  constructor(private pianoTracker: PianoTracker, private yourAuthenticationService: YourAuthenticationService) {}

  async trackProperties() {
      await this.yourAuthenticationService.login(); 
      const userProperties = {
        user_logged: true,
      };
  
      this.pianoTracker.setProperty("user_logged", true, {
        persistent: true, // Set a property to next event which will be sent and to all subsequent events
      });
  }
}
```

#### Use-case
- Set a property to next event which will be sent
  ```ts 
  pianoTracker.setProperty("property_name", "property_value");
  ```

- Set a property to next event which will be sent and to all subsequent events
  ```ts 
  pianoTracker.setProperty("property_name", "property_value", { persistent: true });
  ```

- Set a property to next event which will be sent and to all subsequent events of type `page.display`
  ```ts
  pianoTracker.setProperty("property_name", "property_value", { persistent: true, forEvents: "page.display" });
  ```

- Set a property to next event which will be sent and to all subsequent events of type `page.display` and `click.action`
  ```ts
  pianoTracker.setProperty("property_name", "property_value", { persistent: true, forEvents: ["page.display", "click.action"] });
  ```

## FAQ
### How to handle multi NgxPianoConfiguration in your app module ?

In your app module
```ts
const isProduction = true;

const configNonProd: NgxPianoConfiguration = {
  site: "non-prod",
  collectDomain: 'collect-domain'
}

const configProd: NgxPianoConfiguration = {
  site: "prod",
  collectDomain: 'collect-domain'
}

const configToUse: NgxPianoConfiguration = isProduction ? configProd : configHorsProd;

@NgModule({
  imports: [
    NgxPianoModule.forRoot(configToUse)
  ]
})
export class AppModule { }
```

### How to disable tracking in some environment ?

You may want to disable tracker in different environments to avoid tracking some unwanted
usage: `local`, `test`, etc.

To do so, just set the `disabled` property of the `forRoot` method to `true`:

```ts
@NgModule({
  imports: [
    NgxPianoModule.forRoot({
      disabled: true
    })
  ]
})
export class AppModule { }
```

### How to exclude a route from tracking ?

If you want to exclude a route from tracking, use `excludedRoutePatterns` option of NgxPianoModule configuration.

Imagine you want to exclude all routes starting with `excluded` from tracking, you can do it like this:

```ts
@NgModule({
    imports: [
        NgxPianoModule.forRoot({
            site: 'your-site-id',
            collectDomain: 'your-collect-domain',
            excludedRoutePatterns: ['excluded*']
        })
    ]})
export class AppModule {}
```

### I don't find my event in my dashboard

You sent a custom event, the request was well send, but you don't retrieve your event on your dashboard?

[Check if you have these custom event on your Data Model](https://management.atinternet-solutions.com/#/data-model/events/list/). If not, your event appears in `Events` section on the tab `Excluded Events` on your collect explorer site.

### What happened if the same property key is defined both with the `setProperty(...)` and the `properties` param in an `sendEvent(...)` method call

The value defined in the `setProperty(...)` method overrides the value defined in properties param of the `sendEvent(...)` method

### I host my own Piano script, how to provide it to the library ?

If you host your own Piano script, you can provide it to the library by using the `pianoScriptUrl` option of NgxPianoModule configuration.  
By default, the library will use the last version of Piano script hosted by Piano.

```ts
@NgModule({
    imports: [
        NgxPianoModule.forRoot({
            site: 'your-site-id',
            collectDomain: 'your-collect-domain',
            pianoScriptUrl: 'https://your-piano-script-url' // must be valid otherwise you will get an error in the console
        })
    ]})
export class AppModule {}
```

## Contributing

[See guide here](./CONTRIBUTING.md)
