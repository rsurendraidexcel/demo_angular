import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-cellrenderexample',
  templateUrl: './cellrenderexample.component.html',
  styleUrls: ['./cellrenderexample.component.scss']
})
export class CellrenderexampleComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  constructor() { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

}
