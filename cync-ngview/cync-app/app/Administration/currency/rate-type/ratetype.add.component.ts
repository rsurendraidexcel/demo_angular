import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import {RateTypePostModel} from './rate.type.Model';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';

@Component({
    selector: 'rate-type-add',
    templateUrl: './ratetype.add.html'
})
export class rateTypeAddComponent implements OnInit {
lenderId: string;
constructor(private _message: MessageServices, private _service: CustomHttpService, private route: ActivatedRoute, private _location: Location, private config: AppConfig){
    this.lenderId = this.config.getConfig('lenderId');
}

postModel: RateTypePostModel = new RateTypePostModel();
rateTypeId = '';
update = false;
isRequiredName = true;
isRequiredDesc = true;
ngOnInit(){
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.postModel.rateTypeDescription = '';
    this.postModel.rateTypeName = '';

    this.route.params.subscribe(params => {
        const id1: any = params['id'];
           if (id1 !== undefined && id1 !== 'add'){
               this.rateTypeId = id1;
               this.update = true;
          this._service.getCall('/v1/lenders/' + this.lenderId + '/ratetypes/' + id1).then(i => {
            this.postModel = this._service.bindData(i); });
           }

        });
    this._service.setHeight();
}

// bindData(data: any){
// this.postModel = data;
// this._message.showLoader(false);
// }

saveRateType(){
  //this._message.showLoader(true);
 // / console.log(this.postModel.rateTypeName);
  if (this.postModel.rateTypeName != '' && this.postModel.rateTypeDescription != ''){
    this.isRequiredName = true;
    this.isRequiredDesc = true;
    this._message.showLoader(true);
    const request = {url : '/v1/lenders/' + this.lenderId + '/ratetypes', model: this.postModel};
    if (!this.update){

    this._service.postCall(request).then(i => this.bindSave(i));
    }
    else{
    request.url = request.url + '/' + this.rateTypeId;
    this._service.putCall(request).then(i => this.bindSave(i));

    }
  } else {
    this.isRequiredName = false;
    this.isRequiredDesc = false;
  }
  if (this.postModel.rateTypeName != ''){
    this.isRequiredName = true;
  }
  if (this.postModel.rateTypeDescription != ''){
    this.isRequiredDesc = true;
  }
}

focusOutFunctionName(){

  if (this.postModel.rateTypeName != ''){
    this.isRequiredName = true;
  }else{
    this.isRequiredName = false;
  }

}

focusOutFunctionDesc(){


  if (this.postModel.rateTypeDescription != ''){
    this.isRequiredDesc = true;
  }else{
    this.isRequiredDesc = false;
  }
}

bindSave(data: any){
  this.postModel.status = 'approved';
  this.postModel.approverComments = 'rate type approved';
if (!this.update){
    const postUrl = data.headers._headers.get('location').toString();
    const request = {model : this.postModel, url : postUrl };
    this._service.patchCall(request).then(i => this.navigateToHome());
    this._message.addSingle('Record saved successfully.', 'success');
    }
else
{
     const req = {model : this.postModel, url : data.url };
     this._service.patchCall(req).then(i => this.navigateToHome());
     this._message.addSingle('Record saved successfully.', 'success');
}

}

Success(){
    alert('created');
}

navigateToHome() {
    this._location.back();
}


}
