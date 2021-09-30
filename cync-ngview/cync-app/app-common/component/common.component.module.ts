import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { GridComponent } from './grid/grid.component';
import { HttpModule } from '@angular/http';
import { CustomHttpService } from '../services/http.service';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/primeng';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { MultiSelectModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { exchangeRatesComponent } from '../../app/Administration/currency/exchange-rates/exchange.rates.component';
import { CyncTextEditorComponent } from './cync-text-editor/cync-text-editor.component';
import { CalendarModule as c } from 'angular-calendar';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component'
import { CalendarModule } from 'primeng/primeng';
import { HtmlFilterPipe } from '../Pipes/html-filter.pipe';
import { CustomGridComponent } from './custom-grid/custom-grid.component';
import { ControlMessagesComponent } from '@cyncCommon/formValidation/control-messages.component';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { CommonRadioComponent } from '@cyncCommon/component/common-radio-header/common-radio-header.component';
import { navbarComponent } from '@app/navbar/navbar.component';
import { numberValidationDirective } from '@cyncCommon/directive/number-validation.directive';
import { CyncGridComponent } from './cync-grid/cync-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { CellRenderComponentComponent } from './cync-grid/cell-render-component/cell-render-component.component';
import { CustomDatePickerComponent } from './cync-grid/custom-datepicker/custom-datepicker.component';

@NgModule({
  imports:
    [
      Ng2AutoCompleteModule,
      DialogModule,
      CalendarModule,
      CheckboxModule,
      CommonModule,
      HttpModule,
      DataTableModule,
      SharedModule,
      ConfirmDialogModule,
      FormsModule,
      ReactiveFormsModule,
      AccordionModule,
      MultiSelectModule,
      RouterModule,
      c.forRoot(),
      AgGridModule.withComponents([CellRenderComponentComponent, CustomDatePickerComponent]),

    ],
  declarations:
    [
      HtmlFilterPipe,
      GridComponent,
      CyncGridComponent,
      CellRenderComponentComponent,
      CyncTextEditorComponent,
      CustomGridComponent,
      FormValidationComponent,
      ControlMessagesComponent,
      CommonRadioComponent,
      numberValidationDirective,
      CyncGridComponent,
      CellRenderComponentComponent,
      CustomDatePickerComponent
    ],
  exports:
    [
      GridComponent,
      CyncTextEditorComponent,
      CustomGridComponent,
      FormValidationComponent,
      ControlMessagesComponent,
      CommonRadioComponent,
      CyncGridComponent,
      numberValidationDirective

    ],
  providers:  
    [
      CustomHttpService,
      ConfirmationService,
      exchangeRatesComponent,
      FormValidationService,
      navbarComponent
    ],
  schemas:
    [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class CommonComponentModule { }
