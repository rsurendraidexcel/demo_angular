import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './client-assignment.routing';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import {ClientAssignmentComponent} from './client-assignment.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { FormsModule } from '@angular/forms';
import {AutoCompleteModule, MultiSelectModule, CheckboxModule} from 'primeng/primeng';
import { FilterByPipe } from './filter.pipe';

@NgModule({
  declarations: [
    ClientAssignmentComponent, FilterByPipe
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    AutoCompleteModule,
    MultiSelectModule,
    CheckboxModule
  ],
  exports : [ClientAssignmentComponent],
  providers: [GridComponent]

})
export class ClientAssignmentModule{

}
