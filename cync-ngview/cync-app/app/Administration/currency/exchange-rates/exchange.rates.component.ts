import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';

@Component({
    selector: 'exchange-rates-comp',
    templateUrl: './exchange.rates.component.html'
})

export class exchangeRatesComponent {

model: GridModel;
historyModel: GridModel;
lenderId: string;
coulmnDefinition: ColumnDefinition;
//apiURL: string;
//exchangeRateHistoryDetails: any;

	constructor(private config: AppConfig, private _service: CustomHttpService) {
		this.lenderId = this.config.getConfig('lenderId');
	    this.model = {
	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/exchangerates', deleteApi: '', updateApi : '' },
	        type : 'Exchange Rate',
	        columnDef : [
	                    {field: 'currencyPair.currencyIdBase.currencyCode', header: 'Currency 1', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'currencyPair.currencyIdTo.currencyCode', header: 'Currency 2', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'createdAt', header: 'Date', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false}
	                    ]
	    };

	    this.historyModel = {
	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/exchangeratehistories', deleteApi: '', updateApi : '' },
	        type : 'Exchange Rate History',
	        columnDef : [
	                    {field: 'createdAt', header: 'Date', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Currency Pairs', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Rate Type', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Mid Rate', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Buy Spread', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Sell Spread', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Buy Rate', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: '', header: 'Sell Rate', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false}
	                    ]
	    };
	}

ngOnInit(){
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._service.setHeight();
}

showHistory(){
	document.getElementById('exchangeHistory').style.display = 'block';
	document.getElementById('uiOverlay').style.display = 'block';
}

hideHistory(){
	document.getElementById('exchangeHistory').style.display = 'none';
	document.getElementById('uiOverlay').style.display = 'none';
}

}
