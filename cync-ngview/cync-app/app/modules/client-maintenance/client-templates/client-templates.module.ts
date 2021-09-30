import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientTemplatesComponent } from './client-templates.component';
import { clientTemplatesRoute } from './client-templates.routing';
import { BasicParametersComponent } from './basic-parameters/basic-parameters.component';
import { IneligibleCalculationsComponent } from './ineligible-calculations/ineligible-calculations.component';
import { BucketAgingComponent } from './bucket-aging/bucket-aging.component';
import { BBCOthersComponent } from './basic-parameters/bbc-others/bbc-others.component';
import { OverAdvanceComponent } from './basic-parameters/over-advance/over-advance.component';
import { FinancialsComponent } from './basic-parameters/financials/financials.component';
import { ReportPreferencesComponent } from './basic-parameters/report-preferences/report-preferences.component';
import { SubLimitsComponent } from './basic-parameters/sub-limits/sub-limits.component';
import { IneligibleReasonsComponent } from './basic-parameters/ineligible-reasons/ineligible-reasons.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AgGridModule } from 'ag-grid-angular';
import { RollforwardsComponent } from './basic-parameters/rollforwards/rollforwards.component';
import { ClientTemplateParametersComponent } from './client-template-parameters/client-template-parameters.component';
import { InventoryParametersComponent } from './basic-parameters/inventory-parameters/inventory-parameters.component';
import { CrossAgeBucketsGridComponent } from './basic-parameters/ineligible-reasons/cross-age-buckets-grid/cross-age-buckets-grid.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientTemplateParametersAddComponent } from './client-template-parameters/client-template-parameters-add/client-template-parameters-add.component';
import { ClientTemplateParametersEditComponent } from './client-template-parameters/client-template-parameters-edit/client-template-parameters-edit.component';
import { DropdownModule, ButtonModule, PickListModule } from 'primeng/primeng';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { TemplateViewLinkFunctionComponent } from './template-view-link-function/template-view-link-function.component';
import { ClientTemplateParametersCopyComponent } from './client-template-parameters/client-template-parameters-copy/client-template-parameters-copy.component';
import { GetCloneTemplateNameComponent } from './get-clone-template-name/get-clone-template-name.component';
import { MatFormFieldModule } from '@angular/material/form-field'
import { ButtonRendererComponent } from './basic-parameters/ineligible-reasons/cross-age-buckets-grid/button-renderer.component';
import { CrossAgeGridInputComponent } from './basic-parameters/ineligible-reasons/cross-age-buckets-grid/cross-age-grid-input/cross-age-grid-input.component';
import { IconComponent } from './basic-parameters/ineligible-reasons/cross-age-buckets-grid/icon/icon.component';
import { CheckboxComponent } from './basic-parameters/ineligible-reasons/cross-age-buckets-grid/checkbox/checkbox.component';
import { MultipleClientAssignComponent } from './multiple-client-assign/multiple-client-assign.component';
import { ClientAssignBasicParameterComponent } from './multiple-client-assign/client-assign-basic-parameter/client-assign-basic-parameter.component';
import { ClientAssignIneligibleCalculationComponent } from './multiple-client-assign/client-assign-ineligible-calculation/client-assign-ineligible-calculation.component';
import { ClientAssignBucketAgingComponent } from './multiple-client-assign/client-assign-bucket-aging/client-assign-bucket-aging.component'
import { MultiSelectModule } from 'primeng/multiselect';
import { AssignClientPopupComponent } from './multiple-client-assign/assign-client-popup/assign-client-popup.component';
import { IneligibleReasonsMultiComponent } from './multiple-client-assign/client-assign-basic-parameter/ineligible-reasons-multi/ineligible-reasons-multi.component';
import { MultiCrossAgeBucketsGridComponent } from './multiple-client-assign/client-assign-basic-parameter/ineligible-reasons-multi/multi-cross-age-buckets-grid/multi-cross-age-buckets-grid.component';
import { MultiCheckboxComponent } from './multiple-client-assign/client-assign-basic-parameter/ineligible-reasons-multi/multi-cross-age-buckets-grid/multi-checkbox/multi-checkbox.component';
import { MultiCrossAgeGridInputComponent } from './multiple-client-assign/client-assign-basic-parameter/ineligible-reasons-multi/multi-cross-age-buckets-grid/multi-cross-age-grid-input/multi-cross-age-grid-input.component';
import { MultiIconComponent } from './multiple-client-assign/client-assign-basic-parameter/ineligible-reasons-multi/multi-cross-age-buckets-grid/multi-icon/multi-icon.component';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { TestpageComponent } from './testpage/testpage.component';
import { CellrenderexampleComponent } from './testpage/cellrenderexample/cellrenderexample.component';


@NgModule({
  declarations: [ClientTemplatesComponent, BasicParametersComponent, IneligibleCalculationsComponent, BucketAgingComponent, BBCOthersComponent, OverAdvanceComponent, FinancialsComponent, ReportPreferencesComponent,
    SubLimitsComponent, IneligibleReasonsComponent,
    RollforwardsComponent, ClientTemplateParametersComponent,
    InventoryParametersComponent, CrossAgeBucketsGridComponent,
    ClientTemplateParametersAddComponent, ClientTemplateParametersEditComponent,
    TemplateViewLinkFunctionComponent, ClientTemplateParametersCopyComponent,
    GetCloneTemplateNameComponent, MultipleClientAssignComponent,
    ClientAssignBasicParameterComponent, ClientAssignIneligibleCalculationComponent,
    ClientAssignBucketAgingComponent,
    AssignClientPopupComponent, ButtonRendererComponent, IconComponent,
    CrossAgeGridInputComponent, CheckboxComponent, IneligibleReasonsMultiComponent, MultiCrossAgeBucketsGridComponent, MultiCheckboxComponent, MultiCrossAgeGridInputComponent, MultiIconComponent, TestpageComponent, CellrenderexampleComponent],
  imports: [
    CommonModule,
    clientTemplatesRoute,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    AngularDualListBoxModule,
    AgGridModule.withComponents([ButtonRendererComponent, IconComponent, CrossAgeGridInputComponent, CheckboxComponent,  MultiCheckboxComponent, MultiCrossAgeGridInputComponent, MultiIconComponent, CellrenderexampleComponent]),
    MatDialogModule,
    DropdownModule,
    ButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatListModule,
    HttpClientModule,
    PickListModule,
    MultiSelectModule,
    CommonComponentModule
  ],
  entryComponents: [CrossAgeBucketsGridComponent, TemplateViewLinkFunctionComponent,
    GetCloneTemplateNameComponent, AssignClientPopupComponent, MultiCrossAgeBucketsGridComponent]
})
export class ClientTemplatesModule { }
