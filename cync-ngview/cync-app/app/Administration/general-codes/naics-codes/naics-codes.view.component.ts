import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';

@Component({
    selector: 'naicscodes-view-component',
    templateUrl: './naics-codes.view.component.html'
})
export class NaicsCodesViewComponent {
	lenderId: string;
  constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  naicscodesId: any;
  apiURL: any;
  viewDetails: any;

  ngOnInit() {
   this.apiURL = 'general_codes/naics_codes/';
   this.route.params.subscribe(params => {
    this.naicscodesId = params['id'];
    if (this.naicscodesId !== undefined){
       this._service.getCall(this.apiURL + this.naicscodesId).then(i => {
       this.viewDetails = this._service.bindData(i); });
    }
    });
   this._service.setHeight();
  }

  navigateToHome() {
    this._router.navigateByUrl('/generalCodes/naics-codes');
  }

  delete(){
    this._grid.deleteFromView(this.naicscodesId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.naicscodesId);
  }

}
