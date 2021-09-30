import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalGuarantorsComponent } from './list-personal-guarantors/personal-guarantors.component';
import { PersonalGuarantorsAddComponent } from './manage-personal-guarantors/add-personal-guarantors.component';

const routes: Routes = [
  { path: '', component:  PersonalGuarantorsComponent},
  { path: 'add', component:  PersonalGuarantorsAddComponent},
  { path: ':id', component:  PersonalGuarantorsAddComponent},

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);