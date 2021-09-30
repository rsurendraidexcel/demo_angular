import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { QuickbooksComponent } from './quickbooks/quickbooks.component';
import { ActionButtonComponent } from './quickbooks/action-button/action-button.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [QuickbooksComponent, ActionButtonComponent],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    CommonComponentModule,
    AgGridModule.withComponents([
      ActionButtonComponent
  ]),
  ]
})
export class IntegrationsModule { }
