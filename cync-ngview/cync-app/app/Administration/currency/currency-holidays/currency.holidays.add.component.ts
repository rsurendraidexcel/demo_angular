import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import { currencyHolidaysModel } from './currency.holidays.Model';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
// import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
    selector: 'currency-holidays-add-component',
    templateUrl: './currency.holidays.add.component.html'
}) export class currencyHolidaysAddComponent {
  selectedCurrency: any;
  lenderId: string;
  currencyHolidaysModel: currencyHolidaysModel = new currencyHolidaysModel();    
  // date: DateModel;
  // options: DatePickerOptions;
  constructor(private _message: MessageServices, private _service : CustomHttpService, private _location: Location,private config: AppConfig){
    this.lenderId = this.config.getConfig('lenderId');
    this.currencyHolidaysModel.recurring = false;  
    // this.options = new DatePickerOptions();   
  }

  currencyDetails: Array<string> = [];
  currenctDate: Date = new Date();
  currencySelCode: string;
  selectedToDate: any;
  selectedfromDate: any;
  isSelectedCurrency = true;
  isSelectedYear = true;
  isSelectedHolidayname = true;
  isSelectedFromDt = true;
  isSelectedToDt = true;
  currencyDetailsAll: any;

  ngOnInit(){
     $('#cync_app_dashboard').removeClass('loading-modal-initial');
     this.currencyHolidaysModel.currency = null;
     this.currencyHolidaysModel.holidaysStatus = true;
     //this.currencyHolidaysModel.holidaysStatus = 'select';
     this._service.getCall('/v1/lenders/' + this.lenderId + '/currencies/').then(i => {
      this.currencyDetailsAll = this._service.bindData(i);
         if (this.currencyDetailsAll.currencies != null){
         for (const currencies of this.currencyDetailsAll.currencies){
           if (currencies.status == 'approved'){
             this.currencyDetails.push(currencies);
           }
         }
        }
    });
    this._service.setHeight();
  }
   public callReturnMethod(event: any){
    this[event]();
  }

  deleteData(){
    alert('data deleted.');
  }

  createCurrencyHolidays(){
    if (this.currencyHolidaysModel.currency != undefined && this.currencyHolidaysModel.year != undefined && this.currencyHolidaysModel.holidayDescription != undefined && this.selectedfromDate != undefined){
        this._message.showLoader(true);
        this.currencyHolidaysModel.fromDate = this.selectedfromDate;

        if (this.selectedToDate != undefined && this.selectedToDate != ''){
          this.currencyHolidaysModel.toDate = this.selectedToDate;
        } else {
          this.currencyHolidaysModel.toDate = this.selectedfromDate;
        }
        //this.currencyHolidaysModel.weekend = ["Satuday","Sunday"];
        const requestModel = {url: '/v1/lenders/' + this.lenderId + '/currencyholidays/', model: this.currencyHolidaysModel};
        this._service.postCallpatch(requestModel).then(i => this.approveCurrencyHolidays(i));
    }

    if (this.currencyHolidaysModel.currency != null){
        this.isSelectedCurrency = true;
    } else {
      this.isSelectedCurrency = false;
    }

    if (this.currencyHolidaysModel.year != undefined){
        this.isSelectedYear = true;
    } else {
      this.isSelectedYear = false;
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
     if (this.selectedToDate != undefined){
        this.isSelectedToDt = true;
    } else {
      this.isSelectedToDt = false;
    }
  }

  approveCurrencyHolidays(patchUrl: any){
    this.currencyHolidaysModel.status = 'approved';
    this.currencyHolidaysModel.approverComments = 'approving currency holidays';
    const requestModel = {url: patchUrl, model: this.currencyHolidaysModel};
    this._service.patchCall(requestModel).then(i => this.navigateToHome(i));
  }

  navigateToHome(data: any){
  if (data != undefined){
    if (data.status == 204) {
      this._location.back();
      this._message.showLoader(true);
      this._message.addSingle('Record saved successfully.', 'success');
    }
  } else {
    this._location.back();
  }
  }

   // bindData(data : any){
   //  if(data.currencies != null){
   //    this.currencyDetails = data.currencies;
   //  }

   //  this._message.showLoader(false);
   //  }

    setCurrecyCode(cCode: any){
      this.currencySelCode = cCode;
      if (this.currencyHolidaysModel.currency != 'select'){
          this.isSelectedCurrency = true;
      } else {
        this.isSelectedCurrency = false;
      }
    }

    isRequired(){
      if (this.currencyHolidaysModel.currency != null){
          this.isSelectedCurrency = true;
      } else {
        this.isSelectedCurrency = false;
      }
    }

    focusOutFunctionName(type){
      if (type == 'holidayName'){
           if (this.currencyHolidaysModel.holidayDescription != undefined && this.currencyHolidaysModel.holidayDescription != ''){
                this.isSelectedHolidayname = true;
            } else {
              this.isSelectedHolidayname = false;
            }
      } else if (type == 'year') {
          if (this.currencyHolidaysModel.year != undefined && this.currencyHolidaysModel.year != null){
            this.isSelectedYear = true;
          } else {
            this.isSelectedYear = false;
          }
      }
    }

}
