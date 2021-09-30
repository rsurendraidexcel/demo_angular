import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {CurrencyPostModel, currencyDefinitionModel, Currencies, Country, FormatMask, InterestMethod, RoundingPref} from './currency.definition.Model';
import { ActivatedRoute } from '@angular/router';
import {Message} from 'primeng/components/common/api';
import {Location} from '@angular/common';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { AppConfig } from '../../../app.config';
import  {Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
@Component({
    selector: 'currency-definition-comp',
    templateUrl: './currency.definition.component.html'
})

export class currencyDefitionComponent implements OnInit {
  lenderId: string;
  isRequiredCurrency = true;
  isRequiredCurrencyCode = true;
  isRequiredCurrencyDesc = true;
  isRequiredCurrencyCntry = true;
  arrayCountries: any;
  selectedCountryId: any;

  constructor(private _sanitizer: DomSanitizer, private _router: Router, private _service: CustomHttpService, private config: AppConfig, private route: ActivatedRoute, private _location: Location, private _message: MessageServices){
    this.lenderId = this.config.getConfig('lenderId');
  }
  currencyDefinition: CurrencyPostModel = new CurrencyPostModel();
  currencyObj: Array<Currencies> = [];
  bindInterestMethodList: Array<InterestMethod> = [];
  roundingPrefList: Array<RoundingPref> = [];
  formatmaskList: Array<FormatMask> = [];
  isDisable = false;
  currencyId = '';
  message: Message ;
  currFormatMask: any;
  currRoundPrefs: any;
  currencyIntMethod: any = null;
  countryName: string;
  countryId: string;
  countryIdUrl: string;
  countryList: any;
  countryExists: any;
  countryModel: any;
  ngOnInit(){
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    // this.currFormatMask = '59bc00a746e0fb0013203d50';
    // this.currRoundPrefs = '596639067072d327bc5efd02';
    this.currencyIntMethod = null;
    this.currencyDefinition.currencyDecimalPrecision = 2;
    this._service.setHeight();


    this._service.getCall('/v1/lenders/' + this.lenderId + '/interestmethods').then(i => {
        this.bindInterestMethodList = this._service.bindData(i); });

    this._service.getCall('/v1/lenders/' + this.lenderId + '/formatmasks').then(i => {
        this.formatmaskList = this._service.bindData(i); });

    this._service.getCall('/v1/lenders/' + this.lenderId + '/roundingPreferences').then(i => {
          this.roundingPrefList = this._service.bindData(i); });

    this._service.getCall('/v1/lenders/' + this.lenderId + '/countries').then(i => {
        this.countryList = this._service.bindData(i);
        this.arrayCountries = this.countryList.countries;
      });

    this.route.params.subscribe(params => {
        const id1: any = params['id'];
           if (id1 !== undefined && id1 !== 'add'){
             	this.currencyId = id1;
             	this.isDisable = true;

              this._service.getCall('/v1/lenders/' + this.lenderId + '/currencies/' + id1).then(i => {
                  this.currencyDefinition = this._service.bindData(i);
                  //console.log(this.currencyDefinition.ccyCountry[countryName])
                  if (this.currencyDefinition.currencyFormatMask != undefined){
                      this.currFormatMask = this.currencyDefinition.currencyFormatMask['id'];
                  } else {
                      this.currFormatMask = '59bc00a746e0fb0013203d50';
                  }

                  if (this.currencyDefinition.currencyRoundingPrefs != undefined){
                      this.currRoundPrefs = this.currencyDefinition.currencyRoundingPrefs['id'];
                  } else {
                      this.currRoundPrefs = '596639067072d327bc5efd02';
                  }

                  if (this.currencyDefinition.currencyInterestMethod != undefined){
                      this.currencyIntMethod = this.currencyDefinition.currencyInterestMethod['id'];
                  } else {
                      this.currencyIntMethod = null;
                  }
                  if (this.currencyDefinition.currencyCutoffTime != undefined){
                    this.currencyDefinition.currencyCutoffTime = this.currencyDefinition.currencyCutoffTime;
                  }
                });
           }
           else{
            this.isDisable = false;
           	this._message.showLoader(true);
           }
    });
  //  this.currencyDefinition.currencyCutoffTime = new Date('Tue Oct 17 2017 14:54:49 GMT+0530 (IST)');
  }

  autocompleteListFormatter = (data: any) => {
    const html = `<span>${data.countryName}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  selectedCountry(selectedCountryId){
    this.selectedCountryId = selectedCountryId.id;
  }



  save(){

      let cutOffTime;
      if (this.currencyDefinition.currencyCutoffTime != undefined){
          cutOffTime = new Date(this.currencyDefinition.currencyCutoffTime).getHours() + ':' + new Date(this.currencyDefinition.currencyCutoffTime).getMinutes() + ':' + new Date(this.currencyDefinition.currencyCutoffTime).getSeconds();
          this.currencyDefinition.currencyCutoffTime = cutOffTime;
      }

      if (this.isDisable){
        this.countryModel = this.currencyDefinition.ccyCountry;
        this.countryName = this.countryModel.countryName;
      }


      if (this.currFormatMask != null){
        this.currencyDefinition.currencyFormatMask = {id: this.currFormatMask};
      } else {
        this.currencyDefinition.currencyFormatMask = null;
      }

      if (this.currRoundPrefs != null){
        this.currencyDefinition.currencyRoundingPrefs = {id: this.currRoundPrefs};
      } else {
        this.currencyDefinition.currencyRoundingPrefs = null;
      }

      if (this.currencyIntMethod != null){
        this.currencyDefinition.currencyInterestMethod = {id: this.currencyIntMethod};
      } else {
        this.currencyDefinition.currencyInterestMethod = null;
      }

      if (this.currencyDefinition.currencyName == undefined){
          this.isRequiredCurrency = false;
      }
      if (this.currencyDefinition.currencyCode == undefined){
          this.isRequiredCurrencyCode = false;
      }
      if (this.currencyDefinition.currencyDescription == undefined){
          this.isRequiredCurrencyDesc = false;
      }
      if (this.countryName == undefined){
          this.isRequiredCurrencyCntry = false;
      }

      if (this.currencyDefinition.currencyName != undefined && this.currencyDefinition.currencyDescription != undefined && this.countryName != undefined){
          this._message.showLoader(true);
          this.isRequiredCurrency = true;
          this.isRequiredCurrencyCode = true;
          this.isRequiredCurrencyDesc = true;
          this.isRequiredCurrencyCntry = true;

          if (!this.isDisable){
            // For new country
          if (this.selectedCountryId === '' || this.selectedCountryId === undefined){
              this.countryModel = {
                                'countryName': this.countryName
                               };
              const crateCountryreq = {model :  this.countryModel, url : '/v1/lenders/' + this.lenderId + '/countries/' };
              this._service.postCallpatch(crateCountryreq).then(i => {
                this.countryIdUrl = this.getCountryId(i);
                this.countryId = this.countryIdUrl.split('/')[8];
                this.currencyDefinition.ccyCountry = {
                                          'id': this.countryId
                                        };
              const request = {model :  this.currencyDefinition, url : '/v1/lenders/' + this.lenderId + '/currencies/' };
              if (!this.isDisable){
                this._service.postCallpatch(request).then(i => this.approveCurrency(i));
              }
              else{
                request.url = request.url + this.currencyId;
                this._service.putCall(request).then(i => this.BindEditSave(i));
              }
              });
          } else { //For existing Country
              this._service.getCall('/v1/lenders/' + this.lenderId + '/countries/' + this.selectedCountryId).then(i => {
              this.countryExists = this._service.bindData(i);
               // this.selectedCountryId = '';
                this.currencyDefinition.ccyCountry = {
                                          'id': this.countryExists.id
                                        };
              const request = {model :  this.currencyDefinition, url : '/v1/lenders/' + this.lenderId + '/currencies/' };
              if (!this.isDisable){
                this._service.postCallpatch(request).then(i => this.approveCurrency(i));
              }
              else{
                request.url = request.url + this.currencyId;
                this._service.putCall(request).then(i => this.BindEditSave(i));
              }
            });
          }
          }else {
            const request = {model :  this.currencyDefinition, url : '/v1/lenders/' + this.lenderId + '/currencies/' };
            request.url = request.url + this.currencyId;
            this._service.putCall(request).then(i => this.BindEditSave(i));
          }

      }
  }

  focusOutFunctionName(type){
    if (type == 'currencyName'){
      if (this.currencyDefinition.currencyName == undefined || this.currencyDefinition.currencyName == ''){
          this.isRequiredCurrency = false;
      }else {
        this.isRequiredCurrency = true;
      }
    }else if (type == 'currencyCode'){
      if (this.currencyDefinition.currencyCode == undefined || this.currencyDefinition.currencyCode == ''){
          this.isRequiredCurrencyCode = false;
      }else {
        this.isRequiredCurrencyCode = true;
      }
    }else if (type == 'currencyDesc'){
      if (this.currencyDefinition.currencyDescription == undefined || this.currencyDefinition.currencyDescription == ''){
          this.isRequiredCurrencyDesc = false;
      }else {
        this.isRequiredCurrencyDesc = true;
      }
    }else{
      if (this.countryName == ''){
          this.isRequiredCurrencyCntry = false;
      }else {
        this.isRequiredCurrencyCntry = true;
      }
    }
  }

  BindEditSave(data: any){
      this.currencyDefinition.status = 'approved';
      this.currencyDefinition.approverComments = 'approving currency';
      const request = {model :  this.currencyDefinition, url : data.url };
      this._service.patchCall(request).then(i => this._service.navigateToHome(i));
  }

  approveCurrency(patchUrl: any){
      this.currencyDefinition.status = 'approved';
      this.currencyDefinition.approverComments = 'approving exchangerate (Canada Dollar and Cyprus Euro) request';
      const requestModel = {url: patchUrl, model: this.currencyDefinition};
      this._service.patchCall(requestModel).then(i => this._service.navigateToHome(i));
  }

  getCountryId(patchUrl: any){
    return patchUrl;
  }

  navigateToHome() {
      this._router.navigateByUrl('/currency/currency-definition');
  }
}

