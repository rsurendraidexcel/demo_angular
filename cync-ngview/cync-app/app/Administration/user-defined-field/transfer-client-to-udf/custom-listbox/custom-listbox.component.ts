import { Component, EventEmitter, IterableDiffers, Input, Output, OnInit, ViewChild, HostListener } from '@angular/core';
import { DualListComponent, BasicList } from 'angular-dual-listbox';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { TransferClientToUdfService } from '../services/transfer-client-to-udf.service';
import { UDFModel, UDFValueModel, ClientModel, TransferClientsRequestBody } from '../models/transfer-client-to-udf.model';
import { combineAll } from 'rxjs/operator/combineAll';

@Component({
  selector: 'app-custom-listbox',
  templateUrl: './custom-listbox.component.html',
  styleUrls: ['./custom-listbox.component.style.scss']
})
export class CustomListboxComponent extends DualListComponent implements OnInit {

  @Output() selectChange = new EventEmitter();
  isSummaryPermitted: boolean;
  isTransferPermitted: boolean;
  transferClientFromHeading: string = CyncConstants.TRANSFER_CLIENT_FROM_HEADING;
  transferClientToHeading: string = CyncConstants.TRANSFER_CLIENT_TO_HEADING;
  tempUdfList: UDFModel[] = [];
  showCloseIconUDFFrom: boolean;
  udfFromClientList: ClientModel[] = [];
  udfToClientList: ClientModel[] = [];
  isUDFFromSelected = false;
  isUDFToSelected = false;
  concatFromClientList: any;
  fromUDFNameList: UDFModel[] = [];
  fromUDFValuesList: UDFValueModel[] = [];
  selectedUDFFromName = '';
  selectedUDFFromValue = '';
  toUDFNameList: UDFModel[] = [];
  toUDFValuesList: UDFValueModel[] = [];
  selectedUDFToName = '';
  selectedUDFToValue = '';
  selectAllCheckbox: boolean;
  isUDFToClientSelected = false;

  constructor(differs: IterableDiffers, private _transferClientToUdfService: TransferClientToUdfService,
    private _helper: Helper,
    private _router: Router,
    private _apiMapper: APIMapper,
    private _message: MessageServices) {
    super(differs);
  }

  ngOnInit() {
    this._message.showLoader(true);
    this.getPermissions();
    this.initializeUDFList();
    this._helper.adjustUI();
  }

  /*
  * Initialized UDF Name list
  */
  initializeUDFList() {
    this._transferClientToUdfService.getUDFList(this._apiMapper.endpoints[CyncConstants.GET_TRANSFER_CLIENT_UDF_LIST])
    .subscribe(udfResponse => {
      this.tempUdfList = udfResponse['udfs'];
      this.fromUDFNameList = udfResponse['udfs'];
      this.toUDFNameList = udfResponse['udfs'];
      this._message.showLoader(false);
    });
  }

  /**
  * Call the helper method to get all the menu permissions
	*/
  getPermissions() {
    const userRoleId = localStorage.getItem('cyncUserRoleId'); /*Logged In User*/
    const roleType = localStorage.getItem('cyncUserRole');
    if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
      this._transferClientToUdfService.getMenuPermission(CyncConstants.UDF_TRANSFER_MENU_NAME).subscribe(permissionsResponse => {
        this.isSummaryPermitted = this._helper.getSummaryPermission(permissionsResponse);
        this.isTransferPermitted = this._helper.getTransferPermission(permissionsResponse);
      });
    } else {
      this.isSummaryPermitted = true;
      this.isTransferPermitted = true;
    }
  }


  /*
  * On change UDF-From name List
  * @param event
  */
  onChangeUDFFromName(event: any) {
    if (this.selectedUDFFromName !== '') {
      this._message.showLoader(true);
      // Remove Same UDF name from UDF-To List
      const filteredArray = this.tempUdfList.filter((item) => item.id.toString() !== this.selectedUDFFromName.toString());
      this.toUDFNameList = filteredArray;
      this.getUDFValues(this.selectedUDFFromName, CyncConstants.TRANSFER_CLIENTS_UDF_FROM_STRING);
    } else {
      this.fromUDFValuesList = [];
      this.toUDFNameList = this.tempUdfList;
    }
    this.available = new BasicList('available');
    this.selectAllCheckbox = false;
    this.isUDFFromSelected = false;
    this.selectedUDFFromValue = '';
    this.isUDFToClientSelected = false;
  }

  /*
  * get list of UDF values
  * @param udfid
  * @param UDF type
  */
  getUDFValues(udfid: string, type: string) {
    this._transferClientToUdfService.getUDFValues(this._apiMapper.endpoints[CyncConstants.GET_TRANSFER_CLIENT_UDF_VALUES_LIST] + udfid)
    .subscribe(udfResponse => {
      if (type === CyncConstants.TRANSFER_CLIENTS_UDF_FROM_STRING) {
        this.fromUDFValuesList = udfResponse['udf_values'];
      } else if (type === CyncConstants.TRANSFER_CLIENTS_UDF_To_STRING) {
        this.toUDFValuesList = udfResponse['udf_values'];
      }
      this._message.showLoader(false);
    });
  }

  /*
  * On change UDF-From value List
  * @param event
  */
  onChangeUDFFromValue(event: any) {
    if (this.selectedUDFFromValue !== '') {
      this._message.showLoader(true);
      this.getUDFClientDetails(this.selectedUDFFromName, this.selectedUDFFromValue, CyncConstants.TRANSFER_CLIENTS_UDF_FROM_STRING);
    } else {
      this.isUDFFromSelected = false;
      this.available = new BasicList('available');
      this.selectAllCheckbox = false;
    }
    this.isUDFToClientSelected = false;
  }

  /*
  * Get udf client details accoring to UDF ID
  * @param udfname
  * @param udfvalue
  * @param type
  */
  getUDFClientDetails(udfname: string, udfvalue: string, type: string) {
    const url = this._apiMapper.endpoints[CyncConstants.GET_TRANSFER_UDF_CLIENT_DETAILS].replace('{udf_id}', udfname)
    .replace('{udf_value}', udfvalue);
    if (type === CyncConstants.TRANSFER_CLIENTS_UDF_FROM_STRING) {
      this.isUDFFromSelected = true;
      this._transferClientToUdfService.getUDFClientDetails(url, type).subscribe(udfClientResponse => {
        this.udfFromClientList = udfClientResponse['clients'];
        if (this.selectedUDFToName !== '' && this.selectedUDFToValue !== '') {
          this.concatFromClientList = this.udfFromClientList.concat(this.udfToClientList);
          this.source = JSON.parse(JSON.stringify(this.concatFromClientList));
          this.destination = JSON.parse(JSON.stringify(this.udfToClientList));
        } else {
          this.source = JSON.parse(JSON.stringify(this.udfFromClientList));
        }
        this._message.showLoader(false);
      });
    } else if (type === CyncConstants.TRANSFER_CLIENTS_UDF_To_STRING) {
      this.isUDFToSelected = true;
      this._transferClientToUdfService.getUDFClientDetails(url, type).subscribe(udfClientResponse => {
        this.udfToClientList = udfClientResponse['clients'];
        if (this.selectedUDFFromName !== '' && this.selectedUDFFromValue !== '') {
          this.concatFromClientList = this.udfFromClientList.concat(this.udfToClientList);
          this.source = JSON.parse(JSON.stringify(this.concatFromClientList));
        } else {
          this.source = JSON.parse(JSON.stringify(this.udfToClientList));
        }
        this.destination = JSON.parse(JSON.stringify(this.udfToClientList));
        this._message.showLoader(false);
      });
    }
  }

  /*
  * On key press event while searching client by name
  * @param event
  */
  onKeyPressClientSearch(event: any) {
    this.selectAllCheckbox = false;
    if (this.available.picker === '') {
      this.showCloseIconUDFFrom = false;
    } else {
      this.showCloseIconUDFFrom = true;
    }
  }

  /*
  * Clear search client value
  */
  clearClientSearchBox() {
    this.showCloseIconUDFFrom = false;
    this.clearFilter(this.available);
  }

  /*
  * On change UDF-To name List
  * @param event
  */
  onChangeUDFToName(event: any) {
    this.selectedUDFToValue = '';
    this.isUDFToSelected = false;
    this.isUDFToClientSelected = false;
    if (this.selectedUDFToName !== '') {
      this._message.showLoader(true);
      const filteredArray = this.tempUdfList.filter((item) => item.id.toString() !== this.selectedUDFToName.toString());
      this.fromUDFNameList = filteredArray;
      this.getUDFValues(this.selectedUDFToName, CyncConstants.TRANSFER_CLIENTS_UDF_To_STRING);
    } else {
      this.toUDFValuesList = [];
      this.fromUDFNameList = this.tempUdfList;
    }
    this.available = new BasicList('available');
    this.confirmed = new BasicList('confirmed');
    this.source = [];
    this.destination = [];
    this.selectAllCheckbox = false;
    if (this.selectedUDFFromName !== '' && this.selectedUDFFromValue !== '') {
      this.source = JSON.parse(JSON.stringify(this.udfFromClientList));
    }
    this.showCloseIconUDFFrom = false;
  }

  /*
  * On change UDF-To name List
  * @param event
  */
  onChangeUDFToValue(event: any) {
    if (this.selectedUDFToValue !== '') {
      this._message.showLoader(true);
      this.getUDFClientDetails(this.selectedUDFToName, this.selectedUDFToValue, CyncConstants.TRANSFER_CLIENTS_UDF_To_STRING);
    } else {
      this.isUDFToSelected = false;
      this.available = new BasicList('available');
      this.confirmed = new BasicList('confirmed');
      this.source = [];
      this.destination = [];
      this.source = JSON.parse(JSON.stringify(this.udfFromClientList));
      this.showCloseIconUDFFrom = false;
    }
    this.isUDFToClientSelected = false;
    this.selectAllCheckbox = false;
  }

  /*
  * Checkbox select all clients
  */
  selectAllTransfer() {
    if (this.selectAllCheckbox) {
      this.selectAll(this.available); // Select all while clicking on checkbox
      this.isUDFToClientSelected = true;
    } else {
      this.selectNone(this.available); // Remove all selected  using checkbox
      this.isUDFToClientSelected = false;
    }
  }

  /*
  * Internal function select Item.
  */
  selectItem(list: Array<any>, item: any) {
    this.selectAllCheckbox = false;
    const pk = list.filter((e: any) => {
      return Object.is(e, item);
    });
    if (pk.length > 0) {
      // Already in list, so deselect.
      for (let i = 0, len = pk.length; i < len; i += 1) {
        const idx = list.indexOf(pk[i]);
        if (idx !== -1) {
          list.splice(idx, 1);
          this.selectChange.emit({ key: item.id, selected: false });
        }
      }
    } else {
      list.push(item);
      this.selectChange.emit({ key: item.id, selected: true });
    }
  }

  /*
  * Validating both UDF-To and UDF-From selected or not
  */
  isFormValid() {
    if (this.isUDFFromSelected && this.isUDFToSelected) {
      return true;
    } else {
      return false;
    }
  }

  /*
  * Validating Transfer button conditions 
  */
  transferButtonValidation() {
    if (this.isFormValid() && this.isTransferPermitted && this.isUDFToClientSelected) {
      return true;
    } else {
      return false;
    }
  }
  /*
  * Reset Client list
  */
  resetClients() {
    if (this.isFormValid()) {
      this.source = JSON.parse(JSON.stringify(this.concatFromClientList));
      this.destination = JSON.parse(JSON.stringify(this.udfToClientList));
    } else {
      this.available = new BasicList('available');
      this.confirmed = new BasicList('confirmed');
      this.source = [];
      this.destination = [];
      this.udfFromClientList = null;
      this.udfToClientList = null;
      this.selectedUDFFromName = '';
      this.selectedUDFFromValue = '';
      this.selectedUDFToName = '';
      this.selectedUDFToValue = '';
      this.fromUDFNameList = this.tempUdfList;
      this.toUDFNameList = this.tempUdfList;
    }
    this.available.picker = ''; // Reset filter value
    this.selectAllCheckbox = false;
    this.isUDFToClientSelected = false;
  }

  /*
  * Transfer clients UDF-From to UDF-To showing popup window
  */
  transferClients() {
    this.showConfirmationPopup();
  }

  /**
  * Delete confirm popup window
  */
  showConfirmationPopup() {
    this._helper.openConfirmPopup({ 'title': CyncConstants.CONFIRMATION_POPUP_TITLE,
    'message': CyncConstants.TRANSFER_CLIENTS_POP_UP_MESSAGE, 'msgType': 'warning' }).subscribe(result => {
      if (result) {
        this.selectAllCheckbox = false;
        this.updateClientDetails();
      }
    });
  }

  /**
  * UDF-To client selection event
  */
  isUDFToClientSelectionMethod(selectedClientLength: number){
    if(selectedClientLength > 0){
      this.isUDFToClientSelected = true;
    }else{
      this.isUDFToClientSelected = false;
    }
  }

  /**
  * Update client details with API Call
  */
  updateClientDetails() {
    this._message.showLoader(true);
    this.moveItem(this.available, this.confirmed);
    // Filtering client Id's selected from UDF-From list.
    const selectedFromClientList = [];
    for (let i = 0; i < this.available.list.length; i++) {
      selectedFromClientList.push(parseInt(this.available.list[i]['_id']));
    }

    // Filtering client Id's selected from UDF-To list.
    const selectedToClientList = [];
    for (let j = 0; j < this.confirmed.list.length; j++) {
      selectedToClientList.push(parseInt(this.confirmed.list[j]['_id'].replace('#', '')));
    }

    // Remove duplicate Id from selected UDF-To client list
    const filterSelectedToClientList = selectedToClientList.filter(function (item, pos) {
      return selectedToClientList.indexOf(item) === pos;
    });

    // Formatting request body
    const requestBody = new TransferClientsRequestBody();
    requestBody.udf_details = [{
      udf_id: parseInt(this.selectedUDFFromName),
      udf_value: this.selectedUDFFromValue,
      clients: selectedFromClientList
    }, {
      udf_id: parseInt(this.selectedUDFToName),
      udf_value: this.selectedUDFToValue,
      clients: filterSelectedToClientList
    }];

    // Calling Update API
    this._transferClientToUdfService.updateTransferClients(this._apiMapper.endpoints[CyncConstants.UPDATE_TRANSFER_UDF_CLIENT_DETAILS],
       requestBody).subscribe(updateUdfClientResponse => {
      if (updateUdfClientResponse.status === CyncConstants.STATUS_204 || updateUdfClientResponse.status === CyncConstants.STATUS_200) {
        this._helper.showApiMessages(CyncConstants.TRANSFER_CLIENTS_UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
        this.available = new BasicList('available');
        this.confirmed = new BasicList('confirmed');
        this.getUDFClientDetails(this.selectedUDFFromName, this.selectedUDFFromValue, CyncConstants.TRANSFER_CLIENTS_UDF_FROM_STRING);
        this.getUDFClientDetails(this.selectedUDFToName, this.selectedUDFToValue, CyncConstants.TRANSFER_CLIENTS_UDF_To_STRING);
        this.isUDFToClientSelected = false;
      } else {
        this.resetClients();
        this._message.showLoader(false);
      }
    });
  }
}
