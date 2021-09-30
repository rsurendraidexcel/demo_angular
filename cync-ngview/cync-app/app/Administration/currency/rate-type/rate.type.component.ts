import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';

@Component({
    selector: 'rate-type-comp',
    templateUrl: './rate.type.component.html'
})

export class rateTypeComponent implements OnInit {

model: GridModel;
coulmnDefinition: ColumnDefinition;
lenderId: string;

constructor(private config: AppConfig, private _service: CustomHttpService) {
    this.lenderId = this.config.getConfig('lenderId');
    this.model = {
        infiniteScroll : true,
        multiSelection : false,
        onDemandLoad : true,
        singleSelection : false,
        apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/ratetypes', deleteApi: '/v1/lenders/' + this.lenderId + '/ratetypes', updateApi : '/v1/lenders/' + this.lenderId + '/ratetypes' },
        type : 'Rate Type',
        columnDef : [
                    {field: 'rateTypeName', header: 'Rate Type', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'rateTypeDescription', header: 'Description', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false}

                    ]
    };
}

ngOnInit(){
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._service.setHeight();
}

}
