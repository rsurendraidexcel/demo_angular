import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerCommissionComponent } from './broker-commission/broker-commission.component';
import { AgGridModule } from 'ag-grid-angular';
import { brokerRouting } from './brokers.routing';
import { BrokerService } from './service/broker.service';
import { DialogModule } from 'primeng/primeng';
import { MatDialogModule } from '@angular/material/dialog';
import { BrokerLinkComponent } from './broker-commission/sub-component/broker-link/broker-link.component';
import { BrokerCommissionDetailComponent } from './broker-commission/sub-component/broker-commission-detail/broker-commission-detail.component';
import { BrokerInquiryComponent } from './broker-inquiry/broker-inquiry.component';


@NgModule({
  declarations: [BrokerCommissionComponent, BrokerLinkComponent, BrokerCommissionDetailComponent,BrokerInquiryComponent],
  imports: [
    brokerRouting,
    DialogModule,
    CommonModule,
    MatDialogModule,
    AgGridModule.withComponents([BrokerLinkComponent])
  ],
  entryComponents: [
    BrokerCommissionDetailComponent,
  ],
  providers: [BrokerService]

})
export class BrokersModule { }
