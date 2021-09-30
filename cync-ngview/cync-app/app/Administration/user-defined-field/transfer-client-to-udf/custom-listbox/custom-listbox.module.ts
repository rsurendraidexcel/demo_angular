import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { CustomListboxComponent } from './custom-listbox.component';
import { TransferClientToUdfComponent } from '../transfer-client-to-udf.component';
import { RouterModule } from '@angular/router';
import { routing } from '../transfet-client-to-udf.routing';
import { AutoCompleteModule, MultiSelectModule, CheckboxModule } from 'primeng/primeng';
import { TransferClientToUdfService } from '../services/transfer-client-to-udf.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        routing,
        ReactiveFormsModule,
        AutoCompleteModule,
        CheckboxModule
    ],
    declarations: [
        CustomListboxComponent
    ],
    exports: [
        CustomListboxComponent
    ],
    providers: [TransferClientToUdfService]
})
export class CustomListboxModule { }
