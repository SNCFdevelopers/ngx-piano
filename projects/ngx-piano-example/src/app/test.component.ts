import { Component } from '@angular/core';

@Component({
    selector: 'app-test',
    template: `
      <div class="links">
          <a routerLink="/a">navigate to Page A</a>
          <a routerLink="/b">navigate to Page B</a>
      </div>
      <button ngxPianoTrackClick ngxPianoActionType="ACTION" ngxPianoClickName="some_action">Add Action</button>
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
}
