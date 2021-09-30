import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule} from '@angular/material/dialog';
import { TableauReportsRoutesModule } from './tableu-reports.routes';
import { TableuReportsComponent } from './tableu-reports.component';
import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';
@NgModule({
  declarations: [TableuReportsComponent, PreviewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TableauReportsRoutesModule
  ],
  entryComponents: [PreviewDialogComponent]
})
export class TableuReportsModule { }
