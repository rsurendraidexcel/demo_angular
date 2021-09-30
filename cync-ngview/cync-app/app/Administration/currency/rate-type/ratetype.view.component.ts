import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@Component({
    selector: 'rate-type-view',
    templateUrl: './rate.type.view.component.html'
})
export class rateTypeViewComponent implements OnInit {
lenderId: string;
apiURL: any;
constructor(private _grid: GridComponent, private _message: MessageServices, private _service: CustomHttpService, private route: ActivatedRoute, private _location: Location, private config: AppConfig){
	this.lenderId = this.config.getConfig('lenderId');
}

rateTypeView: any ;
rateTypeId: any;
ngOnInit(){
  $('#cync_app_dashboard').removeClass('loading-modal-initial');
  this.apiURL = '/v1/lenders/' + this.lenderId + '/ratetypes/';
  this.route.params.subscribe(params => {
      this.rateTypeId = params['id'];
         if (this.rateTypeId !== undefined){
       	this._service.getCall(this.apiURL + this.rateTypeId).then(i => {
           this.rateTypeView = this._service.bindData(i); });
         }


      });
  this._service.setHeight();
}

// bindData(data: any){
//  this.rateTypeView = data;
//  this._message.showLoader(false);
// }

navigateToHome() {
    this._location.back();
}

delete(){
    this._grid.deleteFromView(this.rateTypeId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.rateTypeId);
  }

}
