import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTourViewComponent } from './user-tour-view/user-tour-view.component';

const routes: Routes = [{ path: '', component: UserTourViewComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTourRoutingModule { }
