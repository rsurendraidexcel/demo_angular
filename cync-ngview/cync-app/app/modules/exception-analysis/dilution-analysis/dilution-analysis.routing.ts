import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DilutionAnalysisComponent } from './dilution-analysis.component';


const routes: Routes = [
  { path: '', component:  DilutionAnalysisComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);