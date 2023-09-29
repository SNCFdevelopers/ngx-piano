import { Component } from '@angular/core';
import { PianoTracker } from 'ngx-piano';

@Component({
    selector: 'app-test',
    template: `
      <div class="links">
        <a routerLink="/a">navigate to Page A</a>
        <a routerLink="/b">navigate to Page B</a>
      </div>
      <button ngxPianoTrackClick ngxPianoActionType="ACTION" ngxPianoClickName="some_action">Add Action</button>
      <button ngxPianoTrackClick ngxPianoActionType="DOWNLOAD" ngxPianoClickName="pdf">Add Download Action</button>
      <button data-testid="send-custom-event-service-call" (click)="sendCustomEventWithService()">
        Send custom event with service call
      </button>
      <button data-testid="set-not-persistent-property-service-call" (click)="setNotPersistentPropertyWithService()">
        Set not persistent piano property with service
      </button>
      <button data-testid="set-persistent-property-service-call" (click)="setPersistentPropertyWithService()">
        Set persistent piano property with service
      </button>
    `,
    styles: [`
    .links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `]
})
export class TestComponent {
  constructor(private pianoTracker : PianoTracker) { }

  sendCustomEventWithService() {
    this.pianoTracker.sendEvent("search.value", {
      value: "some_value"
    })
  }

  setNotPersistentPropertyWithService() {
    this.pianoTracker.setProperty("property_name", "value");
  }

  setPersistentPropertyWithService() {
    this.pianoTracker.setProperty("property_name", "value", {
      persistent: true,
      forEvents: ["click.download"]
    })
  }
}
