import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundsEmployedComponent } from './funds-employed/funds-employed.component';

const routes: Routes = [
   { path: 'funds-employed', component: FundsEmployedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionLogRoutingModule { }
