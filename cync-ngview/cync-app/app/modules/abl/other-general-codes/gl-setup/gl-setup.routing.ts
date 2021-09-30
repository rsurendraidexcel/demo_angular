import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlSetUpComponent } from './gl-setup.component';
import { AblGlSetupViewComponent } from './gl-setup.view.component';
import { AblGlSetupEditComponent } from './gl-setup.edit.component';

const routes: Routes = [
  { path: '', component:  GlSetUpComponent },
  { path: 'view/:id', component:  AblGlSetupViewComponent },
  { path: ':id', component:  AblGlSetupEditComponent }

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
