import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSettingComponent } from './user-setting.component';
import { routing } from './user-setting.routing';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { MessagesModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    UserSettingComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    CheckboxModule,
    AutoCompleteModule
  ],
  exports: [UserSettingComponent],
  providers: []
})
export class UserSettingModule { }
