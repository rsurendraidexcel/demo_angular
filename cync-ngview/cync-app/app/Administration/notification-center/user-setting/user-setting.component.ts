import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ClientListModel, UserListModel } from './user-setting.Model';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { navbarComponent } from '../../../navbar/navbar.component';
import { CyncConstants } from 'app-common/utils/constants';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  tempClientsList: ClientListModel[];
  client: ClientListModel;
  filteredClientsList: any[] = [];
  hideAllField = 'hide';
  isEditShowIcon = 'hide';
  hideData = 'hide';
  isShowClientIcon = '';
  tempUsersList: UserListModel[];
  user: UserListModel;
  filteredUsersList: any[] = [];
  userSettingForm: FormGroup;
  clientId: number;
  userId: number;
  userSubscriptionList: any;
  userSubscriptionArray: any;

  ablArray: any[] = [];
  selectedAblValue: any[] = [];
  factoringArray: any[] = [];
  selectedFactoringValue: any[] = [];
  dataCollection: any[] = [];
  ablLength: number;
  factoringLength: number;
  requestModel: any;
  changedValueABL: boolean;
  changedValueFACT: boolean;
  product_type: string;
  selectedListValue: any;
  isDisable: boolean = true;
  showCloseIcon: boolean = false;
  showUserCloseIcon: boolean = false;
  userSettingsPermArr: any[] = [];
  hasPermission: boolean = true;
  hideText: string = "";

  constructor(private rolesPermComp: CheckPermissionsService, private _service: CustomHttpService, private _location: Location, private _message: MessageServices, private _navbar: navbarComponent) {

    /*Based on the User Role Permissions Enable or Disable the Edit Icon*/
       let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
       if(userRole !== CyncConstants.ADMIN_ROLE_TYPE){
         /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
         setTimeout (() => {
           this.userSettingsPermArr = JSON.parse(localStorage.getItem("userSettingsPermissionsArray"));
           this.hasPermission = this.rolesPermComp.checkPermissions(this.userSettingsPermArr,"save_email_subscriptions");
         }, 600);
       }

     this._service.getCall("borrowers").then(i => {
       this.tempClientsList = this._service.bindData(i).borrowers;
     });

    // this._service.getCall("admin/users").then(i =>{
    // this.tempUsersList = this._service.bindData(i).users;
    // });  
  }

  ngOnInit() {
    this._message.showLoader(true);
    this._service.setHeight();
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();
    //$("#routerLinkId").addClass("active");
    //if (this._navbar.angularMenu !== undefined) this._navbar.angularMenu[0].path = '/notificationCenter/user-setting';
  }


  searchClient(event) {
    let filteredClient: any[] = [];
    for (var j = 0; j < this.tempClientsList.length; j++) {
      let clientName = this.tempClientsList[j];
      if (clientName.client_name.toLowerCase().indexOf(event.query.toLowerCase()) != -1) {
        filteredClient.push(clientName);
      }
    }
    this.filteredClientsList = filteredClient;
  }

  searchClientByName() {
    this.isEditShowIcon = '';
    this.clientId = this.client.id;
    this.hideAllField = "";
    this.hideData = "hide";
    this.isShowClientIcon = "hide";
    this.getManagersList();
  }

  searchUser(event) {
    const filteredUser: any[] = [];
    for (let i = 0; i < this.tempUsersList.length; i++) {
      const tempUser = this.tempUsersList[i];
      if (tempUser.user_name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filteredUser.push(tempUser);
      }
    }
    this.filteredUsersList = filteredUser;
  }

  searchUserByName() {
    this.userId = this.user.id;
    this.isEditShowIcon = "hide";
    this.hideAllField = "";
    this.hideData = "";
    /*if(this.hasPermission){
      this.isDisable = false;
    }*/
    this.isDisable = true;
    this.userSubscriptionData(this.userId);
  }

  userSubscriptionData(id: number) {
    this.changedValueABL = false;
    this.changedValueFACT = false;
    this.product_type = '';
    this._service.getCall('borrowers/' + this.clientId + '/user_notifications?user_id=' + id).then(i => {
      this.userSubscriptionList = this._service.bindData(i);
      this.userSubscriptionArray = this.userSubscriptionList.user_subscriptions;
      this.ablArray = [];
      this.selectedAblValue = [];
      this.selectedFactoringValue = [];
      this.factoringArray = [];
      if (this.userSubscriptionList.product_type == 'ABL') {
        this.product_type = 'ABL';

        for (let j = 0; j < this.userSubscriptionArray.length; j++) {
          this.ablArray.push(this.userSubscriptionArray[j]);

          if (this.userSubscriptionArray[j].email_subscription == true && this.userSubscriptionArray[j].text_subscription == true) {
            this.selectedAblValue.push('B');
          }

          else if ((this.userSubscriptionArray[j].email_subscription == true) && ((this.userSubscriptionArray[j].text_subscription == null) || (this.userSubscriptionArray[j].text_subscription == false))) {
            this.selectedAblValue.push('E');
          }

          else if (((this.userSubscriptionArray[j].email_subscription == false) || (this.userSubscriptionArray[j].email_subscription == null)) && (this.userSubscriptionArray[j].text_subscription == true)) {
            this.selectedAblValue.push('T');
          }

          else
            this.selectedAblValue.push('S');
        }

      } else if (this.userSubscriptionList.product_type == 'FACTORING') {
        this.product_type = 'FACTORING';

        for (let j = 0; j < this.userSubscriptionArray.length; j++) {
          this.factoringArray.push(this.userSubscriptionArray[j]);

          if (this.userSubscriptionArray[j].email_subscription == true && this.userSubscriptionArray[j].text_subscription == true) {
            this.selectedFactoringValue.push('B');
          }

          else if ((this.userSubscriptionArray[j].email_subscription == true) && ((this.userSubscriptionArray[j].text_subscription == null) || (this.userSubscriptionArray[j].text_subscription == false))) {
            this.selectedFactoringValue.push('E');
          }

          else if ((this.userSubscriptionArray[j].text_subscription == true) && ((this.userSubscriptionArray[j].email_subscription == false) || (this.userSubscriptionArray[j].email_subscription == null))) {
            this.selectedFactoringValue.push('T');
          }

          else
            this.selectedFactoringValue.push('S');
        }

      }
      else if (this.userSubscriptionList.product_type == null) {
        this.product_type = '';
        this.ablArray = [];
        this.factoringArray = [];
        this.selectedAblValue = [];
        this.selectedFactoringValue = [];
      }
    });
  }

  userName(data: number) {
    /*if(this.hasPermission){
      this.isDisable = false;
    }*/
    this.isDisable = true;
    this.userId = data;
    this.isEditShowIcon = 'hide';
    this.hideAllField = '';
    this.hideData = '';
    this.userSubscriptionData(this.userId);
  }

  selectAllForAbl(event) {
    this.changedValueABL = event;
    if (event) {
      this.ablLength = this.selectedAblValue.length;
      this.selectedAblValue = [];
      for (let k = 0; k < this.ablLength; k++) {
        this.selectedAblValue.push('B');
      }
    }
    else {
      this.userSubscriptionData(this.userId);
    }
  }

  selectAllForFactoring(event) {
    this.changedValueFACT = event;
    if (event) {
      this.factoringLength = this.selectedFactoringValue.length;
      this.selectedFactoringValue = [];
      for (let k = 0; k < this.factoringLength; k++) {
        this.selectedFactoringValue.push('B');
      }
    }
    else {
      this.userSubscriptionData(this.userId);
    }
  }

  onChangeForAbl(selected: any) {
    for (let unselectCheckBoxABL = 0; unselectCheckBoxABL < this.ablArray.length; unselectCheckBoxABL++) {
      if ((<HTMLInputElement>document.getElementById('typeValueABL' + unselectCheckBoxABL)).value != selected) {
        this.changedValueABL = false;
      }
    }
    if (this.hasPermission) {
      this.isDisable = false;
    }
  }

  onChangeForFactoring(selected: any) {
    for (let unselectCheckBoxFACT = 0; unselectCheckBoxFACT < this.factoringArray.length; unselectCheckBoxFACT++) {
      if ((<HTMLInputElement>document.getElementById('typeValueFACT' + unselectCheckBoxFACT)).value != selected) {
        this.changedValueFACT = false;
      }
    }
    if (this.hasPermission) {
      this.isDisable = false;
    }
  }

  saveData() {
    if (this.product_type == 'FACTORING') {
      for (let settingsFACT = 0; settingsFACT < this.factoringArray.length; settingsFACT++) {
        if ((<HTMLInputElement>document.getElementById('typeValueFACT' + settingsFACT)).value == 'T') {
          this.factoringArray[settingsFACT].text_subscription = true;
          this.factoringArray[settingsFACT].email_subscription = false;
        } else if ((<HTMLInputElement>document.getElementById('typeValueFACT' + settingsFACT)).value == 'E') {
          this.factoringArray[settingsFACT].text_subscription = false;
          this.factoringArray[settingsFACT].email_subscription = true;
        } else if ((<HTMLInputElement>document.getElementById('typeValueFACT' + settingsFACT)).value == 'B') {
          this.factoringArray[settingsFACT].text_subscription = true;
          this.factoringArray[settingsFACT].email_subscription = true;
        } else {
          this.factoringArray[settingsFACT].text_subscription = false;
          this.factoringArray[settingsFACT].email_subscription = false;
        }
      }
      for (let setModel = 0; setModel < this.factoringArray.length; setModel++) {
        this.dataCollection.push({
          'email_list_id': this.factoringArray[setModel].email_list_id,
          'email_subscription': this.factoringArray[setModel].email_subscription,
          'text_subscription': this.factoringArray[setModel].text_subscription
        });
      }
    }
    else if (this.product_type == 'ABL') {
      for (let settingsABL = 0; settingsABL < this.ablArray.length; settingsABL++) {
        if ((<HTMLInputElement>document.getElementById('typeValueABL' + settingsABL)).value == 'T') {
          this.ablArray[settingsABL].text_subscription = true;
          this.ablArray[settingsABL].email_subscription = false;
        } else if ((<HTMLInputElement>document.getElementById('typeValueABL' + settingsABL)).value == 'E') {
          this.ablArray[settingsABL].text_subscription = false;
          this.ablArray[settingsABL].email_subscription = true;
        } else if ((<HTMLInputElement>document.getElementById('typeValueABL' + settingsABL)).value == 'B') {
          this.ablArray[settingsABL].text_subscription = true;
          this.ablArray[settingsABL].email_subscription = true;
        } else {
          this.ablArray[settingsABL].text_subscription = false;
          this.ablArray[settingsABL].email_subscription = false;
        }
      }
      for (let setModel = 0; setModel < this.ablArray.length; setModel++) {
        this.dataCollection.push({
          'email_list_id': this.ablArray[setModel].email_list_id,
          'text_subscription': this.ablArray[setModel].text_subscription,
          'email_subscription': this.ablArray[setModel].email_subscription
        });
      }
    }
    if (this.dataCollection.length > 0) {
      const userSettingsModel = {
        'user_subscriptions': this.dataCollection
      };
      this._message.showLoader(true);
      this.requestModel = { url: 'borrowers/' + this.clientId + '/user_notifications?user_id=' + this.userId, model: userSettingsModel };
      this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome());
    } else {
      this.navigateToHome();
    }
  }

  navigateToHome() {
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
    this.hideAllField = "";
    //this.isEditShowIcon = "hide";
    this.hideData = "hide";
    //this.isShowClientIcon = "hide";
    //this.client = null;
    //this.user = null;
    //this.userId=null;
    this.dataCollection = [];
    this.userSubscriptionData(this.userId);
    this.product_type = "";
    this.isDisable = true;


  }

  cancelUserSetting() {
    this.hideAllField = 'hide';
    this.isEditShowIcon = 'hide';
    this.hideData = 'hide';
    this.isShowClientIcon = '';
    this.client = null;
    this.user = null;
    this.product_type = '';
    this.dataCollection = [];
    this.isDisable = true;
  }
  clearSearchBox() {
    this.user = null;
    this.showUserCloseIcon = false;
  }

  clearClientSearchBox() {
    this.client = null;
    this.showCloseIcon = false;
    this.hideText = "hide";
    this.isEditShowIcon = "hide";
    this.hideAllField = "hide";
    this.hideData = "hide";
    this.isDisable = true;
    this.userId = null;
  }

  getManagersList() {

    this._service.getCall('borrowers/get_managers_list?borrower_id=' + this.clientId).then(i => {
      this.tempUsersList = this._service.bindData(i).managers;
    });
  }

  
  onKeyPress(name:any){
    if(name==''){
    this.showCloseIcon = false;
    }else{
      this.showCloseIcon = true;
    }
  }


}
