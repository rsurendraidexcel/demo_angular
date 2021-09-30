import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessingComponent } from './processing.component';
import { InterestStatementComponent } from './interest-statement/interest-statement.component';
import { ProcessingService } from './services/processing-service';
import { ProcessingRoutingModule } from './processing-routing-module';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule} from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular';
import { AdjustmentEntryComponent } from './interest-statement/adjustment-entry/adjustment-entry.component';
import { MatDialogModule } from '@angular/material';
import { InterestStatementDetailsComponent } from './interest-statement/interest-statement-details/interest-statement-details.component';
import { TransactionTypeLinkComponent } from './interest-statement/transaction-type-link/transaction-type-link.component';

@NgModule({
  declarations: [ProcessingComponent, InterestStatementComponent, AdjustmentEntryComponent, InterestStatementDetailsComponent, TransactionTypeLinkComponent],
  imports: [
    CommonModule,
    ProcessingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule,
    HttpClientModule,
    CalendarModule, 
    MatDialogModule,
    AgGridModule.withComponents([TransactionTypeLinkComponent]) 
  ],
  entryComponents: [
    AdjustmentEntryComponent,
    InterestStatementDetailsComponent
  ],
  exports:[ProcessingComponent],
  providers:[ProcessingService]
})
export class ProcessingModule { }
