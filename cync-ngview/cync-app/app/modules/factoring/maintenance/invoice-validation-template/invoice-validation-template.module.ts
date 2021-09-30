import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceRoutingModule } from './invoice-validation-template.routing';
import { InvoiceValidationTemplateComponent } from './invoice-validation-template.component';
import { InvoiceService } from './service/invoice.service';
import { AgGridModule } from 'ag-grid-angular';
import { TabsModule } from 'ngx-bootstrap';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { EditAddInvoiceValidationComponent } from './edit-add-invoice-validation/edit-add-invoice-validation.component';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    CommonComponentModule,
    MatDialogModule,
    FormsModule,
    AgGridModule.withComponents([]),
    TabsModule.forRoot()

  ],
  entryComponents: [EditAddInvoiceValidationComponent],
  declarations: [
    InvoiceValidationTemplateComponent,
    EditAddInvoiceValidationComponent 
  ],
    exports: [InvoiceValidationTemplateComponent, EditAddInvoiceValidationComponent],
    providers: [InvoiceService]
    
})
export class InvoiceValidationModule { }