import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrokerCommissionComponent } from './broker-commission/broker-commission.component';
import { BrokerInquiryComponent } from './broker-inquiry/broker-inquiry.component';

const routes: Routes = [
  { path: 'broker-commission', component:  BrokerCommissionComponent},
  { path: 'broker-inquiry', component:  BrokerInquiryComponent}
];
export const brokerRouting: ModuleWithProviders = RouterModule.forChild(routes);