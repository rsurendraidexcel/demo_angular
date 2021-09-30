import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { PortFolioManagersModel, ClientModel, PrimaryManagersModel } from './client-assignment.model';
import { Location } from '@angular/common';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { FilterByPipe } from './filter.pipe';
import { isEmpty } from 'rxjs/operator/isEmpty';

@Component({
  selector: 'app-client-assignment',
  templateUrl: './client-assignment.component.html',
  styleUrls: ['./client-assignment.component.css']
})
export class ClientAssignmentComponent implements OnInit {

  portFolioManagersList: PortFolioManagersModel[];
  primaryManagersList: PrimaryManagersModel[];
  manager: PortFolioManagersModel = new PortFolioManagersModel;
  primaryManager: PrimaryManagersModel = new PrimaryManagersModel;
  filteredManagersList: any[];
  filteredPrimaryManagersList: any[];
  managerTo: PortFolioManagersModel = new PortFolioManagersModel;
  clientsByManagerName: ClientModel[];
  pm_id: number;
  to_id: number;
  requestModel: any;
  assignedClientsList: ClientModel[];
  disableButton = false;
  clientFromName: any = '';
  sc: any[];
  clientToName: any = '';
  fmList: any[];
  showCloseIcon = false;
  showManagerCloseIcon = false;
  primaryManagerId: number;
  showPrimaryManagerCloseIcon = false;
  fpmList: any[];
  primaryManagerTo: PrimaryManagersModel = new PrimaryManagersModel;
  showPmToCloseIcon = false;
  to_PmId: number;
  emailCheckedValue : boolean = true;

  constructor(private _service: CustomHttpService, private _location: Location, private _message: MessageServices) {
    let tempManagersList: any;
    this._service.getCall("admin/get_portfolio_managers").then(i => {
      if (i != undefined) {
        tempManagersList = this._service.bindData(i);
        this.portFolioManagersList = tempManagersList.portfolio_managers;
        this.primaryManagersList = tempManagersList.primary_managers;
      }

    })

  }

  ngOnInit() {
    $("#checkboxSelection").hide();
    this._service.setHeight();
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
  }


  /*ManagerToClearTxt ()
  {
     this.managerTo.user_name='';
  }*/

  searchManagerWhileAssigingClientsFrom(event) {
    let filteredManager: any[] = [];
    for (let i = 0; i < this.portFolioManagersList.length; i++) {
      const tempManager = this.portFolioManagersList[i];
      if (tempManager.user_name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filteredManager.push(tempManager);
      }
    }
    this.filteredManagersList = filteredManager;
    this.fmList = filteredManager;

    if (this.filteredManagersList.length == 0) this.clientsByManagerName = [];
  }

  searchPrimaryManagerWhileAssigingClientsFrom(event) {
    let filteredManager: any[] = [];
    for (let i = 0; i < this.primaryManagersList.length; i++) {
      const tempManager = this.primaryManagersList[i];
      if (tempManager.user_name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filteredManager.push(tempManager);
      }
    }
    this.filteredPrimaryManagersList = filteredManager;
    this.fpmList = filteredManager;

    if (this.filteredPrimaryManagersList.length == 0) this.clientsByManagerName = [];
  }

  searchManagerWhileAssigingClientsTo(event) {
    let filteredManager: any[] = [];
    for (let i = 0; i < this.portFolioManagersList.length; i++) {
      const tempManager = this.portFolioManagersList[i];
      if (tempManager.user_name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filteredManager.push(tempManager);
      }
    }
    this.filteredManagersList = filteredManager;
    this.fmList = filteredManager;
    if (this.fmList.length == 0) this.assignedClientsList = [];
  }

  searchPrimaryManagerWhileAssigingClientsTo(event) {
    let filteredManager: any[] = [];
    for (let i = 0; i < this.primaryManagersList.length; i++) {
      const tempManager = this.primaryManagersList[i];
      if (tempManager.user_name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filteredManager.push(tempManager);
      }
    }
    this.filteredPrimaryManagersList = filteredManager;
    this.fpmList = filteredManager;
    if (this.fpmList.length == 0) this.assignedClientsList = [];
  }

  /**
   * 
   * @param input 
   */
  isManagerExists(input: string): boolean {
    for (let i = 0; i < this.portFolioManagersList.length; i++) {
      const tempManager = this.portFolioManagersList[i];
      if (tempManager.user_name.toLowerCase() == input.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  reInitializeClientsFromData(event) {
    let tmpManager: any = this.manager;
    if (tmpManager.length == 0) {
      this.showManagerCloseIcon = false;
      this.clientsByManagerName = [];
    } else if (tmpManager.length > 0) {
      this.showManagerCloseIcon = true;
    }
    this.sc = [];
    this.disableButton = true;
    this.clientFromName = '';
  }

  reInitializePrimaryMangerFromData(event) {
    let tmpManager: any = this.primaryManager;
    if (tmpManager.length == 0) {
      this.showPrimaryManagerCloseIcon = false;
      this.clientsByManagerName = [];
    } else if (tmpManager.length > 0) {
      this.showPrimaryManagerCloseIcon = true;
    }
    this.sc = [];
    this.disableButton = true;
    this.clientFromName = '';
  }

  reInitializeClientsToData() {
    //this.assignedClientsList = [];
    let tmpManager: any = this.managerTo;
    if (tmpManager.length == 0) {
      this.showCloseIcon = false;
      this.assignedClientsList = [];
    } else if (tmpManager.length > 0) {
      this.showCloseIcon = true;
    }
    this.disableButton = true;
  }

  reInitializePmToFromData() {
    //this.assignedClientsList = [];
    let tmpManager: any = this.primaryManagerTo;
    if (tmpManager.length == 0) {
      this.showPmToCloseIcon = false;
      this.assignedClientsList = [];
    } else if (tmpManager.length > 0) {
      this.showPmToCloseIcon = true;
    }
   // this.disableButton = true;
  }

  searchClientByManager() {
    /*this._message.showLoader(false);*/
    this.disableButton = false;
    this.pm_id = this.manager.id;
    this.primaryManagerId = this.primaryManager.id;
    let pmId;
    let mId;
    if(this.primaryManagerId == undefined){
      pmId = '';
    }else{
      pmId = this.primaryManagerId;
    }
    if(this.pm_id == undefined){
      mId = '';
    }else{
      mId = this.pm_id;
    }
    let tempClientsList: any;
    this._service.getCall("/admin/getting_clients_by_portfolio_managers?pm_id=" + mId +'&primary_manager_id='+pmId).then(i => {
      if (i != undefined) {
        tempClientsList = this._service.bindData(i);
        this.clientsByManagerName = tempClientsList.borrowers;
        if(this.clientsByManagerName.length!= 0)
        {
          $("#checkboxSelection").show();
        } else {
          $("#checkboxSelection").hide();
        }
        /*console.log(":::this.clientsByManagerList------",this.clientsByManagerList);*/
      }

    });

  }

  searchAssignedClientByManager() {
    /* this._message.showLoader(false);*/
    this.disableButton = false;
    this.to_id = this.managerTo.id;
    this.to_PmId = this.primaryManagerTo.id;
    let pmId;
    let mId;
    if(this.to_PmId == undefined){
      pmId = '';
    }else{
      pmId = this.to_PmId;
    }
    if(this.to_id == undefined){
      mId = '';
    }else{
      mId = this.to_id;
    }
    let tempAssignedClients: any;
    this._service.getCall("/admin/getting_clients_by_portfolio_managers?pm_id=" + mId +'&primary_manager_id='+pmId).then(i => {
      if (i != undefined) {
        tempAssignedClients = this._service.bindData(i);
        this.assignedClientsList = tempAssignedClients.borrowers;
        /*console.log(":::this.assignedClientsList------",this.assignedClientsList);*/
        if( this.assignedClientsList .length!= 0)
        {
          $("#checkboxSelection").show();
        } else {
          $("#checkboxSelection").hide();
        }
      }

    });

  }

  copyClients() {
   // if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0) {
      const copyClientsModel = {
        'pm_id': this.pm_id,
        'to_id': this.to_id,
        'assigning_clients': this.sc.toString(),
        'to_copy': 'true',
        "primary_manager_id": this.primaryManagerId,
        "to_primary_manager": this.to_PmId,
        "to_email" : this.emailCheckedValue
      };
      const copySuccessMsg = 'You have Copied clients successfully.';
      this.copyOrTransferClientsCall(copyClientsModel, copySuccessMsg);
  //  }
  }

  eventCheck(values:any){
    this.emailCheckedValue = values.target.checked;
}
  transferClients() {
    //if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0) {
      const transferClientsModel = {
        'pm_id': this.pm_id,
        'to_id': this.to_id,
        'assigning_clients': this.sc.toString(),
        'to_copy': 'false',
        "primary_manager_id": this.primaryManagerId,
        "to_primary_manager": this.to_PmId,
        "to_email" : this.emailCheckedValue
      };
      let transferSuccessMsg = "You have Transfered clients successfully."
      this.copyOrTransferClientsCall(transferClientsModel, transferSuccessMsg);
      /*After Transfering clients, client list was not updating immediately hence used settimeout */
      setTimeout(() => {
        this.reInitializeClientsFromData(null);
        this.searchClientByManager();
      }, 600);
  }

  copyOrTransferClientsCall(copyOrTransferModel: any, successMsg: any) {
    
    this.requestModel = { url: 'admin/assign_portfolio_managers', model: copyOrTransferModel };
    this._service.postCallpatch(this.requestModel).then(i => {
      /**
      If Post Call response returns a null Or sends a proper response object other 
      than undefined then show the success message 
      Else it means API has failed and would throw error message*/
      if (i != undefined || i == null) {
        /*Uncheck all checkboxes once clients are copied or transfered successfully*/
        this.sc = [];

        this.navigateToHome(successMsg);
        if(this.clientsByManagerName.length!= 0){
          $("#checkboxSelection").show();
         
        }else {
          $("#checkboxSelection").hide();
        }
        console.log("resp---", i);
      }

    });
    $("#check").prop("checked", false);
  }

  navigateToHome(msg: any) {
    /*this._location.back(); */
    /* this._message.showLoader(false); */
    this._message.addSingle(msg, "success");
    setTimeout(() => {
      this.searchAssignedClientByManager();
    }, 600);

  }

  isValid() {
    if(this.primaryManager.id !== undefined && this.to_id > 0 && this.sc.length > 0 && this.primaryManagerTo.id == undefined ){
       return false;
    }else{
      if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0 && !this.disableButton
        && this.to_id != this.pm_id && this.primaryManagerTo.id == undefined)
        return false;
      return true;
    }
  }

  isTransferValid(){
    if(this.primaryManagerTo.id == undefined){
      if(this.to_id > 0 && this.primaryManagerId > 0 && this.sc.length > 0){
        return false;
      }else{
        if (this.to_id > 0 && this.pm_id > 0 && this.sc.length > 0 && !this.disableButton
          && this.to_id != this.pm_id)
          return false;
        return true;      
      }
    }else{
      if (this.sc.length > 0 && !this.disableButton)
        return false;
      return true;
    }
  }

  clearClientFromInput(evt1) {
    if(this.primaryManagerId==undefined){
      $("#checkboxSelection").hide();
      this.showManagerCloseIcon = false;
      this.clientsByManagerName = [];
      this.manager = new PortFolioManagersModel();
      this.reInitializeClientsFromData(null);
    }else{
      this.manager = new PortFolioManagersModel();
      this.showManagerCloseIcon = false;
      this.searchClientByManager();
    }
  }

  clearClientFromPmInput(evt1) {
    if(this.pm_id==undefined){
      $("#checkboxSelection").hide();
      this.showPrimaryManagerCloseIcon = false;
      this.clientsByManagerName = [];
      this.primaryManager = new PrimaryManagersModel();
      this.reInitializeClientsFromData(null);
    }else{
      this.primaryManager = new PrimaryManagersModel();
      this.showPrimaryManagerCloseIcon = false;
      this.searchClientByManager();
    }

  }

  clearClientToInput(evt2) {
    this.to_id  = undefined;
    if (this.to_PmId == undefined) {
      $("#checkboxSelection").hide();
      this.showCloseIcon = false;
      this.assignedClientsList = [];
      this.managerTo = new PortFolioManagersModel();
      this.reInitializeClientsToData();
    } else {
      this.managerTo = new PortFolioManagersModel();
      this.showCloseIcon = false;
      this.searchAssignedClientByManager();
    }

  }

  clearClientToPmInput(evt2) {
    if (this.to_id == undefined) {
      this.showPmToCloseIcon = false;
      this.assignedClientsList = [];
      this.primaryManagerTo = new PrimaryManagersModel();
      this.reInitializeClientsToData();
    } else {
      this.primaryManagerTo = new PrimaryManagersModel();
      this.showPmToCloseIcon = false;
      this.searchAssignedClientByManager();
    }
  }

  onAllClickSelect(values:any) {
         this.sc=[];
         if( this.clientsByManagerName!= undefined){
          $("#checkboxSelection").show();
          if(values.target.checked === true){
            this.clientsByManagerName.forEach(val => {
             this.sc.push(`${val.id}`);
            });
          } else {
            this.sc = [];
          }
        } else {
          $("#checkboxSelection").hide();
        }
  }

}
