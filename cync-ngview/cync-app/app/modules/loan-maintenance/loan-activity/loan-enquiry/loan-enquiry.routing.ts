import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkExportComponent } from './bulk-export/bulk-export.component';
const routes: Routes = [
    { path: '', redirectTo: 'loan-enquiry', pathMatch: 'full' },
    { path: 'bulk-export', component: BulkExportComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
