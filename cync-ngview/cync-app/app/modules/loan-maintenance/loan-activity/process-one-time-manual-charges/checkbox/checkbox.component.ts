import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  disabledCbox: boolean = true;
  constructor() { }

  ngOnInit() {
  
  }

  agInit(params: any): void {
    if(params.data.process === false || params.editable){
      this.disabledCbox = true;
    }
    else{
      this.disabledCbox = false;
    }
    
  
    this.params = params;
  }
  
  onChange(event : any) {
      if(event.target.checked === true){
        this.params.data.checkbox = true;
      }
     else{
      this.params.data.checkbox = false;
     }
    // this.params.data.ageing = event.target.checked;
   // this.params.context.componentCheck.onAgingChanged(this.params.data);
    }

  refresh(): boolean {
    return false;
  }

}
