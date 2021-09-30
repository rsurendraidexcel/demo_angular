import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterProcessingComponent } from './letter-processing.component';
import { routing } from "./letter-processing.routing";
import { AgGridModule } from 'ag-grid-angular';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {LetterProcessingService} from './service/letter-processing.service'
import { FormsModule } from '@angular/forms';
import { CalendarModule} from 'primeng/primeng';
import { DateRendererComponent } from './date-renderer/date-renderer.component';
//import { CustomDateComponent } from './custom-date/custom-date.component';
import {MatDatepickerModule,MatDatepickerInputEvent,MatNativeDateModule,MatInputModule} from '@angular/material';
import { DatePipe } from '@angular/common';

// import {
//   MatDatepickerModule,
//   MatInputModule,
//   MatNativeDateModule,
// } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    routing,
    AgGridModule.withComponents([]),
    TabsModule.forRoot(),
    FormsModule,
    CalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule  ],
  declarations: [LetterProcessingComponent, DateRendererComponent],
  exports : [LetterProcessingComponent],
  providers:
    [
      LetterProcessingService, DatePipe
    ],
    entryComponents: [ DateRendererComponent],
})
export class LetterProcessingModule { }