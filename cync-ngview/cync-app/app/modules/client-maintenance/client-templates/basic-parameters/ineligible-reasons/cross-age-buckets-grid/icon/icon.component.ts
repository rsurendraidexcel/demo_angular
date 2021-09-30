import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  constructor() { }

  ngOnInit() {
  }

  agInit(params: any) {
    this.params = params;
  }

  onClickSave()
  {
   this.params.context.componentCheck.onSaveData(this.params.data);
  }

  onResetClick()
  {
    this.params.context.componentCheck.onResetData(this.params);
  }

  refresh(): boolean {
    return false;
  }

}
