import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LetterTemplatesComponent } from '@app/Administration/general-codes/content/letter-templates/letter-templates.component';

const routes: Routes = [
  { path: '', component: LetterTemplatesComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);