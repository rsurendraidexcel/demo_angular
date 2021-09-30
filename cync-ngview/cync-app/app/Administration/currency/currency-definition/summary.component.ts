import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';

@Component({
    selector: 'summary-comp',
    templateUrl: './summary.component.html'
})

export class currencySummaryComponent {

model: GridModel;
lenderId: string;
coulmnDefinition: ColumnDefinition;

constructor(private config: AppConfig, private _message: MessageServices, private _service: CustomHttpService) {
    this.lenderId = this.config.getConfig('lenderId');
    this.model = {

        infiniteScroll : true,
        multiSelection : false,
        onDemandLoad : true,
        singleSelection : false,
        apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/currencies', deleteApi: '/v1/lenders/' + this.lenderId + '/currencies', updateApi : '/v1/lenders/' + this.lenderId + '/currencies' },
        type : 'Currency Definition',
        columnDef : [
                    {field: 'currencyName', header: 'Currency', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'currencyCode', header: 'Code', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'currencyDescription', header: 'Description', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'ccyCountry.countryName', header: 'Country', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'currencyDecimalPrecision', header: 'Precision', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'currencyRoundingUnit', header: 'Rounding Unit', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'currencyInterestMethod.intMethName', header: 'Interest Method', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'currencyRoundingPrefs.name', header: 'Rounding Preference', sortable : true, isTemplate : false , templateHtml : '', hidden: true, filter: false},
                    {field: 'currencyCutoffTime', header: 'Cut Off Time', sortable : true, isTemplate : false , templateHtml : '', hidden: true, filter: false},
                    {field: 'currencyFormatMask.formatMaskName', header: 'Format Mask', sortable : true, isTemplate : false , templateHtml : '', hidden: true, filter: false}
                    ]
    };
}
ngOnInit(){
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._service.setHeight();
}
}
