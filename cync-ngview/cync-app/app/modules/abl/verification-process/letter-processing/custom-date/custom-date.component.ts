// import {Component, ElementRef, ViewChild} from '@angular/core';
// import flatpickr from "flatpickr";

// @Component({
//   selector: 'app-custom-date',
//   templateUrl: './custom-date.component.html',
//   styleUrls: ['./custom-date.component.scss']
// })
// export class CustomDateComponent {
//   @ViewChild("flatpickrEl", {read: ElementRef}) flatpickrEl: ElementRef;
//   private date: Date;
//   private params: any;
//   private picker: any;

//   agInit(params: any): void {
//       this.params = params;
//   }

//   ngAfterViewInit(): void {
//       // outputs `I am span`
//       this.picker = flatpickr(this.flatpickrEl.nativeElement, {
//           onChange: this.onDateChanged.bind(this),
//           wrap: true,
//           dateFormat: 'm/d/Y'
//       });

//       this.picker.calendarContainer.classList.add('ag-custom-component-popup');
//   }

//   ngOnDestroy() {
//       console.log(`Destroying DateComponent`);
//   }

//   onDateChanged(selectedDates) {
//       this.date = selectedDates[0] || null;
//       this.params.onDateChanged();
//   }

//   getDate(): Date {
//       return this.date;
//   }

//   setDate(date: Date): void {
//      this.date = date || null;
//      this.picker.setDate(date);
//   }
// }
