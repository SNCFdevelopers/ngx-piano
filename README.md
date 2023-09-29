# NgxPiano

This library aims to provide an integration for the Piano Analytics product into Angular applications.

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

By importing `NgxPianoModule`, the different routes are automatically track. When `NgxPianoModule` bootstrapping, we subscribe to `RouteEvent` of type [NavigationEnd](https://angular.io/api/router/NavigationEnd). These event is triggered when a navigation ends successfully.

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

- Inject `NgxPianoService` into your component
- Call the `sendEvent(...)` method of `NgxPianoService` with the event type you want to track and the event data 

```ts
import {
    NgxPianoService,
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
    constructor(private pianoService: NgxPianoService) {
    }

    /**
     * You can track custom events by using the NgxPianoService and it's trackEvent method
     * @param event - The blur event
     */
    onSearchBlur(event: FocusEvent) {
        const input = event.target as HTMLInputElement;

        const customNgxPianoEventType: NgxPianoEventType = "search.value"; // custom event type, not a standard event type => ⚠️MUST BE DEFINED IN YOUR DATA MODEL⚠️
        this.pianoService.sendEvent(customNgxPianoEventType, {
            name: input.name,
            value: input.value
        });
    }
}
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


## Contributing

[See guide here](./CONTRIBUTING.md)
