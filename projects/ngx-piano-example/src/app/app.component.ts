import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <div class="links">
          <a routerLink="a">navigate to Page A</a>
          <a routerLink="b">navigate to Page B</a>
      </div>
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
