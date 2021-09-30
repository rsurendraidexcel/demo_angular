import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routing } from './exceptions.routing';
import { ExceptionService } from './service/exceptions.service';
import { ListExceptionsComponent } from './list-exceptions/list-exceptions.component';
import { ManageExceptionsComponent } from './manage-exceptions/manage-exceptions.component';
import { DataTableModule, CheckboxModule, DialogModule } from 'primeng/primeng';
import { GridHelper } from '@cyncCommon/utils/grid-helper';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";

@NgModule({
  declarations: [
    ListExceptionsComponent,
    ManageExceptionsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DataTableModule,
    DialogModule
  ],
  exports: [

  ],
  providers: [
    ExceptionService
  ]
})
export class ExceptionsModule { }