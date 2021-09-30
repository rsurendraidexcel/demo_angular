import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-cross-age-grid-input',
  templateUrl: './cross-age-grid-input.component.html',
  styleUrls: ['./cross-age-grid-input.component.scss']
})
export class CrossAgeGridInputComponent implements OnInit,  ICellRendererAngularComp {
  params: any;
  adjustmentValue: any;
  constructor() { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.params = params;
    this.adjustmentValue = params.data.based_on;
  }

	onAdjustmentReasonChange(event: any) {
    this.params.data.edited = true;
    this.params.data.based_on = event.target.value
    this.params.context.componentCheck.basedOnValueChanged(this.params.data);
	}

  refresh(): boolean {
    return false;
  }


}
