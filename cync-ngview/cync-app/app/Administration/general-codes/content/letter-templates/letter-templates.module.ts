import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './letter-templates.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule, DataTableModule, SharedModule, DialogModule, TooltipModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { OverlayPanelModule, CalendarModule } from 'primeng/primeng';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LetterTemplatesComponent } from './letter-templates.component';
import { CyncTextEditorComponent } from '../../../../../app-common/component/cync-text-editor/cync-text-editor.component';
import { CheckPermissionsService } from '../../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { CommonComponentModule } from '../../../../../app-common/component/common.component.module';
import { RadioButtonModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { GridComponent } from '../../../../../app-common/component/grid/grid.component';
import { HttpModule } from '@angular/http';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { AgGridModule } from 'ag-grid-angular';
import { ResetUserStatusComponent } from './reset-user-status/reset-user-status.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule,
        DataTableModule,
        DialogModule,
        TooltipModule,
        ConfirmDialogModule,
        TabsModule.forRoot(),
        OverlayPanelModule,
        CalendarModule,
        RouterModule,
        HttpModule,
        CommonComponentModule,
        MessagesModule,
        MatDialogModule
    ],
    declarations: [
        LetterTemplatesComponent,
        ResetUserStatusComponent
    ],
    exports: [
        LetterTemplatesComponent
    ],
    entryComponents:[
        ResetUserStatusComponent  
    ],
    providers: [
        CyncTextEditorComponent,
        GridComponent,
        FormvalidationService
    ]
})
export class LetterTemplatesModule { }