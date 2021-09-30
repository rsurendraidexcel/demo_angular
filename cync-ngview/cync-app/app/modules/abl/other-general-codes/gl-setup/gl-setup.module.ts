import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './gl-setup.routing';
import { GlSetUpComponent } from './gl-setup.component';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { MessagesModule } from 'primeng/primeng';
import { AblGlSetupViewComponent } from './gl-setup.view.component';
import { AblGlSetupEditComponent } from './gl-setup.edit.component';

@NgModule({
  declarations: [
    GlSetUpComponent,
    AblGlSetupViewComponent,
    AblGlSetupEditComponent

  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule
  ],
  exports: [GlSetUpComponent],
  providers: [GridComponent, FormvalidationService]
})
export class GlSetupModule { }
