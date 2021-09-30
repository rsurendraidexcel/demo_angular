import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesComponent } from './templates.component';
import { routing } from './templates.component.routing';
import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { MessagesModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { CyncTextEditorComponent } from '../../../../app-common/component/cync-text-editor/cync-text-editor.component';


@NgModule({
  declarations: [
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    CheckboxModule,
    AutoCompleteModule,
    RadioButtonModule
  ],
  exports: [TemplatesComponent],
  providers: [GridComponent, CyncTextEditorComponent,]
})
export class templatesModule { }
