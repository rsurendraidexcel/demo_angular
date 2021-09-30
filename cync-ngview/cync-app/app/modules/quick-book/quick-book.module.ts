import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuickBookRoutingModule } from './quick-book-routing.module';
import { AblQbInvoiceComponent } from './abl-qb-invoice/abl-qb-invoice.component';
import { CalendarModule, CheckboxModule } from 'primeng/primeng';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatExpansionModule, MatIconModule } from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { QuickbookService } from './service/quickbook.service';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
@NgModule({
  declarations: [AblQbInvoiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuickBookRoutingModule,
    MatExpansionModule,
    CalendarModule,
    CheckboxModule,
    MatIconModule,
    RouterModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    CommonComponentModule,
    AgGridModule.withComponents([])
  ],
  providers:[
    QuickbookService
    ],
  schemas:[
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class QuickBookModule { }
