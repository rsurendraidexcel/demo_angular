import { NgModule } from '@angular/core';
import { currencyDefitionComponent } from './currency.definition.component';
import { routing } from './currency.definition.routing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { currencySummaryComponent } from './summary.component';
import { currencyViewComponent } from './currency.view.component';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/primeng';

import { GridComponent } from '../../../../app-common/component/grid/grid.component';
// import { OnlyNumber } from '../../../../app-common/directive/only-number.directive';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { CalendarModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    currencyDefitionComponent,
    currencySummaryComponent,
    currencyViewComponent
    // ,OnlyNumber
  ],
  imports: [
    CommonModule,
    routing,
    CommonComponentModule,
    FormsModule,
    MessagesModule,
    Ng2AutoCompleteModule,
    AccordionModule,
    CalendarModule
  ],
  exports: [currencyDefitionComponent],
  providers: [GridComponent]

})
export class CurrencyDefinitionModule { }
