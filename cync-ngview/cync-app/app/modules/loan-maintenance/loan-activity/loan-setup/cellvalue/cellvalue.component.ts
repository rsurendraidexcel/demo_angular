import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { LoanSetupService } from '../service/loan-setup.service';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-cellvalue',
  templateUrl: './cellvalue.component.html',
  styleUrls: ['./cellvalue.component.scss']
})
export class CellvalueComponent {
  params: any;
  value: any;

  constructor(
    private loanSetupService: LoanSetupService,
    public helper: Helper
  ) { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.params = params;
    this.value =Number(params.data.value).toFixed(2);
  }

  onChange(event: any) {
    this.params.data.value = event.target.value;
    this.params.context.componentCheck.onValueChanged(this.params);
  }

   onEnterSubmit() {
    this.params.context.componentCheck.onClickSave();
   }

}


