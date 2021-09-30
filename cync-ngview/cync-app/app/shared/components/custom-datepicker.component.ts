import { Component, ElementRef, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
    selector: 'app-loading-overlay',
    templateUrl: './custom-datepicker.component.html',
    styles: [
        `
        .custom-date-filter a {
            position: relative;
            right: 20px;
            color: rgba(0, 0, 0, 0.54);
            cursor: pointer;
            font-family: sans-serif;
        }
        
        .custom-date-filter:after {
            position: relative;
            content: '\f073';
            display: block;
            font-weight: 400;
            font-family: sans-serif;
            right: 5px;
            pointer-events: none;
            color: rgba(0, 0, 0, 0.54);
        }
        `
    ]
})
export class CustomDatePickerComponent {
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