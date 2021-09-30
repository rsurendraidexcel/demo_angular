import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleSettingComponent } from './role-setting.component';
import { routing } from './role-setting.routing';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { MessagesModule, AutoCompleteModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    RoleSettingComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    MessagesModule,
    CheckboxModule
  ],
  exports: [RoleSettingComponent],
  providers: [GridComponent]
})
export class RoleSettingModule { }
