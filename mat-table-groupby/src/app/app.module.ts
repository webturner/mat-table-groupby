import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatIconModule, MatPaginatorModule } from '@angular/material';

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
    MatPaginatorModule,
  ],
  exports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
