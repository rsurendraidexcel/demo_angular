import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { currencyPairModel } from './currency.pair.Model';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';

@Component({
    selector: 'currency-pair-edit-comp',
    templateUrl: './currency.pair.edit.component.html'
})
export class currencyPairEditComponent {

  currencyPairModel: currencyPairModel = new currencyPairModel();
  currencyPairId: any;
  lenderId: string;
  isShow = true;
  isHidden = true;
  select: string;
  constructor(private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.route.params.subscribe(params => {
    this.currencyPairId = params['id'];
    if (this.currencyPairId !== undefined){
         this._service.getCall('/v1/lenders/' + this.lenderId + '/currencypairs/' + this.currencyPairId).then(i => {
           this.currencyPairModel = this._service.bindData(i);
           this.isShow = this.currencyPairModel.thruCurrency;
         });
       }
    });
   this._service.setHeight();
  }

  // bindData(data : any){
  //   this.currencyPairModel = data;
  //   this.isShow = this.currencyPairModel.thruCurrency;
  //   this._message.showLoader(false);
  // }

  navigateToHome() {
    this._location.back();
    this._message.addSingle('Record saved successfully.', 'success');
  }

  navigateToHomeCancel() {
    this._location.back();
  }

 editCurrencyPair() {
   this._message.showLoader(true);
    const requestModel = {url: '/v1/lenders/' + this.lenderId + '/currencypairs/' + this.currencyPairId, model: this.currencyPairModel};
    this._service.putCall(requestModel).then(i => this.approvecurrencyPair(i));
  }

  approvecurrencyPair(data: any){
    if (data.status == 204){
       const requestModel = {url: data.url, model: this.currencyPairModel};
       this._service.patchCall(requestModel).then(i => this.navigateToHome());
    }
  }

  throughCurrency(){
    if (this.isShow == true){
      this.isShow = false;
    }else {
      this.isShow = true;
    }
  }
}
