import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalSettingComponent } from './global-setting.component';
import { routing } from './global-setting.routing';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { MessagesModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    GlobalSettingComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    CheckboxModule
  ],
  exports: [GlobalSettingComponent],
  providers: [GridComponent]
})
export class GlobalSettingModule { }
