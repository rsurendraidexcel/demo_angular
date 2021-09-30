import { NgModule } from '@angular/core';
import { exchangeRatesComponent } from './exchange.rates.component';
import { routing } from './exchange.rates.routing';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { exchangeRatesViewComponent } from './exchange.rates.view.component';
import { exchangeRatesViewAllComponent } from './exchange.rates.viewAll.component';
import { exchangeRatesEditComponent } from './exchange.rates.edit.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import {CheckboxModule} from 'primeng/primeng';
import { Search_Pipe } from '../../../../app-common/Pipes/search_Pipe';

@NgModule({
  declarations: [
    exchangeRatesComponent,
    exchangeRatesViewComponent,
    exchangeRatesEditComponent,
    exchangeRatesViewAllComponent,
    Search_Pipe
  ],
  bootstrap: [
    exchangeRatesComponent
  ],
  imports: [
    CommonModule,
    routing,
    CommonComponentModule,
    FormsModule,
    CheckboxModule
  ],
  exports : [exchangeRatesComponent],
  providers: [GridComponent]

})
export class ExchangeRatesModule { }
