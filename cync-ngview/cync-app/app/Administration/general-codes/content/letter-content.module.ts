import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { routing } from './letter-content.routing';
import { LetterContentComponent } from './letter-content.component';
import { RadioButtonModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { HttpModule } from '@angular/http';
import { CyncTextEditorComponent } from '../../../../app-common/component/cync-text-editor/cync-text-editor.component';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { DialogModule } from 'primeng/primeng';
import { LetterNamesComponent } from './letter-names/letter-names.component';
//import { CustomTooltip } from '@cyncCommon/component/custom-tooltip/custom-tooltip.component'
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
//import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    RouterModule,
    HttpModule,
    CommonModule,
    routing,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule,
    MessagesModule,
    DialogModule,
    CommonComponentModule,
    //AgGridModule.withComponents([])
  ],
  declarations: [
    LetterContentComponent,
    LetterNamesComponent
  ],
  exports: [
    LetterContentComponent
  ],
  providers: [
    GridComponent,
    CyncTextEditorComponent,
    FormvalidationService
  ]
})
export class LetterContentModule { }
