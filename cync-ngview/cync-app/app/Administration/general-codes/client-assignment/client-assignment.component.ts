import { Component, OnInit} from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import {PortFolioManagersModel, ClientModel} from './client-assignment.model';
import {Location} from '@angular/common';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { FilterByPipe } from './filter.pipe';

@Component({
  selector: 'app-client-assignment',
  templateUrl: './client-assignment.component.html',
  styleUrls: ['./client-assignment.component.css']
})
export class ClientAssignmentComponent implements OnInit {

  portFolioManagersList: PortFolioManagersModel[];
  manager: PortFolioManagersModel;
  filteredManagersList: any[];
  managerTo: PortFolioManagersModel = new PortFolioManagersModel;
  clientsByManagerList: ClientModel[];
  pm_id: number;
  to_id: number;
  requestModel: any;
  assignedClientsList: ClientModel[];
  disableButton = false;
  clientFromName: any = '';
  sc: any[];
  clientToName: any = '';
  fmList: any[];


  constructor(private _service: CustomHttpService, private _location: Location, private _message: MessageServices) {
  	let tempManagersList: any;
   	this._service.getCall('admin/get_portfolio_managers').then(i => {
   		tempManagersList = this._service.bindData(i);
   		this.portFolioManagersList = tempManagersList.portfolio_managers;
   	});

  }

  ngOnInit() {
    this._service.setHeight();
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
  }

  searchManager(event){
  	const filteredManager: any[] = [];
  	for (let i = 0; i < this.portFolioManagersList.length; i++){
  		const tempManager = this.portFolioManagersList[i];
  		if (tempManager.user_name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            filteredManager.push(tempManager);
        }
  	}
  	this.filteredManagersList = filteredManager;
    this.fmList = filteredManager;
  }

  reInitializeClientsFromData(){
  	this.clientsByManagerList = [];
    this.sc = [];
  	this.disableButton = true;
    this.clientFromName = '';
  }

  reInitializeClientsToData(){
  	this.assignedClientsList = [];
  	this.disableButton = true;
  }

  searchClientByManager(){
    /*this._message.showLoader(false);*/
  	this.disableButton = false;
  	this.pm_id = this.manager.id;
  	let tempClientsList: any;
  	this._service.getCall('/admin/getting_clients_by_portfolio_managers?pm_id=' + this.pm_id).then(i => {
  		tempClientsList = this._service.bindData(i);
  		this.clientsByManagerList = tempClientsList.borrowers;
      console.log(':::this.clientsByManagerList------', this.clientsByManagerList);
  	});

  }

  searchAssignedClientByManager(){
   /* this._message.showLoader(false);*/
    this.disableButton = false;
  	this.to_id = this.managerTo.id;
  	let tempAssignedClients: any;
  	this._service.getCall('/admin/getting_clients_by_portfolio_managers?pm_id=' + this.to_id).then(i => {
  		tempAssignedClients = this._service.bindData(i);
  		this.assignedClientsList = tempAssignedClients.borrowers;

  	});

  }

  copyClients(){
  	if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0){
  		const copyClientsModel = {
  			'pm_id' : this.pm_id,
  			'to_id' : this.to_id,
  			'assigning_clients' : this.sc.toString(),
  			'to_copy': 'true'
  		};
  		const copySuccessMsg = 'You have Copied clients successfully.';
  		this.copyOrTransferClientsCall(copyClientsModel, copySuccessMsg);
  	}
  }

  transferClients(){
  	if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0){
  		const transferClientsModel = {
  			'pm_id' : this.pm_id,
  			'to_id' : this.to_id,
  			'assigning_clients' : this.sc.toString(),
  			'to_copy': 'false'
  		};
  		const transferSuccessMsg = 'You have Transfered clients successfully.';
  		this.copyOrTransferClientsCall(transferClientsModel, transferSuccessMsg);
  		this.reInitializeClientsFromData();
  		this.searchClientByManager();
  	}
  }

  copyOrTransferClientsCall(copyOrTransferModel: any, successMsg: any){
  		this.requestModel = {url: 'admin/assign_portfolio_managers', model: copyOrTransferModel};
        this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome(successMsg));
  }

  navigateToHome(msg: any) {
    /*this._location.back(); */
   /* this._message.showLoader(false); */
    this._message.addSingle(msg, 'success');
    this.searchAssignedClientByManager();
  }

  isValid(){
  	if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0 && !this.disableButton
      && this.to_id != this.pm_id)
  		return false;
  	return true;
  }

  clearClientFromInput(evt1){
    this.manager = new PortFolioManagersModel();
    this.reInitializeClientsFromData();
  }

  clearClientToInput(evt2){
    this.managerTo = new PortFolioManagersModel();
    this.reInitializeClientsToData();
  }

}
