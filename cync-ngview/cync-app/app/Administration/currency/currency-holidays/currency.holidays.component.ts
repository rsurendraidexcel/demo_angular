import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';

@Component({
    selector: 'currency-holidays-comp',
    templateUrl: './currency.holidays.component.html'
})

export class currencyHolidaysComponent {

   currencyHolidayModel: GridModel;

   coulmnDefinition: ColumnDefinition;
   lenderId: string;

   constructor(private config: AppConfig, private _service: CustomHttpService) {
   	this.lenderId = this.config.getConfig('lenderId');
   	this.currencyHolidayModel = {

	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/currencyholidays', deleteApi: '', updateApi : '' },
	        type : 'Currency Holiday',
	        columnDef : [
	        			{field: 'currency.currencyName', header: 'Currency', sortable : true, isTemplate : false , templateHtml : '', hidden: true, filter: false},
	                    {field: 'currency.currencyCode', header: 'Code', sortable : true, isTemplate : false , templateHtml : '', hidden: true, filter: false},
	                    {field: 'year', header: 'Year', sortable : true, isTemplate : true , templateHtml : '', hidden: true, filter: false},
	                    {field: 'holidayDescription', header: 'Holiday Name', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'fromDate', header: 'From Date', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'toDate', header: 'To Date', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'holidaysStatus', header: 'Status', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'recurring', header: 'Recurring', sortable : true, isTemplate : true , templateHtml : '', hidden: false, filter: false}
	                    ]
	    };

      }
	ngOnInit(){
	    $('#cync_app_dashboard').removeClass('loading-modal-initial');
	    this._service.setHeight();
	}
}
