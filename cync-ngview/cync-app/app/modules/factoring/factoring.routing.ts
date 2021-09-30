import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FactoringComponent } from './factoring.component';
import { CyncGridComponent} from 'app-common/component/cync-grid/cync-grid.component'

import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';
const FactoringRoutes: Routes = [
	{
		path: '', component: FactoringComponent, children: [
			{ path: 'credit-queue', loadChildren: './credit-queue/credit-queue.module#CreditQueueModule' },
			{ path: 'term-codes', loadChildren: './maintenance/term-codes/term-codes.module#TermCodesModule' },
			{ path: 'brokers', loadChildren: './brokers/brokers.module#BrokersModule'},
			{ path: 'invoice-validation', loadChildren: './maintenance/invoice-validation-template/invoice-validation-template.module#InvoiceValidationModule' }
		]	
	},
	{ path: 'transaction-logs', loadChildren: './transaction-logs/transaction-logs.module#TransactionLogsModule', canActivate: [CheckClientSelection]},
	{ path: 'processing', loadChildren: './processing/processing.module#ProcessingModule'}
];
@NgModule({
  imports: [RouterModule.forChild(FactoringRoutes)],
  exports: [RouterModule]
})
export class FactoringRoutingModule { }
