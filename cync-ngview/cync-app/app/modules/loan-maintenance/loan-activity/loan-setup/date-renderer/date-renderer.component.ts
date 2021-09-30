import { Component, OnInit } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import * as _moment from 'moment';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-date-renderer',
  templateUrl: './date-renderer.component.html',
  styleUrls: ['./date-renderer.component.scss']
})
export class DateRendererComponent  {
  private params: any;
  gridApi: any;
  effective_date: any;
  columnId: any;
  constructor(public _helper: Helper){}

  agInit(params: any): void {
      this.params = params;
      this.effective_date = moment(params.data.effective_date).format('MM/DD/YYYY');
  }
  onChangeDate(date: any) {
            if (date) {			
                    date = moment(date).format('MM/DD/YYYY');
                    this.params.data.effective_date = date;
                    this.params.context.componentCheck.basedOnValueChanged(this.params );
            } else {
              return false;
            }
    }

    onInputDate(event: any){
      console.log(event.target.value);
      if(event.target.value===''){
           this.params.data.effective_date = '';
           this.params.context.componentCheck.basedOnValueChanged(this.params );
      }
    } 
}
