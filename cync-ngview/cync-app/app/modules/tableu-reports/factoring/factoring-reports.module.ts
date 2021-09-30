import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule} from '@angular/material/dialog';
import { FactReportsComponent } from './fact-reports/fact-reports.component';
import { FactoringRouteModule } from './factoring-routes.module';
import { FactReportsService } from './fact-reports.services';
@NgModule({
  declarations: [ FactReportsComponent],
  imports: [
    CommonModule,
    FactoringRouteModule,
    MatDialogModule
  ],
  entryComponents: [FactReportsComponent],
  providers:[FactReportsService]
})
export class FactoringReportsModule { }
