import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './create-user.routing';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { CreateUserComponent } from './create-user.component';
import { CreateUserViewComponent } from './create-user.component.view';
import { CreateUserNewComponent } from './create-user.component.new';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/primeng';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { CalendarModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/multiselect';
//import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
  declarations: [
    CreateUserComponent,
    CreateUserViewComponent,
    CreateUserNewComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    RouterModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    CalendarModule,
    MultiSelectModule
  ],
  exports: [CreateUserComponent],
  providers: [GridComponent, FormvalidationService]

})
export class CreateUserModule {

}
