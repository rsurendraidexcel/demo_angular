import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular';
import { RollForwardInquiryComponent } from './roll-forward-inquiry/roll-forward-inquiry.component';
import { rollInquiryRoutes } from './roll-forward-inquiry-routing';
import { RollForwardEnquiryService } from './roll-forward-enquiry.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RollForwardInquiryComponent],
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    rollInquiryRoutes,
    AgGridModule.withComponents([])
  ],
  exports: [
    RollForwardInquiryComponent
  ],
  providers: [
    RollForwardEnquiryService
  ],
  schemas:
    [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class RollForwardInquiryModule { }
