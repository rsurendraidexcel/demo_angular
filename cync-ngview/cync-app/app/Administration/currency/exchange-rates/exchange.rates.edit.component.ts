import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';

@Component({
    selector: 'exchange-rates-edit-comp',
    templateUrl: './exchange.rates.edit.component.html'
})
export class exchangeRatesEditComponent {

  //exchangeModel : exchangeRatesModel = new exchangeRatesModel();
  exchangeModel: any;
  exchangeRateId: any;
  lenderId: string;
  isDisable = false;
  currencyDetails: any;
  rateTypeDetails: any;
  currenctDate: Date = new Date();
  currencyPair: any;
  rateTypeModel: Array<Object> = [];
  rateTypes = [];
  currencyPairDetails: any;
  rateTypeDetail: any;
  isSelectedMidrate = true;
  isSelectedBuySpread = true;
  isSelectedSellspread = true;
  isSelectedCurrencyPair = true;
  isSelectedRateType = true;
  verifyEditDataOld: Array<Object> = [];
  verifyEditDataNew: Array<Object> = [];
  isSave = false;
  disabled = true;

  constructor(private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.currencyPair = null;
    this.rateTypes = [
      {
        rateType: 'rateType1',
        midRate: 'midRate1',
        buySpread: 'buySpread1',
        sellSpread: 'sellSpread1',
        buyRate: 'buyRate1',
        sellRate: 'sellRate1',
        isDisabled: true,
        isRequired: false
      }
    ];
     this.rateTypes[0].midRate = null;
     this.rateTypes[0].buySpread = null;
     this.rateTypes[0].sellSpread = null;
     this.rateTypes[0].buyRate = null;
     this.rateTypes[0].sellRate = null;
     this.route.params.subscribe(params => {
     this.exchangeRateId = params['id'];
     if (this.exchangeRateId !== undefined && this.exchangeRateId !== 'add'){
       this.disabled = false;
        this.currencyDetails = '';
         this.isDisable = true;
         this._message.showLoader(true);
         this._service.getCall('/v1/lenders/' + this.lenderId + '/ratetypes/').then(i => {
           this.rateTypeDetail = this._service.bindData(i);
           this.rateTypeDetails = this.rateTypeDetail.rateTypes;
         });
         this._service.getCall('/v1/lenders/' + this.lenderId + '/exchangerates/' + this.exchangeRateId).then(i => {
         this.currencyDetails = this._service.bindData(i);
          for (let i = 0; i < this.currencyDetails.rateDetails.length ; i++){
           this.rateTypes.push({
              rateType: 'rateType' + i,
              midRate: 'midRate' + i,
              buySpread: 'buySpread' + i,
              sellSpread: 'sellSpread' + i,
              buyRate: 'buyRate' + i,
              sellRate: 'sellRate' + i,
              isDisabled: true,
              rateTypeValue: null,
              isRequired: false
            });
          this.verifyEditDataOld.push(this.currencyDetails.rateDetails[i].midRate + '-' + this.currencyDetails.rateDetails[i].buySpread + '-' + this.currencyDetails.rateDetails[i].sellSpread);

          this.rateTypes[i].rateType = this.currencyDetails.rateDetails[i].rateType;
          this.rateTypes[i].rateTypeValue = this.currencyDetails.rateDetails[i].rateType.id;
          this.rateTypes[i].isRequired = false;
          this.rateTypes[i].midRate = this.currencyDetails.rateDetails[i].midRate;
          this.rateTypes[i].buySpread = this.currencyDetails.rateDetails[i].buySpread;
          this.rateTypes[i].sellSpread = this.currencyDetails.rateDetails[i].sellSpread;
          this.rateTypes[i].buyRate = this.currencyDetails.rateDetails[i].buyRate;
          this.rateTypes[i].sellRate = this.currencyDetails.rateDetails[i].sellRate;
        }
        this.rateTypes.splice(this.currencyDetails.rateDetails.length);
           });
      } else {
         this._service.getCall('/v1/lenders/' + this.lenderId + '/currencypairs/').then(i => {
           this.currencyPairDetails = this._service.bindData(i);
           this.currencyDetails = this.currencyPairDetails.currencyPairs;
         });
         this._service.getCall('/v1/lenders/' + this.lenderId + '/ratetypes/').then(i => {
           this.rateTypeDetail = this._service.bindData(i);
           this.rateTypeDetails = this.rateTypeDetail.rateTypes;
         });
       }
    });
   this._service.setHeight();
  }

  navigateToHome() {
    this._location.back();
    this._message.showLoader(false);
    this._message.addSingle('Record saved successfully.', 'success');
  }

  navigateToHomeCancel() {
    this._location.back();
  }

 saveExchangerate() {
   for (let i = 0; i < this.rateTypes.length ; i++){
     if (this.currencyPair == undefined){
         this.isSelectedCurrencyPair = false;
     }else {
         this.isSelectedCurrencyPair = true;
     }
     if (this.isDisable){
       if (this.currencyDetails == null){
           this.isSelectedCurrencyPair = false;
       }else {
           this.isSelectedCurrencyPair = true;
       }
     }
      if (this.rateTypes[i].midRate == null  || this.rateTypes[i].midRate == ''){
         this.rateTypes[i].isRequired = true;
         this.isSelectedRateType = false;
     }else{
         this.rateTypes[i].isRequired = false;
         this.isSelectedRateType = true;
     }
     if (this.rateTypes[i].buySpread == null || this.rateTypes[i].buySpread == ''){
        this.rateTypes[i].isRequired = true;
        this.isSelectedBuySpread = false;
     }else{
         this.rateTypes[i].isRequired = false;
         this.isSelectedBuySpread = true;
     }
     if (this.rateTypes[i].sellSpread == null || this.rateTypes[i].sellSpread == ''){
        this.rateTypes[i].isRequired = true;
        this.isSelectedSellspread = false;
     }else{
        this.rateTypes[i].isRequired = false;
        this.isSelectedSellspread = true;
     }
   }
  if (this.isSelectedCurrencyPair == true && this.isSelectedCurrencyPair == true && this.isSelectedMidrate == true && this.isSelectedBuySpread == true && this.isSelectedSellspread == true){
     let requestModel;
     for (let arrayCount = 0; arrayCount < this.rateTypes.length; arrayCount++){
       this.verifyEditDataNew.push(this.rateTypes[arrayCount].midRate + '-' + this.rateTypes[arrayCount].buySpread + '-' + this.rateTypes[arrayCount].sellSpread);
     }
     if (!this.isDisable){
      for (let arrayCount = 0; arrayCount < this.rateTypes.length; arrayCount++){
        delete this.rateTypes[arrayCount]['isDisabled'];
        delete this.rateTypes[arrayCount]['isRequired'];
        delete this.rateTypes[arrayCount]['rateTypeValue'];
      }
       const exchangeRateModel = {
         'currencyPair': {'id': this.currencyPair},
         'rateDetails': this.rateTypes,
         'status': 'approved',
         'approverComments': 'exchangerate approved'
       };
       this._message.showLoader(true);
       requestModel = {url: '/v1/lenders/' + this.lenderId + '/exchangerates/', model: exchangeRateModel};
       this._service.postCallpatch(requestModel).then(i => this.approveExchangeRate(i, exchangeRateModel));
     } else {
       if (this.verifyEditDataOld.length != this.verifyEditDataNew.length){
          for (let arrayCount = 0; arrayCount < this.rateTypes.length; arrayCount++){
            delete this.rateTypes[arrayCount]['isDisabled'];
            delete this.rateTypes[arrayCount]['isRequired'];
            delete this.rateTypes[arrayCount]['rateTypeValue'];
          }
          const exchangeRateModel = {
         'currencyPair': {'id': this.currencyDetails.currencyPair.id},
         'rateDetails': this.rateTypes,
         'status': 'approved',
         'approverComments': 'exchangerate approved'
           };
           this._message.showLoader(true);
           requestModel = {url: '/v1/lenders/' + this.lenderId + '/exchangerates/' + this.exchangeRateId, model: exchangeRateModel};
           this._service.putCall(requestModel).then(i => this.approveExchangeRate(i, exchangeRateModel));
       } else{
           for (let rateCount = 0; rateCount < this.verifyEditDataOld.length; rateCount++){
             if (this.verifyEditDataOld[rateCount] == this.verifyEditDataNew[rateCount]){
                 this.isSave = true;
             } else{
                  this.isSave = false;
             }
           }
           if (!this.isSave){
             for (let arrayCount = 0; arrayCount < this.rateTypes.length; arrayCount++){
                delete this.rateTypes[arrayCount]['isDisabled'];
                delete this.rateTypes[arrayCount]['isRequired'];
                delete this.rateTypes[arrayCount]['rateTypeValue'];
              }
              const exchangeRateModel = {
             'currencyPair': {'id': this.currencyDetails.currencyPair.id},
             'rateDetails': this.rateTypes,
             'status': 'approved',
             'approverComments': 'exchangerate approved'
               };
               this._message.showLoader(true);
               requestModel = {url: '/v1/lenders/' + this.lenderId + '/exchangerates/' + this.exchangeRateId, model: exchangeRateModel};
               this._service.putCall(requestModel).then(i => this.approveExchangeRate(i, exchangeRateModel));
           }else{
             this.verifyEditDataNew = [];
             this._message.addSingle('No Record Updated.', 'error');
           }
       }
     }
  }
 }

  approveExchangeRate(data: any, exchangeRateModel){
    if (!this.isDisable){
      const requestModel = {url: data, model: exchangeRateModel};
      this._service.patchCall(requestModel).then(i => this.navigateToHome());
    } else {
       if (data.status == 204){
       const requestModel = {url: data.url, model: exchangeRateModel};
       this._service.patchCall(requestModel).then(i => this.navigateToHome());
      }
    }
  }

  addMoreRows() {
    console.log(this.rateTypeDetails);

    for (let i = 0; i < this.rateTypes.length ; i++){

      //Remove already created Rate Types from Rate Type select box

      // for(let j=0; j<this.rateTypeDetails.length; j++){
      //   if(this.rateTypeDetails[j].id === this.rateTypes[i].rateType.id){
      //     this.rateTypeDetails.splice(j,1);
      //   }
      // }

      if (this.currencyPair == undefined && this.currencyDetails.id == null){
           this.isSelectedCurrencyPair = false;
       }else {
           this.isSelectedCurrencyPair = true;
       }
      // if(this.rateTypes[i].rateType.id == undefined){
      //      this.isSelectedRateType = false;
      //  }else{
      //      this.isSelectedRateType = true;
      //  }
      //  if(this.rateTypes[i].midRate == null){
      //      this.isSelectedMidrate = false;
      //  }else{
      //      this.isSelectedMidrate = true;
      //  }
      //  if(this.rateTypes[i].buySpread == null){
      //     this.isSelectedBuySpread = false;
      //  }else{
      //      this.isSelectedBuySpread = true;
      //  }
      //  if(this.rateTypes[i].sellSpread == null){
      //     this.isSelectedSellspread = false;
      //  }else{
      //      this.isSelectedSellspread = true;
      //  }
     if (this.rateTypes[i].midRate == null  || this.rateTypes[i].midRate == ''){
         this.rateTypes[i].isRequired = true;
         this.isSelectedRateType = false;
     }else{
         this.rateTypes[i].isRequired = false;
         this.isSelectedRateType = true;
     }
     if (this.rateTypes[i].buySpread == null || this.rateTypes[i].buySpread == ''){
        this.rateTypes[i].isRequired = true;
        this.isSelectedBuySpread = false;
     }else{
         this.rateTypes[i].isRequired = false;
         this.isSelectedBuySpread = true;
     }
     if (this.rateTypes[i].sellSpread == null || this.rateTypes[i].sellSpread == ''){
        this.rateTypes[i].isRequired = true;
        this.isSelectedSellspread = false;
     }else{
        this.rateTypes[i].isRequired = false;
        this.isSelectedSellspread = true;
     }

    }
    if (this.currencyPair != undefined && this.isSelectedCurrencyPair == true && this.isSelectedMidrate == true && this.isSelectedBuySpread == true && this.isSelectedSellspread == true){

    const rowSize = this.rateTypes.length + 1;
    this.rateTypes.push({
        rateType: 'rateType' + rowSize,
        midRate: 'midRate' + rowSize,
        buySpread: 'buySpread' + rowSize,
        sellSpread: 'sellSpread' + rowSize,
        buyRate: 'buyRate' + rowSize,
        sellRate: 'sellRate' + rowSize,
        isDisabled: false,
        isRequired: false
      });
    for (let i = 0; i <= this.rateTypes.length ; i++){
      if (this.rateTypes[i].midRate == 'midRate' + rowSize)this.rateTypes[i].midRate = null;
      if (this.rateTypes[i].buySpread == 'buySpread' + rowSize)this.rateTypes[i].buySpread = null;
      if (this.rateTypes[i].sellSpread == 'sellSpread' + rowSize)this.rateTypes[i].sellSpread = null;
      if (this.rateTypes[i].buyRate == 'buyRate' + rowSize)this.rateTypes[i].buyRate = '';
      if (this.rateTypes[i].sellRate == 'sellRate' + rowSize)this.rateTypes[i].sellRate = '';
    }
  }
   else if (this.currencyDetails != null && this.isSelectedCurrencyPair == true && this.isSelectedMidrate == true && this.isSelectedBuySpread == true && this.isSelectedSellspread == true){
     const rowSize = this.rateTypes.length + 1;
    this.rateTypes.push({
        rateType: 'rateType' + rowSize,
        midRate: 'midRate' + rowSize,
        buySpread: 'buySpread' + rowSize,
        sellSpread: 'sellSpread' + rowSize,
        buyRate: 'buyRate' + rowSize,
        sellRate: 'sellRate' + rowSize,
        isDisabled: false,
        isRequired: false
      });
    for (let i = 0; i <= this.rateTypes.length ; i++){
      if (this.rateTypes[i].midRate == 'midRate' + rowSize)this.rateTypes[i].midRate = null;
      if (this.rateTypes[i].buySpread == 'buySpread' + rowSize)this.rateTypes[i].buySpread = null;
      if (this.rateTypes[i].sellSpread == 'sellSpread' + rowSize)this.rateTypes[i].sellSpread = null;
      if (this.rateTypes[i].buyRate == 'buyRate' + rowSize)this.rateTypes[i].buyRate = '';
      if (this.rateTypes[i].sellRate == 'sellRate' + rowSize)this.rateTypes[i].sellRate = '';
    }
  }
  }

  removeRows(index) {
    const rowSizeRemove = this.rateTypes.length - 1;
    this.rateTypes.splice(index, 1);
  }

  setRateTypeValues(){
    if (this.currencyPair == undefined){
         this.isSelectedCurrencyPair = false;
     }else {
         this.isSelectedCurrencyPair = true;
     }
  }

  setRequired(){
    for (let i = 0; i < this.rateTypes.length ; i++){
      if (this.rateTypes[i].rateType.id == undefined){
           this.isSelectedRateType = false;
       }else{
           this.isSelectedRateType = true;
       }
    }
  }

  focusOutFunctionName(type){
    for (let i = 0; i < this.rateTypes.length ; i++){
       // if(type == 'midRate'){
       //     if(this.rateTypes[i].midRate == null || this.rateTypes[i].midRate == ''){
       //         this.isSelectedMidrate = false;
       //     }else{
       //         this.isSelectedMidrate = true;
       //     }
       //  }else if(type == 'buySpread'){
       //      if(this.rateTypes[i].buySpread == null || this.rateTypes[i].buySpread == ''){
       //          this.isSelectedBuySpread = false;
       //       }else{
       //           this.isSelectedBuySpread = true;
       //       }
       //  }else{
       //     if(this.rateTypes[i].sellSpread == null || this.rateTypes[i].sellSpread == ''){
       //        this.isSelectedSellspread = false;
       //     }else{
       //         this.isSelectedSellspread = true;
       //     }
       //  }

     if (this.rateTypes[i].midRate == null  || this.rateTypes[i].midRate == ''){
         this.rateTypes[i].isRequired = true;
     }else{
         this.rateTypes[i].isRequired = false;
     }
     if (this.rateTypes[i].buySpread == null || this.rateTypes[i].buySpread == ''){
        this.rateTypes[i].isRequired = true;
     }else{
         this.rateTypes[i].isRequired = false;
     }
     if (this.rateTypes[i].sellSpread == null || this.rateTypes[i].sellSpread == ''){
        this.rateTypes[i].isRequired = true;
     }else{
        this.rateTypes[i].isRequired = false;
     }
    }
  }

  checkRateTypeVal(rateType){
     if (rateType.id == undefined){
         this.isSelectedRateType = false;
     }else{
         this.isSelectedRateType = true;
     }
  }

  setSelectedRow(rateType){
    const model =  {
          'id': rateType,
      };
    for (let i = 0; i <= this.rateTypes.length; i++){
      if (i == this.rateTypes.length - 1){
        this.rateTypes[i].rateType = model;
      }
    }
     //console.log(this.rateTypes)
  }

  setDisableValues(){
      if (this.currencyPair == undefined || this.currencyPair == null || this.currencyPair == ''){
      this.disabled = true;
      }else {
        this.disabled = false;
      }
  }
}
