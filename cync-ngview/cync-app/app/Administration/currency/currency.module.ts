import { NgModule } from '@angular/core';
import {HttpModule} from  '@angular/http';
import { currencyComponent } from './currency.component';
import { routing } from './currency.routing';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/primeng';
import {SafePipe} from './safe.pipe';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    currencyComponent,
    SafePipe
  ],
  imports: [
    CommonModule, HttpModule,
    routing,
    ButtonModule,
    RouterModule

  ],
  exports : [currencyComponent]

})
export class CurrencyModule { }
