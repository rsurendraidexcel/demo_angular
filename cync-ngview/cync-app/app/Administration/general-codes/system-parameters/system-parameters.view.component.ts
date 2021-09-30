import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';

@Component({
    selector: 'system-parameters-view-component',
    templateUrl: './system-parameters.view.component.html'
})
export class SystemParametersViewComponent {
	lenderId: string;
  constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  sysParameterId: any;
  apiURL: any;
  viewDetails: any;

  ngOnInit() {
   this.apiURL = 'system_parameters/';
   this.route.params.subscribe(params => {
    this.sysParameterId = params['id'];
    if (this.sysParameterId !== undefined){
       this._service.getCall(this.apiURL + this.sysParameterId).then(i => {
       this.viewDetails = this._service.bindData(i); });
    }
    });
   this._service.setHeight();
  }

  navigateToHome() {
    this._router.navigateByUrl('/generalCodes/system-parameters');
  }

  edit(){
    this._grid.goToEditFromView(this.sysParameterId);
  }

  /*delete(){
    this._grid.deleteFromView(this.sysParameterId, this.apiURL);
  }*/
}
