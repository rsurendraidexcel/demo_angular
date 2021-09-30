import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LetterProcessingComponent } from './letter-processing.component';



const routes: Routes = [
  { path: '', component:  LetterProcessingComponent}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);