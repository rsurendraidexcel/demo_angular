import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import {MessageServices} from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'app-collateral-reserves',
  templateUrl: './collateral-reserves.component.html',
  styleUrls: ['./collateral-reserves.component.css']
})
export class CollateralReservesComponent implements OnInit {

   collateralreservesModel : GridModel;
   coulmnDefinition : ColumnDefinition;
   lenderId: string;

  constructor(private config: AppConfig, private _service: CustomHttpService, private _message: MessageServices) {
   	this.lenderId = this.config.getConfig('lenderId');
   	console.log("navbar..",sessionStorage.getItem('borrowerId'));
   	this.collateralreservesModel = {

	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : 'borrowers/'+sessionStorage.getItem('borrowerId')+'/inventory_reserves', deleteApi: '', updateApi : '' },
	        type : 'Collateral Reserves',
	        columnDef : [      
	                  {field: 'description', header: 'Description', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'advance_pct', header: 'Advance Percentage', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'actual_value', header: 'Value', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'reserve_values', header: 'Reserve', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'reserve_pct', header: 'Reserve Percentage', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      ]
	    }
    
      } 

  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  	this._service.setHeight();
  }



}
