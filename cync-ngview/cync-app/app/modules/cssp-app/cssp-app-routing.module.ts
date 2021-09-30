import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppcsspComponent } from './cssp-app.component';

const routes: Routes = [
  {
    path: '', component: AppcsspComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsspappRoutingModule { }
