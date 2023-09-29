import { Component } from '@angular/core';

@Component({
  selector: 'app-page-b',
  template: `
    <p>
      page-b works!
    </p>
    <button ngxPianoTrackClick ngxPianoActionType="ACTION" ngxPianoClickName="login">Login</button>
  `,
  styles: [
  ]
})
export class PageBComponent {
}
