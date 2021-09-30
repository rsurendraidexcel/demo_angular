import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ClientParameterService } from '../../service/client-parameter.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-file-classfication-dropdown',
  templateUrl: './file-classfication-dropdown.component.html',
  styleUrls: ['./file-classfication-dropdown.component.scss']
})
export class FileClassficationDropdownComponent implements OnInit {
  fileValues: any;
  public fileClassficationId: any;
  public paramsData:any;
  clientId:any;

  constructor(private _apiMapper: APIMapper,
    private helper: Helper,
    private clientParameterService: ClientParameterService) { 
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
  this.geFileClassificationData();
  }

  agInit(params: any): void {
    this.paramsData = params;
    this.fileClassficationId = params.value;
  }

  geFileClassificationData() {
    let url = this._apiMapper.endpoints[CyncConstants.FILE_CLASSIFICATION_LIST].replace('{client_Id}', this.clientId);
    this.clientParameterService.getBbcFileRequiredService(url).subscribe(response => {
      let file_value = JSON.parse(response._body);
      if (file_value !== null)
        this.fileValues = file_value.file_value;
    });
  }
  onChangeFileClassification(event) {
    let id = event.target.value;
    // this.clientParameterService.setFileClassificationId(id);
    let data = { index: this.paramsData.rowIndex, fileClassificationId: id };
    this.paramsData.context.componentParent.onChangeFileClassification(data);
  }
}
