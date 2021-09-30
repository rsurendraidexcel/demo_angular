import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import { currencyHolidaysModel, currencyHolidayModel, Currencydetails } from './currency.holidays.Model';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import  {Router} from '@angular/router';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@Component({
    selector: 'currency-holidays-view-comp',
    templateUrl: './currency.holidays.view.component.html'
})
export class currencyHolidaysViewComponent {

constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
}

currencyHolidayDetails: currencyHolidaysModel = new currencyHolidaysModel();
currency: Array<Currencydetails> = [];
//currencyDefinition : currencyHolidaysModel = new CurrencyPostModel();
lenderId: string;
curencyHolidayId: any;
apiURL: any;
holidayFromDate: string;
holidayToDate: string;

ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.apiURL = '/v1/lenders/' + this.lenderId + '/currencyholidays/';
    this.route.params.subscribe(params => {
    this.curencyHolidayId = params['id'];
       if (this.curencyHolidayId !== undefined){
         this._service.getCall(this.apiURL + this.curencyHolidayId).then(i => {
           this.currencyHolidayDetails = this._service.bindData(i);
           this.holidayFromDate = this._grid.formatDate(this.currencyHolidayDetails.fromDate);
           this.holidayToDate = this._grid.formatDate(this.currencyHolidayDetails.toDate);
         });
       }
    });
    this._service.setHeight();
  }

  navigateToHome() {
      //this._location.back();
      this._router.navigateByUrl('/currency/currency-holidays');
  }

 delete(){
    this._grid.deleteFromView(this.curencyHolidayId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.curencyHolidayId);
  }

}
