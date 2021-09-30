import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-assets-inventory-date',
  templateUrl: './assets-inventory-date.component.html',
  styleUrls: ['./assets-inventory-date.component.scss']
})
export class AssetsInventoryDateComponent implements OnInit, ICellRendererAngularComp {
  current_date: Date;
  params: any;
  adjustmentValue: any;
  from_date;
  hidePdate:boolean = true;
  hideNone:boolean = false
  hideBlank:boolean = false
  editable: boolean = true;
  constructor(private _helper: Helper) { 

    this.current_date = new Date(this._helper.convertDateToString(new Date()));
  }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.editable = params.editable;
    if(params.value==="Totals"){
      this.hidePdate = false;
      this.hideNone = true;
    }
    if(params.value===null){
      this.hidePdate = false;
      this.hideNone = false;
      this.hideBlank = true;
    }
    this.params = params;
    console.log(this.params.value)
    this.from_date = new Date(this.params.value);
  }

  fromDateSelectMethod(event:any){
    this.adjustmentValue = event;
    this.params.context.componentCheck.basedOnValueChanged(this.adjustmentValue);

  }

  refresh(): boolean {
    return false;
  }

}
