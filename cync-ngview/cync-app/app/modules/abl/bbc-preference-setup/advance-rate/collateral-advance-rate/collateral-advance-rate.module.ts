import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from "./collateral-advance-rate.routing";
import { CollateralAdvanceRateComponent } from './collateral-advance-rate.component';
import { CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ListCollateralAdvanceRateComponent } from './list-collateral-advance-rate/list-collateral-advance-rate.component';
import { ManageCollateralAdvanceRateComponent } from './manage-collateral-advance-rate/manage-collateral-advance-rate.component';
import { ManageCollateralAdvanceDivisionComponent } from './manage-collateral-advance-division/manage-collateral-advance-division.component';
import { RadioButtonModule , CheckboxModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, DialogModule } from 'primeng/primeng';
import { CollateralAdvanceRateService } from './service/collateral-advance-rate.service';

@NgModule({
  declarations: [
    CollateralAdvanceRateComponent,
    ListCollateralAdvanceRateComponent,
    ManageCollateralAdvanceRateComponent,
    ManageCollateralAdvanceDivisionComponent,
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing,
    CheckboxModule,
    RadioButtonModule,
    DataTableModule,
    DialogModule,
    SharedModule
  ],
  exports : [CollateralAdvanceRateComponent],
  providers: [GridComponent, FormvalidationService, CollateralAdvanceRateService]
 
}) 
export class CollateralAdvanceRateModule { }
