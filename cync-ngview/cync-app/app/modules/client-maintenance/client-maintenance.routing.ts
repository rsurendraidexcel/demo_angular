import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientMaintenanceComponent } from './client-maintenance.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  {
    path: '', component: ClientMaintenanceComponent, children: [
      { path: 'clients', loadChildren: './clients/clients.module#ClientsModule' },
      { path: 'client-transactions', loadChildren: './client-transactions/client-transaction.module#ClientTransactionModule' },
      { path: 'purge-inactive-clients', loadChildren: './purge-inactive-clients/purge-inactive-clients.module#PurgeInactiveClientsModule' },
      { path: 'client-loan-terms', loadChildren: "./client-loan-terms/client-loan-terms.module#ClientLoanTermsModule", canActivate: [CheckClientSelection] },
      { path: 'client-templates', loadChildren: './client-templates/client-templates.module#ClientTemplatesModule' },
      { path: 'factoring-parameters', loadChildren: './factoring-parameters/factoring-parameters.module#FactoringParametersModule', canActivate: [CheckClientSelection] },
      { path:  'client-parameters', loadChildren:'./client-parameters/client-parameters.module#ClientParametersModule'},
      { path:  'integration', loadChildren:'./integrations/integrations.module#IntegrationsModule'}
    ]
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);