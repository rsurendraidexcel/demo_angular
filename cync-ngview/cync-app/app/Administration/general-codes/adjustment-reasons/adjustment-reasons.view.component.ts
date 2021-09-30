import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';

@Component({
    selector: 'adjustment-view-component',
    templateUrl: './adjustment-reasons.view.component.html'
})
export class AdjustmentReasonsViewComponent {
	lenderId: string;
  constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  adjustmentId: any;
  apiURL: any;
  viewDetails: any;

  ngOnInit() {
   this.apiURL = 'general_codes/adjustment_reasons/';
   this.route.params.subscribe(params => {
    this.adjustmentId = params['id'];
    if (this.adjustmentId !== undefined){
       this._service.getCall(this.apiURL + this.adjustmentId).then(i => {
       this.viewDetails = this._service.bindData(i); });
    }
    });
   this._service.setHeight();
  }

  navigateToHome() {
      //this._location.back();
    this._router.navigateByUrl('/generalCodes/adjustment');
  }

  delete(){
    this._grid.deleteFromView(this.adjustmentId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.adjustmentId);
  }

}
