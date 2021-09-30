import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';
import { InterestStatementComponent } from './interest-statement/interest-statement.component';
import { ProcessingComponent } from './processing.component';

const ProcessingRoutes: Routes = [
  {path: '', component: ProcessingComponent},
	{path: 'interest-inquiry', component: InterestStatementComponent, canActivate: [CheckClientSelection]}
 ];

@NgModule({
  imports: [RouterModule.forChild(ProcessingRoutes)],
  exports: [RouterModule]
})
export class ProcessingRoutingModule { }
