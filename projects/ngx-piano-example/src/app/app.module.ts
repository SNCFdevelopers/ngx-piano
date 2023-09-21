import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageBComponent } from './page-b.component';
import { PageAComponent } from './page-a.component';
import { NgxPianoModule } from 'ngx-piano';
import { TestComponent } from "./test.component";

@NgModule({
  declarations: [
    AppComponent,
    PageBComponent,
    PageAComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPianoModule.forRoot({site: 'your-site-id', collectDomain: 'your-collect-domain'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
