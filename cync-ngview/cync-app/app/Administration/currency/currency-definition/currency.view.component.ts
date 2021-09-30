import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import  {Currencies, Country, FormatMask, InterestMethod, RoundingPref} from './currency.definition.Model';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';

@Component({
    selector: 'currency-view-comp',
    templateUrl: './currency.view.component.html'
})
export class currencyViewComponent {
	lenderId: string;
  constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  viewDetails: Currencies = new Currencies();
  currencyDefId: any;
  apiURL: any;

  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.apiURL = '/v1/lenders/' + this.lenderId + '/currencies/';
    this.viewDetails.ccyCountry = new Country();
    this.viewDetails.currencyInterestMethod = new InterestMethod();
    this.viewDetails.currencyRoundingPrefs = new RoundingPref();
    this.viewDetails.currencyFormatMask = new FormatMask();
    this.route.params.subscribe(params => {
    this.currencyDefId = params['id'];
    if (this.currencyDefId !== undefined){
       this._service.getCall(this.apiURL + this.currencyDefId).then(i => {
       this.viewDetails = this._service.bindData(i);
       //this.viewDetails.currencyCutoffTime = this._grid.formatDate(this.viewDetails.currencyCutoffTime);
     });
    }
    });
   this._service.setHeight();
  }

  navigateToHome() {
    this._router.navigateByUrl('/currency/currency-definition');
  }

  delete(){
    this._grid.deleteFromView(this.currencyDefId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.currencyDefId);
  }

}
