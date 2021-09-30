import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./document-compliance-reporting.routing";
import { DocumentComplianceReporting } from './document-compliance-reporting.component';
import {CommonComponentModule} from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
  declarations: [
    DocumentComplianceReporting
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [DocumentComplianceReporting],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class DocumentComplianceReportingModule { }
