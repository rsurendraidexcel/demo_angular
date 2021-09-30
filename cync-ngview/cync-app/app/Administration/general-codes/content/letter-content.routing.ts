import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LetterContentComponent } from './letter-content.component';

const routes: Routes = [
      { path: '', redirectTo: 'letter-templates', pathMatch: 'full' },
      { path: 'letter-names', loadChildren: './letter-names/letter-names.module#LetterNamesModule' },
      { path: 'letter-templates', loadChildren: './letter-templates/letter-templates.module#LetterTemplatesModule' }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);