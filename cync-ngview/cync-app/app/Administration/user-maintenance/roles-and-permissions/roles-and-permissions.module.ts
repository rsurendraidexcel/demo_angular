import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './roles-and-permissions.routing';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import {CheckboxModule} from 'primeng/primeng';

@NgModule({
  declarations: [RolesAndPermissionsComponent],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule
  ],
  exports : [RolesAndPermissionsComponent],
  providers: [GridComponent]
}) 
export class RolesAndPermissionsModule{

}
