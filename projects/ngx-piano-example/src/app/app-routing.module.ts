import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAComponent } from './page-a.component';
import { PageBComponent } from './page-b.component';

const routes: Routes = [
  {
    path: 'a',
    component: PageAComponent
  },
  {
    path: 'b',
    component: PageBComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
