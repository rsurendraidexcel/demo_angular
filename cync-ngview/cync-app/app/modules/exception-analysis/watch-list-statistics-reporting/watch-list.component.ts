import { Component, OnInit } from '@angular/core';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import {MessageServices} from '@cyncCommon/component/message/message.component';


@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html'
})
export class WatchListComponent{

watchlistModel : GridModel;
   coulmnDefinition : ColumnDefinition;
   lenderId: string;

  constructor(private config: AppConfig, private _service: CustomHttpService, private _message: MessageServices) {
   	this.lenderId = this.config.getConfig('lenderId');
   	this.watchlistModel = {

	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : '/exception_statistics_reportings', deleteApi: '', updateApi : '' },
	        type : 'Watch List',
	        columnDef : [      
	                    {field: 'exception_description', header: 'Exception Description', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'client_pct', header: 'Client %', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'client_count', header: 'Client Count', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      ]
	    }
    
      } 
  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  	this._service.setHeight();
  	//this._message.cync_notify(null,null,0);
  }

 

}