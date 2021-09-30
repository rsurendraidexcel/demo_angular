import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { Routing } from "./basic-parameters.routing";
import { BasicParametersComponent } from './basic-parameters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicParameterService } from './service/basic-parameter.service'
import { CalendarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
//import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';

@NgModule({
  declarations:
    [
      BasicParametersComponent
     // FormValidationComponent
    ],
  imports:
    [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      Routing,
      CalendarModule,
      RadioButtonModule
    ],
  exports:
    [
      BasicParametersComponent
     // FormValidationComponent
    ],
  providers:
    [
      BasicParameterService
    ]

})
export class BasicParametersModule { }