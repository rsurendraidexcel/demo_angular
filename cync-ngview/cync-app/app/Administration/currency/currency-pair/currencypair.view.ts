import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomHttpService} from '../../../../app-common/services/http.service';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@Component({
    selector: 'currencypair-view',
    templateUrl: './currencypair.view.html'
})

export class CurrencyPairView  implements OnInit{
   currencypairview: any;
   lenderId: string;
   currencyPairid: any;
   apiURL: any;

   constructor(private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
     this.lenderId = this.config.getConfig('lenderId');
   }
   ngOnInit(){
     $('#cync_app_dashboard').removeClass('loading-modal-initial');
     this.apiURL = '/v1/lenders/' + this.lenderId + '/currencypairs/';
     this.route.params.subscribe(params => {
           this.currencyPairid = params['id'];
	       if ( this.currencyPairid !== undefined){
	             this._service.getCall(this.apiURL + this.currencyPairid).then(i => {
                 this.currencypairview = this._service.bindData(i); });
	        }
	    });
	    this._service.setHeight();
	}

 //  bindData(data : any){
 //      this.currencypairview = data;
 //      this._message.showLoader(false);
	// }

	navigateToHome() {
    	this._location.back();
	}

  delete(){
    this._grid.deleteFromView(this.currencyPairid, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.currencyPairid);
  }

}
