import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAComponent } from './page-a.component';
import { PageBComponent } from './page-b.component';
import { TestComponent } from "./test.component";

const routes: Routes = [
  {
    path: 'a',
    component: PageAComponent,
  },
  {
    path: 'b',
    component: PageBComponent,
  },
  {
    path: 'test',
    component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
