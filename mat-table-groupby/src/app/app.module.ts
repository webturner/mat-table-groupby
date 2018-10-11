import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatIconModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BasicTableComponent } from './basic-table/basic-table.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
  ],
  exports: [
    MatTableModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
