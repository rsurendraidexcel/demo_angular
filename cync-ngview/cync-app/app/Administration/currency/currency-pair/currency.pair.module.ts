import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from  '@angular/http';
import { currencyPairComponent } from './currency.pair.component';
import { CurrencyPairSummary} from './currency.pair.summary';
import { currencyPairEditComponent } from './currency.pair.edit.component';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { routing } from './currency.pair.routing';
import {CurrencyPairView} from './currencypair.view';
import {RadioButtonModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/primeng';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@NgModule({
  declarations: [
    currencyPairComponent,
    CurrencyPairSummary,
    CurrencyPairView,
    currencyPairEditComponent,
   // OnlyNumber
  ],
  imports: [
    CommonModule,
    routing,
    HttpModule,
    CommonComponentModule,
    RadioButtonModule,
    CheckboxModule,
    AccordionModule,
    FormsModule
  ],
  exports : [currencyPairComponent, CurrencyPairSummary],
  providers: [GridComponent]

})
export class CurrencyPairModule { }
