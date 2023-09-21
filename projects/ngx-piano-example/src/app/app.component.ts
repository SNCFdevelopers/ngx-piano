import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <router-outlet></router-outlet>
  `,
  styles: [`
    .links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `]
})
export class AppComponent {
}
