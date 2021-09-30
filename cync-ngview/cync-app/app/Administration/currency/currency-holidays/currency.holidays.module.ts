import { NgModule } from '@angular/core';
import { currencyHolidaysComponent } from './currency.holidays.component';
import { routing } from './currency.holidays.routing';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { currencyHolidaysViewComponent } from './currency.holidays.view.component';
import { currencyHolidaysAddComponent } from './currency.holidays.add.component';
import { currencyHolidaysEditComponent } from './currency.holidays.edit.component';
import {CheckboxModule} from 'primeng/primeng';
import { MessagesModule} from 'primeng/primeng';
// import { DatePickerModule } from 'ng2-datepicker';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import {CalendarModule} from 'primeng/primeng';
import {AccordionModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    currencyHolidaysComponent,
    currencyHolidaysViewComponent,
    currencyHolidaysAddComponent,
    currencyHolidaysEditComponent
  ],
  imports: [
    CommonModule,
    routing,
    CommonComponentModule,
    FormsModule,
    CheckboxModule,
    // DatePickerModule,
    MessagesModule,
    AccordionModule,
    CalendarModule
  ],
  exports : [currencyHolidaysComponent],
  providers: [GridComponent]

})
export class CurrencyHolidaysModule { }
