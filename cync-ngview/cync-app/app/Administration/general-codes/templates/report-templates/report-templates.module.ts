import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTemplatesComponent } from '../report-templates/report-templates.component';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonComponentModule } from '@cyncCommon//component/common.component.module';
import { routing } from './report-templates.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule,CheckboxModule } from 'primeng/primeng';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { CyncTextEditorComponent } from '@cyncCommon//component/cync-text-editor/cync-text-editor.component';
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service'
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,CheckboxModule,
    CommonComponentModule,
    routing,
    RouterModule,
    HttpModule,
    DragulaModule.forRoot()
  ],
  declarations: [ReportTemplatesComponent],
  exports: [ReportTemplatesComponent],
  providers: [GridComponent, CyncTextEditorComponent]
})
export class ReportTemplatesModule { }
