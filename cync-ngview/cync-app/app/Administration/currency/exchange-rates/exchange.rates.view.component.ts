import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@Component({
    selector: 'exchange-rates-view-comp',
    templateUrl: './exchange.rates.view.component.html'
})
export class exchangeRatesViewComponent {

constructor(private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
}

exchangeRateDetails: any;
rateTypeDtls: any;
lenderId: string;
exchangeRateId: any;
apiURL: any;

ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.apiURL = '/v1/lenders/' + this.lenderId + '/exchangerates/';
    this.route.params.subscribe(params => {
    this.exchangeRateId = params['id'];
       if (this.exchangeRateId !== undefined){
     this._service.getCall(this.apiURL + this.exchangeRateId).then(i => {
       this.exchangeRateDetails = this._service.bindData(i); });
       }
    });
  this._service.setHeight();
  }

// bindData(data : any){
// this.exchangeRateDetails = data;
// //this.rateTypeDtls = data.rateDetails;
// this._message.showLoader(false);
// }

navigateToHome() {
    this._location.back();
}

delete(){
    this._grid.deleteFromView(this.exchangeRateId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.exchangeRateId);
  }


}
