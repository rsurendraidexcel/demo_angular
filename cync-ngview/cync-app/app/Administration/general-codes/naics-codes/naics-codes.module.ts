import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './naics-codes.routing';
import { NaicsCodesComponent } from './naics-codes.component';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NaicsCodesNewComponent } from './naics-codes.new.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { NaicsCodesViewComponent } from './naics-codes.view.component';

@NgModule({
  declarations: [
    NaicsCodesComponent,
    NaicsCodesNewComponent,
    NaicsCodesViewComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing
  ],
  exports : [NaicsCodesComponent],
  providers: [GridComponent, FormvalidationService]

})
export class NaicsCodesModule { }
