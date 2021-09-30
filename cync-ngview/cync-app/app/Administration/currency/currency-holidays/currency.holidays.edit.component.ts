import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { currencyHolidaysModel } from './currency.holidays.Model';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
// import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
    selector: 'currency-holidays-edit-comp',
    templateUrl: './currency.holidays.edit.component.html'
})
export class currencyHolidaysEditComponent {

  currencyHolidaysModel: currencyHolidaysModel = new currencyHolidaysModel();
  currencyHolidayId: any;
  lenderId: string;
  selectedfromDate: any;
  selectedToDate: any;
  // date: DateModel;
  // options: DatePickerOptions;
  isSelectedHolidayname: boolean = true;
  isSelectedFromDt: boolean = true;
	
constructor(private _message: MessageServices, private route: ActivatedRoute, private _service : CustomHttpService, private _location : Location,private config: AppConfig) {
  this.lenderId = this.config.getConfig('lenderId');
}

exchangeRateDetails: any;

ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.route.params.subscribe(params => {
    this.currencyHolidayId = params['id'];
    if (this.currencyHolidayId !== undefined){
         this._service.getCall('/v1/lenders/' + this.lenderId + '/currencyholidays/' + this.currencyHolidayId).then(i => {
           this.currencyHolidaysModel = this._service.bindData(i);
           this.selectedfromDate = new Date(this.currencyHolidaysModel.fromDate);
           this.selectedToDate = new Date(this.currencyHolidaysModel.toDate);
         });
       }
    });
    this._service.setHeight();
  }

  // bindData(data : any){
  //   this.currencyHolidaysModel = data;
  //   this.selectedfromDate= {"formatted": this.currencyHolidaysModel.fromDate.split('T')[0]};
  //   this.selectedToDate = {"formatted": this.currencyHolidaysModel.toDate.split('T')[0]};
  //   this._message.showLoader(false);
  // }

  navigateToHome() {
    this._location.back();
    this._message.addSingle('Record saved successfully.', 'success');
  }

  navigateToHomeCancel() {
    this._location.back();
  }

 editCurrencyHoliday() {
   if (this.currencyHolidaysModel.currency != undefined && this.currencyHolidaysModel.year != undefined && this.currencyHolidaysModel.holidayDescription != '' && this.currencyHolidaysModel.holidayDescription != undefined && this.selectedfromDate != undefined){
      this._message.showLoader(true);
      this.currencyHolidaysModel.fromDate = this.selectedfromDate;
      console.log(this.selectedToDate);
      if (this.selectedToDate != undefined && this.selectedToDate != ''){
        this.currencyHolidaysModel.toDate = this.selectedToDate;
      }else {
        this.currencyHolidaysModel.toDate = this.selectedfromDate;
      }
      const requestModel = {url: '/v1/lenders/' + this.lenderId + '/currencyholidays/' + this.currencyHolidayId, model: this.currencyHolidaysModel};
      this._service.putCall(requestModel).then(i => this.approveCurrencyHoliday(i));
    }

    if (this.currencyHolidaysModel.holidayDescription != undefined){
        this.isSelectedHolidayname = true;
    } else {
      this.isSelectedHolidayname = false;
    }

    if (this.selectedfromDate != undefined){
        this.isSelectedFromDt = true;
    } else {
      this.isSelectedFromDt = false;
    }
  }

  approveCurrencyHoliday(data: any){
    if (data.status == 204){
       const requestModel = {url: data.url, model: this.currencyHolidaysModel};
       this._service.patchCall(requestModel).then(i => this.navigateToHome());
    }
  }

  focusOutFunctionName(type){
      if (this.currencyHolidaysModel.holidayDescription != undefined && this.currencyHolidaysModel.holidayDescription != ''){
          this.isSelectedHolidayname = true;
      } else {
        this.isSelectedHolidayname = false;
      }
    }

}
