import { Component, ElementRef, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent  {
    @ViewChild("flatpickrEl", { read: ElementRef }) flatpickrEl: ElementRef;
    private date: Date;
    private params: any;
    private picker: any;
    agInit(params: any): void {
        this.params = params;
    }
    ngAfterViewInit(): void {
        this.picker = flatpickr(this.flatpickrEl.nativeElement, {
            onChange: this.onDateChanged.bind(this),
            wrap: true,
            dateFormat: 'm/d/Y',
            allowInput: true,
        });
        this.picker.calendarContainer.classList.add('ag-custom-component-popup');
    }
    ngOnDestroy() {
    }
    onDateChanged(selectedDates: any) {
        this.date = selectedDates[0] || null;
        this.params.onDateChanged();
    }
    getDate(): Date {
        return this.date;
    }
    setDate(date: Date): void {
        this.date = date || null;
        this.picker.setDate(date);
    }
}
