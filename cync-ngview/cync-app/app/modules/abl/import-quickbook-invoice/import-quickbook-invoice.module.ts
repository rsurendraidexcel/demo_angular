import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportQuickbookInvoiceComponent } from './import-quickbook-invoice/import-quickbook-invoice.component';
import { ImportQuickbookInvoicesRoutingModule } from './import-quickbook-invoice-routing.module';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule} from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [ImportQuickbookInvoiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    CheckboxModule,
    CommonComponentModule,
    ImportQuickbookInvoicesRoutingModule,
    MatExpansionModule,
    MatIconModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    NgxMaterialTimepickerModule

  ]
})
export class ImportQuickbookInvoicesModule { }
