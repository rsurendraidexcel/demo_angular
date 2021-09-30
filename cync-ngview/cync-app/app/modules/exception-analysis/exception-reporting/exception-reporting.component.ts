import { Component, OnInit } from '@angular/core';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import {MessageServices} from '@cyncCommon/component/message/message.component';


@Component({
  selector: 'app-exception-reporting',
  templateUrl: './exception-reporting.component.html'
})
export class ExceptionReportingComponent{

exceptionreportingModel : GridModel;
   coulmnDefinition : ColumnDefinition;
   lenderId: string;

  constructor(private config: AppConfig, private _service: CustomHttpService, private _message: MessageServices) {
   	this.lenderId = this.config.getConfig('lenderId');
   	this.exceptionreportingModel = {

	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : '/exception_statistics_reportings', deleteApi: '', updateApi : '' },
	        type : 'Exception Reporting',
	        columnDef : [      
	                    {field: 'exception', header: 'Exception', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'clientName', header: 'Client Name', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'creditLine', header: 'Client Line', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'loanBalance', header: 'Loan Balance', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'standardValue', header: 'Standard Value', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: '', header: '2014-2015', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},

                      ]
	    }
    
      } 
  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  	//this._service.setHeight();
  	//this._message.cync_notify(null,null,0);
  }

 

}