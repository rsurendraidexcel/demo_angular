import { Component, OnInit } from '@angular/core';
import {Response} from '@angular/http';
import { AppConfig } from '../../../app.config';
import  {CustomHttpService} from '../../../../app-common/services/http.service';

@Component({
selector: 'currency-pair-summary',
templateUrl: './currency.pair.summary.html'
})
export class CurrencyPairSummary implements OnInit {

    currencypairSummary: any;
    lenderId: string;

    constructor(private config: AppConfig, private _service: CustomHttpService){
        this.lenderId = this.config.getConfig('lenderId');
    }
    ngOnInit()
    {
        $('#cync_app_dashboard').removeClass('loading-modal-initial');
        this._service.setHeight();
        this.currencypairSummary = {
            infiniteScroll : true,
            multiSelection : false,
            onDemandLoad : true,
            singleSelection : false,
            apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/currencypairs', deleteApi: '', updateApi : '' },
            type : 'Currency Pair',
            columnDef : [
            {field: 'currencyIdBase.currencyCode', header: 'Currency 1', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
            {field: 'currencyIdTo.currencyCode', header: 'Currency 2', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
            {field: 'currencyIdThru.currencyCode', header: 'Through Currency', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
            {field: 'quotationMethod', header: 'Quotation Method', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
            {field: 'noOfUnits', header: 'No. of Units', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
            {field: 'spreadDefinition', header: 'Spread Definition', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false}
            ]
        };
    }
}
