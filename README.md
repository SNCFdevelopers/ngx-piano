# NgxPiano

This library aims to provide an integration for the Piano Analytics product into Angular applications.

## Installation

- Run `npm install ngx-piano`
- Import `ngx-piano-module` into your target module
- In `forRoute` static method of NgxPianoModule define the `siteId` and the `collectDomain`

```ts
import {
  NgxPianoModule
} from 'ngx-piano';

@NgModule({
  imports: [
    NgxPianoModule.forRoot({
      siteId: 123456, // replace with your id
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

## Tracking events

### Click event

An directive exists for catching click's event named `ngxPianoClick`. You can track click events directly from the template

```html

<button ngxPianoClick ngxPianoClickName="Login" ngxPianoClickActionType="ACTION">
  Your button text
</button>
```

`ngxPianoClickActionType` is an input of the directive of type `NgxActionClickType` which is an union type with the different possible values.
