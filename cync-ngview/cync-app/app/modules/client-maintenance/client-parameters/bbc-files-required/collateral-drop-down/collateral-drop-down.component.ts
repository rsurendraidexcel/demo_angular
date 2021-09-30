import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ClientParameterService } from '../../service/client-parameter.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-collateral-drop-down',
  templateUrl: './collateral-drop-down.component.html',
  styleUrls: ['./collateral-drop-down.component.scss']
})
export class CollateralDropDownComponent implements OnInit {

  collateralValue: any;
  divisionId: any;
  clientId: any;
  public mappingId;
  public paramsData: any;
  public showMappingGroup: boolean = false;

  constructor(private _apiMapper: APIMapper,
    private clientParameterService: ClientParameterService,
    private clientSelectSrv: ClientSelectionService,
    private helper: Helper) {
      this.clientId = CyncConstants.getSelectedClient();
     }

  ngOnInit() {
    this.helper.getClientID().subscribe((data) => {
      let cltid = data;
      if(cltid!=='null'){
        this.clientId = data;
        this.afterBorrowChangeLoad();
      }
    });
    if(this.clientId !== undefined){
       this.afterBorrowChangeLoad();
    }
    
    this.clientParameterService.getMappingBasedData().subscribe(res => {
      this.showMappingGroup = res;
      console.log("showMappingGroup", this.showMappingGroup)
    })
  }

  afterBorrowChangeLoad() {
    this.getMappigData();
  }
  
  agInit(params: any): void {
    this.paramsData = params;
    if (params.value === null) {
      this.mappingId = "SourceDocuments"
    } else {
      this.mappingId = params.value;
    }
  }

  getMappigData() {
    let url = this._apiMapper.endpoints[CyncConstants.GET_MAPPING_GROUP_DATA].replace('{client_Id}', this.clientId);
    this.clientParameterService.getBbcFileRequiredService(url).subscribe(response => {
      let file_value = JSON.parse(response._body).mapping_groupname;
      this.collateralValue = file_value;
    })
  }

  oChangeMappingGroup(event) {
    let id = event.target.value;
    let url = this._apiMapper.endpoints[CyncConstants.MAPPING_GROUP_BASED_DATA].replace('{client_Id}', this.clientId).replace('{mapping_Id}', id);
    this.clientParameterService.getBbcFileRequiredService(url).subscribe(response => {
      let mappingData = JSON.parse(response._body);
      let data = { index: this.paramsData.rowIndex, rowdata: this.paramsData.data, mapData: mappingData, mappingId: id };
      this.paramsData.context.componentParent.onChangeMappingGroup(data);
    })
  }
  refresh(params: any): boolean {
    return false;
  }

}
