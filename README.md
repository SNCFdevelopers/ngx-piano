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

By importing `NgxPianoModule`, the different routes are automaticaly track. When `NgxPianoModule` bootstraping, we subscribe to `RouteEvent` of type [NavigationEnd](https://angular.io/api/router/NavigationEnd). These event is triggered when a navigation ends successfully.

### Tracking events

#### Click event

A directive exists for catching click's event named `ngxPianoClick`. You can track click events directly from the template

```html

<button ngxPianoTrackClick ngxPianoClickName="Login" ngxPianoClickActionType="ACTION">
  Your button text
</button>
```

`ngxPianoClickActionType` is an input of the directive of type `NgxActionClickType` which is an union type with the different possible values.

#### Custom event

You can track custom events by using the `NgxPianoService` and it's `trackEvent` method.

- Inject `NgxPianoService` into your component
- Call the `trackEvent` of `NgxPianoService` with the event type and the event data

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

        const customNgxPianoEventType: NgxPianoEventType = "search.value"; // custom event type, not a standard event type
        this.pianoService.trackEvent(customNgxPianoEventType, {
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


## Contributing

[See guide here](./CONTRIBUTING.md)
