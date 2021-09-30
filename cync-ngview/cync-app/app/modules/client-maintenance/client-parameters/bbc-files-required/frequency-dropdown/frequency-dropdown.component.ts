import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ClientParameterService } from '../../service/client-parameter.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-frequency-dropdown',
  templateUrl: './frequency-dropdown.component.html',
  styleUrls: ['./frequency-dropdown.component.scss']
})
export class FrequencyDropdownComponent implements OnInit {
  frequencyValues: any;
  public frequency;
  public paramsData: any;
  clientId:any

  constructor(private _apiMapper: APIMapper,
    private clientParameterService: ClientParameterService,
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
    
  }
  afterBorrowChangeLoad(){
    this.getFrequencyData();
  }

  agInit(params: any): void {
    this.paramsData = params;
    this.frequency = params.value;
  }

  getFrequencyData() {
    let url = this._apiMapper.endpoints[CyncConstants.GET_FREQUENCY_DATA].replace('{client_Id}', this.clientId);
    this.clientParameterService.getBbcFileRequiredService(url).subscribe(response => {
      let file_value = JSON.parse(response._body).bbc_frequency;
      this.frequencyValues = file_value;
    });
  }

  oChangeFrequency(event) {
    let id = event.target.value;
    //  this.clientParameterService.setFrequencyId(id);
    let data = { index: this.paramsData.rowIndex, frequencyId: id };
    this.paramsData.context.componentParent.onChangeFrequency(data);
  }
}
