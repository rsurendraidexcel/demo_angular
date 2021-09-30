import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './letter-names.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule, DataTableModule, SharedModule, DialogModule, TooltipModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { OverlayPanelModule, CalendarModule } from 'primeng/primeng';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LetterNamesComponent } from './letter-names.component';
import { ListLetterNamesComponent } from './list-letter-names/list-letter-names.component';
import { ManageLetterNamesComponent } from './manage-letter-names/manage-letter-names.component';
import { LetterNamesService } from './service/letter-names.service';
import { AgGridModule } from 'ag-grid-angular';

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
    OverlayPanelModule, CalendarModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    ListLetterNamesComponent,
    ManageLetterNamesComponent
  ],
  exports: [
    ListLetterNamesComponent,
    ManageLetterNamesComponent],
  providers: [
    LetterNamesService]
})
export class LetterNamesModule { }