import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CalendarModule } from 'primeng/primeng';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-renderer',
  templateUrl: './date-renderer.component.html',
  styleUrls: ['./date-renderer.component.scss']
})
export class DateRendererComponent implements OnInit {

  dateValue: Date;
  events: string[] = [];
  params: any;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
  }

  agInit(params) {
    this.params = params;
    this.dateValue = new Date(this.params.value);
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.params.value = this.datePipe.transform(event.value, 'MM/dd/yyyy');
    this.params.context.letterProcessingGridContext.onChangeDate(this.params.value, this.params.rowIndex);
  }

}
