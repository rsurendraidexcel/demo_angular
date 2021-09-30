import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowProjectHighlightsComponent } from './show-project-highlights/show-project-highlights.component';

const routes: Routes = [
	{ path: ':id', component: ShowProjectHighlightsComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
