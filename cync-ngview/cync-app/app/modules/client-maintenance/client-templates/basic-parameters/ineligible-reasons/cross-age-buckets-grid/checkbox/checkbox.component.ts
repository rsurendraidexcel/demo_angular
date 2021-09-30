import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  constructor() { }

  ngOnInit() {
  
  }

  agInit(params: any): void {
    this.params = params;
  }
  
  onChange(event : any) {
    this.params.data.edited = true;
    this.params.data.ageing = event.target.checked;
    this.params.context.componentCheck.onAgingChanged(this.params.data);
    }

  refresh(): boolean {
    return false;
  }

}
