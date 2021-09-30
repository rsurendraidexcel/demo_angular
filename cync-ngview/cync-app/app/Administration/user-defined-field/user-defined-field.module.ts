import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDefinedFieldComponent } from './user-defined-field.component';
import { Routing } from './user-defined-field.routing';
import {RadioButtonModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    Routing,
    RadioButtonModule,
    FormsModule
  ],
  declarations: [UserDefinedFieldComponent],
  exports : [UserDefinedFieldComponent]
})
export class UserDefinedFieldModule { }
