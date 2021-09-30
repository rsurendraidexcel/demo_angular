import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { ROUTING } from "./client-transaction.routing";
import { ListClientTransactionComponent } from './list-client-transaction/list-client-transaction.component';
import { ViewClientTransactionComponent } from './view-client-transaction/view-client-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, DialogModule, CheckboxModule } from 'primeng/primeng';
import { ClientTransactionService } from './service/client-transaction-service';

@NgModule({
  declarations: [
    ListClientTransactionComponent,
    ViewClientTransactionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ROUTING,
    DataTableModule,
    DialogModule,
    CheckboxModule
  ],
  exports: [
    ListClientTransactionComponent
  ],
  providers: [
    ClientTransactionService
  ]
})
export class ClientTransactionModule { }