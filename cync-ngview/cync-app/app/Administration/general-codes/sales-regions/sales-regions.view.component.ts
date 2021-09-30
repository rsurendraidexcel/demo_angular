import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';

@Component({
    selector: 'sales-regions-view-comp',
    templateUrl: './sales-regions.view.component.html'
})
export class SalesRegionsViewComponent{

	constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location) {

  	}

  	salesRegionsId: any;
  	apiURL: any;
  	srViewDetails: any;

  	ngOnInit() {
   		this.apiURL = 'general_codes/sales_regions/';
   		this.route.params.subscribe(params => {
    	this.salesRegionsId = params['id'];
    	if (this.salesRegionsId !== undefined){
	       this._service.getCall(this.apiURL + this.salesRegionsId).then(i => {
	       this.srViewDetails = this._service.bindData(i); });
	    }
	    });
	   this._service.setHeight();
  	}

  navigateToHome() {
    this._router.navigateByUrl('/generalCodes/sales-regions');
  }

  delete(){
    this._grid.deleteFromView(this.salesRegionsId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.salesRegionsId);
  }

}
