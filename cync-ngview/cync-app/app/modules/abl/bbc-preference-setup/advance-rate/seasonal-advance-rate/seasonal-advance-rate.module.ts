import { NgModule } from '@angular/core';
import { CommonModule} from "@angular/common";
import { RouterModule} from '@angular/router';
import { routing } from "./seasonal-advance-rate.routing";
import { SeasonalAdvanceRateComponent } from './seasonal-advance-rate.component';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ListSeasonalAdvanceRateComponent } from './list-seasonal-advance-rate/list-seasonal-advance-rate.component';
import { ManageSeasonalAdvanceRateComponent } from './manage-seasonal-advance-rate/manage-seasonal-advance-rate.component';
import { SeasonalAdvanceRateService } from './service/seasonal-advance-rate.service';
import { CheckboxModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, DialogModule, RadioButtonModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    SeasonalAdvanceRateComponent,
    ListSeasonalAdvanceRateComponent,
    ManageSeasonalAdvanceRateComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    SharedModule,
    RadioButtonModule
  ],
  exports : [SeasonalAdvanceRateComponent],
  providers: [GridComponent, FormvalidationService, SeasonalAdvanceRateService]
 
}) 
export class SeasonalAdvanceRateModule { }