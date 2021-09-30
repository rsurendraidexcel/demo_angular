import { Component, OnInit } from '@angular/core';
import { WebHooksService } from './web-hooks.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Helper } from '@cyncCommon/utils/helper';
import { GridOptions } from 'ag-grid-community';
import { DeleteButtonComponent } from './delete-button.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'app-web-hooks',
  templateUrl: './web-hooks.component.html',
  styleUrls: ['./web-hooks.component.scss']
})

export class WebHooksComponent implements OnInit {
  createWebhookForm : FormGroup;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  rowData: any;
  gridOptions: GridOptions;
  gridColumnApi: any;
  dropdownList: any;
  isValidForm: boolean;

  constructor(
    private webHooksService: WebHooksService,
    private _helper: Helper,
    private _message: MessageServices
  ) {
    this.isValidForm = true;
    this.initWebHooksForm();
     this.rowData = [];
     this.columnDefs = [
      {
        headerName: 'Target URL',
        field: 'target_url',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Event',
        field: 'display_key',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Auth Key',
        field: 'auth_key',
        filter: 'agTextColumnFilter',
        cellStyle: { 'text-align': 'left' },

      },
      {
        headerName: 'Auth Value',
        field: 'auth_value',
        filter: 'agTextColumnFilter',
        cellStyle: { 'text-align': 'left' },
      },

      {
        headerName: 'Action',
        field: 'action',
        width: 160,
        filter: false,
        cellStyle: { 'text-align': 'left' },
        cellRendererFramework: DeleteButtonComponent
      }
    ];

    this.gridOptions = {
      rowData: this.rowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true,
      suppressRowClickSelection: true
    };

    this.defaultColDef = {
      resizable: true,
      filter: true
    }
  }

  /**
   * On Grid Ready Method
   * @param params
   */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridApi.showLoadingOverlay();
  }

  ngOnInit() {
    this.getEventList();
  }

  onCourserOut(evnet: any){
    const tempElment = document.querySelector("#target_url") as HTMLInputElement;
    if(this.checkIsValidDomain(evnet.target.value)){
       this.isValidForm = true;
       tempElment.style.border='1px solid red';
    }else{
       this.isValidForm = false;
       tempElment.style.border='1px solid #aaa';
    }

  }

  /**
  * Get Webhooks list data
  *
  */
  getWebhookDetails() {
    const url = 'lenderhooks';
    let that = this;
    this.webHooksService.getWebhookList(url).subscribe(response => {
      var updatedRowData = response;
        for (let i = 0; i < updatedRowData.length; i++) {
          updatedRowData[i].display_key = that.dropdownList.filter(hook => hook.value === updatedRowData[i].event )[0].display;
      }
      this.rowData = updatedRowData;
    }, error => {
    });
  }

  initWebHooksForm(){
    this.createWebhookForm = new FormGroup({
      target_url: new FormControl(''),
      events: new FormControl(''),
      auth_key: new FormControl(''),
      auth_value: new FormControl('')
    });
  }

  // get eventlist api details
  getEventList(){
    let url = 'registerhooks';
    let that = this;
    this.webHooksService.getEventList(url).subscribe(res => {
      const eventList= res;
      const tempList= [];
      eventList.forEach((elm) =>  {
        tempList.push({'value': elm.event, 'display': elm.display_key });
      });
      this.dropdownList = tempList;
      that.getWebhookDetails();
    });
  }

  // create API for webhook
  webHooksSubmit(){
    let url = 'lenderhooks';
    let temurl=`https://${this.createWebhookForm.get('target_url').value}`;
    const body={
      target_url: temurl ,
      event: this.createWebhookForm.get('events').value,
      auth_key: this.createWebhookForm.get('auth_key').value,
      auth_value: this.createWebhookForm.get('auth_value').value
    };
    this._message.showLoader(true);
    this.webHooksService.createWebhook(url, body).subscribe( res => {
      this._helper.showApiMessages("Record saved successfully.", 'success');
      this._message.showLoader(false);
      this.resetWebHookForm();
      this.getWebhookDetails();
    }, error => {
      this._message.showLoader(false);
      let errorMessage = (JSON.parse(error._body)).message;
      this._helper.showApiMessages(errorMessage, 'danger');
    });
  }

  // reset the form of webhook
  resetWebHookForm(){
    this.createWebhookForm.patchValue({
      target_url: '',
      events: '',
      auth_key: '',
      auth_value: ''
    })
  }

  /**
  * Delete button click event
  * @param event
  */
  deleteWebhook(event: any){
    this.showConfirmationPopup(event.data);
  }

  /**
  * Delete confirm popup window
  * @param selectedRowData (selected row data)
  */
  showConfirmationPopup(selectedRowData: any) {
    this._helper.openConfirmPopup({ "title": CyncConstants.CONFIRMATION_POPUP_TITLE, "message": "Are you sure, you want to delete the selected webhook event?", "msgType": "warning" }).subscribe(result => {
      if (result) {
        this._message.showLoader(true);
        this.deleteSelectedRows(selectedRowData);
      }
    });
  }

  /**
  * Final delete api call
  * @param data
  */
  deleteSelectedRows(data: any){
    let url = 'lenderhooks/' + data.id;
    this.webHooksService.deleteWebhook(url, '').subscribe( res => {
      this._helper.showApiMessages("Record deleted successfully.", 'success');
      this._message.showLoader(false);
      this.resetWebHookForm();
      this.getWebhookDetails();
    }, error => {
      this._message.showLoader(false);
      let errorMessage = (JSON.parse(error._body)).message;
      this._helper.showApiMessages(errorMessage, 'danger');
    });
  }

checkIsValidDomain(domain) {
  try{
  var url = new URL(domain);
  } catch (_) {
    return false;
  }
  return true
}



}
