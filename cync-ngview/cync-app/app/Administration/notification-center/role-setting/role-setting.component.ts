import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RoleListModel } from './role-setting.Model';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { navbarComponent } from '../../../navbar/navbar.component';
import { CyncConstants } from 'app-common/utils/constants';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';

@Component({
  selector: 'app-role-setting',
  templateUrl: './role-setting.component.html'
})
export class RoleSettingComponent implements OnInit {

  lenderId: string;
  roleId: number;
  roleList: RoleListModel[];
  role: RoleListModel;
  filteredRolesList: any[] = [];
  roleSettingListList: any;
  productType: any = "ABL";
  dataCollection: any[] = [];
  subscriptionArray: any[] = [];
  changedValueRole: boolean;
  roleLength: number;
  requestModel: any;
  isSelectAll = 'hide';
  dataCollectionArray: any[] = [];
  isEditShowIcon = 'hide';
  isHideShowData = 'hide';
  selectedListValue: any;
  isDisable: boolean = true;
  showCloseIcon: boolean = true;
  productTypeList: any;
  product_Type: String = "ABL";
  roleSettingsPermArr: any[] = [];
  hasPermission: boolean = true;

  constructor(private rolesPermComp: CheckPermissionsService, private _location: Location, private _message: MessageServices, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig, private _navbar: navbarComponent) {

    /*Based on the User Role Permissions Enable or Disable the Edit Icon*/
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
      setTimeout(() => {
        this.roleSettingsPermArr = JSON.parse(localStorage.getItem("roleSettingsPermissionsArray"));
        this.hasPermission = this.rolesPermComp.checkPermissions(this.roleSettingsPermArr, "save_borrower_notifications");
      }, 600);
    }

     this.lenderId = this.config.getConfig('lenderId'); 
     //Code Changes done for CYNCS-2678 begin - API Changed with new API irrespective of roles assigned
     this._service.getCall('/roles/data_for_user_creation?sort_by=ASC').then(i=> {
      //Code Changes done for CYNCS-2678 - ends
     this.roleList = this._service.bindData(i).roles; 
    }); 
     this.isSelectAll = "hide";
     this.isEditShowIcon = "";
     this._service.getCall('/lender/subscriptions').then(i=> {
     this.productTypeList = this._service.bindData(i).subscriptions;
     });
  }

  ngOnInit() {
    this._message.showLoader(true);
    this._service.setHeight();
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();
    //if (this._navbar.angularMenu !== undefined) this._navbar.angularMenu[0].path = '/notificationCenter/role-setting';
  }

  roledata(id: number) {
    this.clearSearchBox();
    this.isSelectAll = "";
    this.isEditShowIcon = "hide";
    this.isHideShowData = "";
    this.roleId = id;
    this.selectedListValue = id;
    this.changedValueRole = false;
    this.isDisable = true;
    this.roleSettingData(this.roleId);
  }

  searchRole(event) {
    const filteredRole: any[] = [];
    for (let j = 0; j < this.roleList.length; j++) {
      const roleName = this.roleList[j];
      if (roleName.name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filteredRole.push(roleName);
      }
    }
    this.filteredRolesList = filteredRole;
  }

  onChangeProductType(productType) {
    this.product_Type = productType;
    this.isEditShowIcon = "";
    this.isHideShowData = "hide";
    this.changedValueRole = false;
    this.isDisable = true;

    if (this.roleId != null && this.roleId != undefined) {
      this.roleSettingData(this.roleId);
    }
    this.clearSearchBox();
  }


  searchRoleByName() {
    this.isSelectAll = '';
    this.isEditShowIcon = 'hide';
    this.isHideShowData = '';
    this.roleId = this.role.id;
    this.roleSettingData(this.roleId);
    if (this.hasPermission) {
      this.isDisable = false;
    }
    this.changedValueRole = false;
    this.selectedListValue = this.roleId;
    let offset = $('#roleIdsListCollection li').first().position().top;
    $('#roleIdsListCollection').scrollTop($("#" + this.selectedListValue).position().top - offset);
  }

  roleSettingData(id: number) {

    this._service.getCall('/role_notifications?role_id=' + this.roleId).then(i => {
      this.roleSettingListList = this._service.bindData(i);
      if (this.product_Type == "ABL" && this.product_Type != undefined) {
        this.dataCollection = [];
        this.subscriptionArray = [];
        this.dataCollection = this.roleSettingListList.product_type_ABL.role_notifications;
        for (let j = 0; j < this.dataCollection.length; j++) {
          if (this.dataCollection[j].email == true && this.dataCollection[j].text == true) {
            this.subscriptionArray.push('B');
          }
          else if (((this.dataCollection[j].email == true) && (this.dataCollection[j].text == false || this.dataCollection[j].text == null))) {
            this.subscriptionArray.push('E');
          }
          else if (((this.dataCollection[j].text == true) && (this.dataCollection[j].email == false || this.dataCollection[j].email == null))) {
            this.subscriptionArray.push('T');
          }
          else {
            this.subscriptionArray.push('S');
          }

        }
      } else if (this.product_Type == "FACTORING" && this.product_Type != undefined) {
        this.dataCollection = [];
        this.subscriptionArray = [];
        this.dataCollection = this.roleSettingListList.product_type_FACTORING.role_notifications;
        for (let j = 0; j < this.dataCollection.length; j++) {
          if (this.dataCollection[j].email == true && this.dataCollection[j].text == true) {
            this.subscriptionArray.push('B');
          }
          else if (((this.dataCollection[j].email == true) && (this.dataCollection[j].text == false || this.dataCollection[j].text == null))) {
            this.subscriptionArray.push('E');
          }
          else if (((this.dataCollection[j].text == true) && (this.dataCollection[j].email == false || this.dataCollection[j].email == null))) {
            this.subscriptionArray.push('T');
          }
          else {
            this.subscriptionArray.push('S');
          }
        }

      }
    });

  }

  onChangeForRole(selected: any) {
    for (let unselectCheckBox = 0; unselectCheckBox < this.dataCollection.length; unselectCheckBox++) {
      if ((<HTMLInputElement>document.getElementById('typeValueRole' + unselectCheckBox)).value != selected) {
        this.changedValueRole = false;
      }
      if (this.hasPermission) {
        this.isDisable = false;
      }
    }
  }

  selectAllForRole(event) {
    this.changedValueRole = event;
    if (event) {
      this.roleLength = this.subscriptionArray.length;
      this.subscriptionArray = [];
      for (let k = 0; k < this.roleLength; k++) {
        this.subscriptionArray.push('B');
      }
    }
    else {
      this.roleSettingData(this.roleId);
    }
  }
  saveData() {
    if (this.product_Type == "ABL") {
      this.dataCollectionArray = [];
      for (let i = 0; i < this.dataCollection.length; i++) {
        if ((<HTMLInputElement>document.getElementById('typeValueRole' + i)).value == 'T') {
          this.dataCollection[i].text = true;
          this.dataCollection[i].email = false;
        } else if ((<HTMLInputElement>document.getElementById('typeValueRole' + i)).value == 'E') {
          this.dataCollection[i].text = false;
          this.dataCollection[i].email = true;
        } else if ((<HTMLInputElement>document.getElementById('typeValueRole' + i)).value == 'B') {
          this.dataCollection[i].text = true;
          this.dataCollection[i].email = true;
        } else {
          this.dataCollection[i].text = false;
          this.dataCollection[i].email = false;
        }

      }
      for (let j = 0; j < this.dataCollection.length; j++) {

        this.dataCollectionArray.push({
          'email_list_id': this.dataCollection[j].email_list_id,
          'email': this.dataCollection[j].email,
          'text': this.dataCollection[j].text
        });
      }
    }
    else if (this.product_Type == "FACTORING") {
      this.dataCollectionArray = [];
      for (let i = 0; i < this.dataCollection.length; i++) {
        if ((<HTMLInputElement>document.getElementById('typeValueRole' + i)).value == 'T') {
          this.dataCollection[i].text = true;
          this.dataCollection[i].email = false;
        } else if ((<HTMLInputElement>document.getElementById('typeValueRole' + i)).value == 'E') {
          this.dataCollection[i].text = false;
          this.dataCollection[i].email = true;
        } else if ((<HTMLInputElement>document.getElementById('typeValueRole' + i)).value == 'B') {
          this.dataCollection[i].text = true;
          this.dataCollection[i].email = true;
        } else {
          this.dataCollection[i].text = false;
          this.dataCollection[i].email = false;
        }

      }
      for (let k = 0; k < this.dataCollection.length; k++) {

        this.dataCollectionArray.push({
          'email_list_id': this.dataCollection[k].email_list_id,
          'email': this.dataCollection[k].email,
          'text': this.dataCollection[k].text
        });
      }
    }
    if (this.dataCollection.length > 0) {
      const roleSettingsModel = {
        'role_notifications': this.dataCollectionArray
      };
      this._message.showLoader(true);
      this.requestModel = { url: '/role_notifications?role_id=' + this.roleId, model: roleSettingsModel };
      this._service.postCallpatch(this.requestModel).then(i => {
        this.dataCollection = [];
        this.navigateToHome();
      });
    }
  }

  navigateToHome() {
    this._message.showLoader(false);
    this._message.addSingle('Record saved successfully.', 'success');
    this.changedValueRole = false;
    this.roleSettingData(this.roleId);
    this.isHideShowData = "";
    this.isEditShowIcon = "hide";
    this.isSelectAll = "hide";
    this.isDisable = true;
  }

  cancelRoleSetting() {
    this.changedValueRole = false;
    this.isHideShowData = 'hide';
    this.isEditShowIcon = '';
    this.isSelectAll = 'hide';
    this.role = null;
    this.productType = "ABL";
    this.product_Type = "ABL";
    this.isDisable = true;
  }
  clearSearchBox() {
    this.role = null;
    this.showCloseIcon = true;
  }

  showCloseIconKey() {
    this.showCloseIcon = false;
  }

  onKeyPress(name:any){
    if(name==''){
    this.showCloseIcon = true;
    }else{
      this.showCloseIcon = false;
    }
  }

}

