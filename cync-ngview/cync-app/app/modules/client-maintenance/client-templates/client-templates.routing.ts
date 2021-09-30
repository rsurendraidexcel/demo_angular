import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientTemplateParametersAddComponent } from './client-template-parameters/client-template-parameters-add/client-template-parameters-add.component';

import { ClientTemplatesComponent } from './client-templates.component';
import { IneligibleCalculationsComponent } from './ineligible-calculations/ineligible-calculations.component';
import { BasicParametersComponent } from './basic-parameters/basic-parameters.component';
import { ClientTemplateParametersComponent } from './client-template-parameters/client-template-parameters.component';
import { ClientTemplateParametersEditComponent } from './client-template-parameters/client-template-parameters-edit/client-template-parameters-edit.component';
import { ClientTemplateParametersCopyComponent } from './client-template-parameters/client-template-parameters-copy/client-template-parameters-copy.component';
import { MultipleClientAssignComponent } from './multiple-client-assign/multiple-client-assign.component';
import { TestpageComponent } from './testpage/testpage.component';

const routes: Routes = [
  { path: '', component: ClientTemplatesComponent },
  { path: 'basic-parameters', component: BasicParametersComponent },
  { path: 'ineligible-calculations', component: IneligibleCalculationsComponent },
  { path: 'client-parameters', component: ClientTemplateParametersComponent },
  { path: 'client-parameters/:id', component: ClientTemplateParametersComponent },
  { path: 'add-client-parameters', component: ClientTemplateParametersAddComponent },
  { path: 'edit-client-parameters/:id', component: ClientTemplateParametersEditComponent },
  { path: 'clone-client-parameters/:id', component: ClientTemplateParametersCopyComponent },
  { path: 'multiple-client-assign/:id', component: MultipleClientAssignComponent},
  { path: 'multiple-client-assign/assigned', component: MultipleClientAssignComponent},
  { path: 'test_page', component: TestpageComponent}
  ]

export const clientTemplatesRoute: ModuleWithProviders = RouterModule.forChild(routes);