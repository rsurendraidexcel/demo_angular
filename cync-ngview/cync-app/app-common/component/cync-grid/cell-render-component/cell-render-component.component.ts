import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import * as _moment from 'moment';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-cell-render-component',
  templateUrl: './cell-render-component.component.html',
  styleUrls: ['./cell-render-component.component.scss']
})
export class CellRenderComponentComponent implements OnInit, ICellRendererAngularComp {

  params: any;
  name: string;
  ngModuleData: any;
  gridApi: any;
  options: any;
  columnId: any;
  enable: boolean;
  inputType: string;
  buttonText: string;
  buttonStyle: any;
  
  constructor() { }

  ngOnInit() {

  }

  agInit(params: any): void {
    this.params = params;
    this.name = params.name;
    
    if(params.initDisable === true){
      if(params.editable !== false){
        this.enable = true
      }
      else{
        this.enable = false
      }
    }
    else{
      this.enable = false;
    }
    this.inputType = params.inputBoxtype;

    // console.log(';;;;;;;', this.enable);

    this.ngModuleData = this.params.data[this.name]

    if (this.params.type === 'dateinput') {
      this.ngModuleData = moment(this.ngModuleData).format(this.params.dateFormat);
    }

    if (this.params.type === 'link') {
      // console.log(this.ngModuleData)
    }

    if (this.params.options) {
      this.options = this.params.options;
    }

    // button configration

    this.buttonText = params.buttonText;
    this.buttonStyle = params.buttonStyle;
    
    // console.log(this.buttonStyle);
  }

  buttonFn(params){
    return this.params.buttonFunction(params);
   }

  refresh(): boolean {
    return false;
  }
}
