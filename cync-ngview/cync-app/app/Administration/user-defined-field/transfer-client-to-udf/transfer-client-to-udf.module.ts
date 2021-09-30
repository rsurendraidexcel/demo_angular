import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferClientToUdfComponent } from './transfer-client-to-udf.component';
import { RouterModule } from '@angular/router';
import { routing } from './transfet-client-to-udf.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule, MultiSelectModule, CheckboxModule } from 'primeng/primeng';
import { TransferClientToUdfService } from './services/transfer-client-to-udf.service';
import { CustomListboxModule } from './custom-listbox/custom-listbox.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    CheckboxModule,
    CustomListboxModule
  ],
  declarations: [TransferClientToUdfComponent
  ],
  providers: [TransferClientToUdfService]
})

export class TransferClientToUdfModule { }
