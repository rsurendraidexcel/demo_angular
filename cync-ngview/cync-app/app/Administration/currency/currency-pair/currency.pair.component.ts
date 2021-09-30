import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { currencyPairModel } from './currency.pair.Model';
import { Location } from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';

@Component({
    selector: 'currency-pair-comp',
    templateUrl: './currency.pair.component.html'
})



export class currencyPairComponent {
  selectedCurrency: any;
 	lenderId: string;
	currencyPairModel: currencyPairModel = new currencyPairModel();
	isShow = false;
  isHidden = true;
  isDisabled = true;
  isSelectedCurrency1 = true;
  isSelectedCurrency2 = true;
  isSelectedCurrency3 = true;

	constructor(private _message: MessageServices, private _service: CustomHttpService, private _location: Location, private config: AppConfig){
  	  this.lenderId = this.config.getConfig('lenderId');
  }

	currencyDetails: Array<string> = [];
	thruCurrencyDtl: Array<string> = [];
  currencies: any;

	ngOnInit(){
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.currencyPairModel.quotationMethod = 'Direct';
    this.currencyPairModel.noOfUnits = 1;
    this.currencyPairModel.spreadDefinition = 'Percentage';
    this.currencyPairModel.currencyIdBase = null;
    this.currencyPairModel.currencyIdTo = null;
    this.currencyPairModel.currencyIdThru = null;
      this._service.getCall('/v1/lenders/' + this.lenderId + '/currencies/').then(i => {
        this.currencies = this._service.bindData(i);
        if (this.currencies.currencies != null){
         for (const currencies of this.currencies.currencies){
           if (currencies.status == 'approved'){
             this.currencyDetails.push(currencies);
             this.thruCurrencyDtl.push(currencies);
           }
         }
        }
      });
    this._service.setHeight();
    }

  // bindData(data : any){
  //   if(data.currencies != null){
  //    for(let currencies of data.currencies){
  //    	if(currencies.status == 'approved'){
  //    		this.currencyDetails.push(currencies);
  //        this.thruCurrencyDtl.push(currencies);
  //    	}
  //    }
  //   }
  //   this._message.showLoader(false);
  // }

  createCurrencyPairs(){
      if (this.currencyPairModel.currencyIdBase != undefined && this.currencyPairModel.currencyIdTo != undefined){
         if (this.isShow){
           if (this.currencyPairModel.currencyIdThru != undefined){
              this.isSelectedCurrency3 = true;
              this._message.showLoader(true);
              const requestModel = {url: '/v1/lenders/' + this.lenderId + '/currencypairs/', model: this.currencyPairModel};
              this._service.postCallpatch(requestModel).then(i => this.approveCurrencyHolidays(i));
           } else {
             this.isSelectedCurrency3 = false;
           }
         } else {
          this.isSelectedCurrency1 = true;
          this.isSelectedCurrency2 = true;
          this._message.showLoader(true);
          const requestModel = {url: '/v1/lenders/' + this.lenderId + '/currencypairs/', model: this.currencyPairModel};
          this._service.postCallpatch(requestModel).then(i => this.approveCurrencyHolidays(i));
        }
      }
      if (this.currencyPairModel.currencyIdBase == undefined && this.currencyPairModel.currencyIdTo == undefined){
          this.isSelectedCurrency1 = false;
          this.isSelectedCurrency2 = false;
      }
      if (this.currencyPairModel.currencyIdBase != undefined){
          this.isSelectedCurrency1 = true;
      }
      if (this.currencyPairModel.currencyIdTo != undefined){
          this.isSelectedCurrency2 = true;
      }
      if (this.currencyPairModel.currencyIdBase == undefined){
          this.isSelectedCurrency1 = false;
      }
      if (this.currencyPairModel.currencyIdTo == undefined){
          this.isSelectedCurrency2 = false;
      }
	}

	approveCurrencyHolidays(patchUrl: any){
    this.currencyPairModel.status = 'approved';
    this.currencyPairModel.approverComments = 'approving currency pair';
    const requestModel = {url: patchUrl, model: this.currencyPairModel};
    this._service.patchCall(requestModel).then(i => this.navigateToHome(i));
  }

  navigateToHome(data: any){
  if (data != undefined){
    if (data.status == 204) {
      this._location.back();
      this._message.addSingle('Record saved successfully.', 'success');
    }
  } else {
    this._location.back();
  }
}

throughCurrency(){
	if (this.isShow == true){
		this.isShow = false;
	}else {
		this.isShow = true;
	}
}

setThruCurrency(type) {
  if (type == 'currency1'){
       if (this.currencyPairModel.currencyIdBase != undefined){
          this.isSelectedCurrency1 = true;
        } else{
          this.isSelectedCurrency1 = false;
        }
  }

  if (type == 'currency2'){
        if (this.currencyPairModel.currencyIdTo != undefined){
          this.isSelectedCurrency2 = true;
        } else{
          this.isSelectedCurrency2 = false;
        }
  }

  let index = -1;
	this.thruCurrencyDtl = this.currencyDetails.slice();
	if (this.currencyPairModel.currencyIdBase != undefined && this.currencyPairModel.currencyIdTo != undefined){
		for (const curreny of this.currencyDetails){
			if (curreny['currencyName'] == this.currencyPairModel.currencyIdBase['currencyName']){
				index = this.thruCurrencyDtl.indexOf(curreny);
        if (index != -1){
          this.thruCurrencyDtl.splice(index, 1);
        }
	 		}
		}

		for (const curreny of this.currencyDetails){
			if (curreny['currencyName'] == this.currencyPairModel.currencyIdTo['currencyName']){
				index = this.thruCurrencyDtl.indexOf(curreny);
        if (index != -1){
          this.thruCurrencyDtl.splice(index, 1);
        }
	 		}
		}
		this.isDisabled = false;
	}
}

selectThruCurrency(){
  if (this.currencyPairModel.currencyIdThru != undefined){
          this.isSelectedCurrency3 = true;
  } else{
      this.isSelectedCurrency3 = false;
  }
}

}
