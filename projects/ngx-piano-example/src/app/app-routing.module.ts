import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAComponent } from './page-a.component';
import { PageBComponent } from './page-b.component';
import { TestComponent } from "./test.component";
import { NgxPianoRouteMetaData } from "ngx-piano";

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
    component: TestComponent,
  },
  {
    path: 'ngx-piano-router-metadata',
    component: TestComponent,
    data: {
      ngxPianoRouteData: {
        page: "Page de test route metadata",
        page_chapter1: 'Test',
      } as NgxPianoRouteMetaData
    }
  },
  {
    path: 'excluded-route',
    component: PageAComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
