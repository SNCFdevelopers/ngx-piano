import { Component } from '@angular/core';
import { ActionType } from '../../../ngx-piano/src/lib/event/action-type';

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
