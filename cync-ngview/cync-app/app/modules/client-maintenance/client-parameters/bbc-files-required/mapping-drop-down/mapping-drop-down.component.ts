import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ClientParameterService } from '../../service/client-parameter.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
        selector: 'app-mapping-drop-down',
        templateUrl: './mapping-drop-down.component.html',
        styleUrls: ['./mapping-drop-down.component.scss']
})
export class MappingDropDownComponent implements OnInit {
        mappingGroup: any;
        divisionId: any;
        collateralId: any;
        clientId: any;
        public showTextBox: any;
        public paramsData: any;

        constructor(private _apiMapper: APIMapper,
                private helper: Helper,
                private clientParameterService: ClientParameterService) { 
                        this.clientId = CyncConstants.getSelectedClient();
                }

        ngOnInit() {

                this.helper.getClientID().subscribe((data) => {
                        let cltid = data;
                        if (cltid !== 'null') {
                                this.clientId = data;
                                this.afterBorrowChangeLoad();
                        }
                });
                if (this.clientId !== undefined) {
                        this.afterBorrowChangeLoad();
                }

                this.clientParameterService.getMappingBasedData().subscribe(res => {
                        this.showTextBox = res;
                });

        }
        afterBorrowChangeLoad() {
                this.getMappingGroupData();
        }

        agInit(params: any): void {
                this.paramsData = params;
                this.collateralId = params.value;
        }


        getMappingGroupData() {
                let url = this._apiMapper.endpoints[CyncConstants.GET_COLLATERAL_DATA_BBC].replace('{client_Id}', this.clientId);
                this.clientParameterService.getBbcFileRequiredService(url).subscribe(response => {
                        let mapping_value = JSON.parse(response._body).mapping_value;
                        this.mappingGroup = mapping_value;
                });
        }

        onChangeCollateral(event) {
                let id = event.target.value;
                let data = { index: this.paramsData.rowIndex, collateralId: id };
                this.paramsData.context.componentParent.onChangeCollateral(data);
        }
}
