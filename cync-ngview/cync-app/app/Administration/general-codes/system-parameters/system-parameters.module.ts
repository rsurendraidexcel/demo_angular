import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './system-parameters.routing';
import { SystemParametersComponent } from './system-parameters.component';
import { SystemParametersViewComponent } from './system-parameters.view.component';
import { SystemParameterEditComponent } from './system-parameters.edit.component';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';


@NgModule({
  declarations: [
    SystemParametersComponent,
    SystemParametersViewComponent,
    SystemParameterEditComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing

  ],
  exports : [SystemParametersComponent],
  providers: [GridComponent, FormvalidationService]

})
export class SystemParametersModule { }
