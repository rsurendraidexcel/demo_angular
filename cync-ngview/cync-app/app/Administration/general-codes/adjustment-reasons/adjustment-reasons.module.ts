import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './adjustment-reasons.routing';
import { AdjustmentReasonsComponent } from './adjustment-reasons.component';
import { AdjustmentReasonsViewComponent } from './adjustment-reasons.view.component';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { AdjustmentReasonsNewComponent } from './adjustment-reasons.new.component';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import {CheckboxModule} from 'primeng/primeng';
@NgModule({
  declarations: [
    AdjustmentReasonsComponent ,
    AdjustmentReasonsNewComponent,
    AdjustmentReasonsViewComponent

  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    routing
  ],
  exports : [AdjustmentReasonsComponent],
   providers: [GridComponent, FormvalidationService]

})
export class AdjustmentReasonsModule { }
