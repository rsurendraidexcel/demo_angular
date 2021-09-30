import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'cync-edit-button',
  template: `<button class="tour-button btn-border-corner" (click)="onClick_editStep()">Edit</button> <button class="tour-button btn-border-corner" (click)="onClick_delStep()">Delete</button>`,
  styles: [`
    .tour-button{
      padding:0px 15px;
      background:  #e4e3e5;
      border: 1px solid #aaaaaa;
     }
    .btn-border-corner {
      cursor: pointer;
      border-radius:15px;
      margin:0px 4px;
  }
  `]
})
export class EditButtonComponent implements OnInit {
  paramsData: any;
  constructor() { }
  ngOnInit() {}
  
  agInit(params: any): void {
    this.paramsData = params;
  }

  onClick_editStep() {
    console.log("Edit rows", this.paramsData.data);
    this.paramsData.context.tourComponent.onOpenEditStepForm(this.paramsData.data);
  }
  onClick_delStep() {
    console.log('delate Rows', this.paramsData.data);
    this.paramsData.context.tourComponent.deleteTourStep(this.paramsData.data);
  }
}