
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './loan-activity.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CalendarModule, CheckboxModule, TooltipModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular';
import { GrowlModule } from 'primeng/primeng';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';

import { LoanEnquiryComponent } from './loan-enquiry/loan-enquiry.component';
import { LoanActivityComponent } from './loan-activity.component';
import { LoanEnquiryService } from './loan-enquiry/loan-enquiry.service';
import { CustomDatePickerComponent } from './loan-enquiry/custom-datepicker.component';
import { CheckImageComponent } from './loan-enquiry/check-images/check-images-component';
import { LoanSummaryComponent } from './loan-summary/loan-summary.component';
import { CustomDatePickerComponentLoanSummary } from './loan-summary/custom-datepicker/custom-datepicker.component';
import { LoanSummaryService } from './loan-summary/loan-summary.service';
import { LoanDocumentComponent } from './loan-summary/loan-document/loan-document.component';
import { FromToDateSearchComponent } from '@cyncCommon/component/from-to-date-search/from-to-date-search.component';
import { CustomStatusBarComponent } from './loan-enquiry/custom-status-bar.component';

import { BulkExportComponent } from './loan-enquiry/bulk-export/bulk-export.component';
import { BulkExportDownloadComponent } from './loan-enquiry/bulk-export/bulk-export-download/bulk-export-download.component';

import { LoanSetupComponent } from './loan-setup/loan-setup/loan-setup.component';
import { LoanAddNewComponent } from './loan-setup/loan-add-new/loan-add-new.component';
import { InterestDetailComponent } from './loan-setup/interest-detail/interest-detail.component';
import { DatepickerComponent } from './loan-setup/subcomponents/datepicker.component';
import { DateRendererComponent } from './loan-setup/date-renderer/date-renderer.component';

import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {
	MatListModule,
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatSidenavModule,
	MatBottomSheetModule,
	MatTableModule,MatPaginatorModule,DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,  MatSortModule,
} from '@angular/material';
import { CellvalueComponent } from './loan-setup/cellvalue/cellvalue.component';


import { ProcessOneTimeManualChargesComponent } from './process-one-time-manual-charges/process-one-time-manual-charges.component';
import { CheckboxComponent } from './process-one-time-manual-charges/checkbox/checkbox.component';
const lk = "CompanyName=Idexcel Inc,LicensedApplication=cyncsoftware.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-014872,ExpiryDate=9_May_2022_[v2]_MTY1MjA1MDgwMDAwMA==142d6d0d65dc8afb5d9d8a1bf32f0cc0";
LicenseManager.setLicenseKey(lk);

@NgModule({
    declarations: [
        LoanEnquiryComponent,
        LoanActivityComponent,
        CustomDatePickerComponent,
        CheckImageComponent,
        LoanSummaryComponent,
        CustomDatePickerComponentLoanSummary,
        LoanDocumentComponent,
        FromToDateSearchComponent,
        CustomStatusBarComponent,
        BulkExportComponent,
        BulkExportDownloadComponent,
        LoanSetupComponent,
        LoanAddNewComponent,
        InterestDetailComponent,
        DatepickerComponent,
        DateRendererComponent,
        CellvalueComponent,
        ProcessOneTimeManualChargesComponent,
        CheckboxComponent
    ],
    imports: [
        CommonModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        CheckboxModule,
        TooltipModule,
        MatDialogModule,
        MatButtonModule,
        AgGridModule.withComponents([
            CustomDatePickerComponent,
            CustomDatePickerComponentLoanSummary,
            CustomStatusBarComponent,
            BulkExportDownloadComponent,
            DatepickerComponent,
            DateRendererComponent,
            CheckboxComponent
        ]),
        GrowlModule,
        MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSidenavModule,
		MatListModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatTableModule,
        MatPaginatorModule,MatSortModule,
     
    ],
    entryComponents: [
        CheckImageComponent,
        LoanDocumentComponent,
        BulkExportDownloadComponent,
        LoanAddNewComponent,
        InterestDetailComponent,
        CellvalueComponent
       
    ],
    exports: [
        LoanEnquiryComponent,
        LoanActivityComponent,
        CheckImageComponent,
        LoanSummaryComponent,
        LoanDocumentComponent,
        LoanAddNewComponent,
        InterestDetailComponent,
        CellvalueComponent
      
    ],
    providers: [
        LoanEnquiryService,
        LoanSummaryService,
        // MatDatepickerModule,
		// MatSidenavModule,
		// MatBottomSheetModule,
		// MatButtonModule
    ]
})
export class LoanActivityModule { }
