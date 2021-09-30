import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { RoleModel, PermissionModel } from './roles-and-permissions.model';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { Router } from "@angular/router";
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExportPopupComponent } from '@app/Administration/user-maintenance/roles-and-permissions/export-popup/export-popup.component';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html',
  styleUrls: ['./roles-and-permissions.component.css']
})
export class RolesAndPermissionsComponent implements OnInit {

  rolesList: RoleModel[] = [];
  selectedRole: any;
  addCustomRole: FormGroup;
  isRoleNameValid: boolean = true;
  isParentRoleValid: boolean = true;
  isRoleTypeValid: boolean = true;
  isRoleDescValid: boolean = true;
  requestModel: any;
  isDisable: boolean = false;
  customRoleData: any;
  buttonTextValue: string = 'Save';
  isDisableCreateButton: boolean = false;
  responseData: any[];
  permissionData: any[];
  roleTypeList: any;
  actionsChkBox: boolean = false;
  isDisableActions: boolean = true;
  allPermissionsArray: Array<any> = [];
  backupPermissionData: Array<any> = [];
  createdRoleId: any;
  tempSelectedRole: any;
  isEditBtnDisabled: boolean = false;
  isDeleteBtnDisabled: boolean = false;
  userRolePermArr: any[] = [];
  hasCreatePermission: boolean = true;
  hasUpdatePermission: boolean = true;
  hasDeletePermission: boolean = true;
  isMenuLoaded: boolean = false;
  collateralCondition: boolean;
  disableSummary: boolean = false;
  
  

  constructor(private checkPermComp: CheckPermissionsService, private _service: CustomHttpService, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _message: MessageServices, private _grid: GridComponent, private _router: Router,
    public dialog: MatDialog,
    private _helper: Helper
  ) {

    /*Based on the User Role Permissions Enable or Disable the Edit Icon*/
       let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
       if(userRole !== CyncConstants.ADMIN_ROLE_TYPE){
         /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
         setTimeout (() => {
           this.userRolePermArr = JSON.parse(localStorage.getItem("rolesAndPermissionsArray"));
           this.hasCreatePermission = this.checkPermComp.checkPermissions(this.userRolePermArr,"create");
           this.hasUpdatePermission = this.checkPermComp.checkPermissions(this.userRolePermArr,"update");
           this.hasDeletePermission = this.checkPermComp.checkPermissions(this.userRolePermArr,"destroy");
         }, 600);
       }
       this.getAllRoleType();
    this.getAllTheRolesList();
    

    this.addCustomRole = this.fb.group({
      roleName: new FormControl('', Validators.compose([Validators.required])),
      parentRole: new FormControl('', Validators.compose([Validators.required])),
      roleType: new FormControl('', Validators.compose([Validators.required])),
      roleDescription: new FormControl('', Validators.compose([Validators.required]))
    });

  }/*constructor ends*/

  getAllTheRolesList() {
    this._service.getCall('/roles?sort_by=ASC').then(i => {
      this.rolesList = this._service.bindData(i).roles;

      if (this.rolesList.length > 0) {
        // console.log("::AFTER ----this.rolesList----",this.rolesList);
        let tempSelectedRoleIndex = 0;
        
        for (let p = 0; p < this.rolesList.length; p++) {
          let tempRT = this.rolesList[p];
          // if (tempRT.system_defined) {
          //   this.roleTypeList.push(tempRT);
          // }
          if (this.tempSelectedRole != undefined && (tempRT.id === this.tempSelectedRole.id)) {
            tempSelectedRoleIndex = p;
          }
        }
        // console.log("::AFTER ----this.roleTypeList----",this.roleTypeList);
        if (this.tempSelectedRole != undefined) {
          this.selectedRole = this.rolesList[tempSelectedRoleIndex];
          this.tempSelectedRole = undefined;
        } else {
          this.selectedRole = this.rolesList[0];
        }
        this.getMenusAndPermissionsList();

      }

    });
  }

  /**
   * Api call for geting all role type
   */
  getAllRoleType(){
    this.roleTypeList = [];
    this._service.getCall('roles/role_type').then(res => {
      var rowData = this._service.bindData(res)
      if(rowData.data){
        this.roleTypeList = rowData.data;
      }
    })
  }

  debtorMenu(event, tempActionObj, fsubind,sb,fsub){
      console.log("Event:",fsubind,sb,fsub);
      if(event){
        this.disableSummary = false; 
        tempActionObj.enabled = true;
       }else{
        this.disableSummary = true;
        tempActionObj.enabled = false;
       }
  }

  getMenusAndPermissionsListWithResponse() {

    this.permissionData = [];
    for (let i = 0; i < this.responseData.length; i++) {
      let tempArr = this.responseData[i];
      for (let j = 0; j < tempArr.length; j++) {
        let tempObj = tempArr[j];
        this.permissionData.push(tempObj);
        if(this.permissionData.length > 1){
        if(tempObj.menu_identifier == "client_maintenance")
        this.collateralCondition = false;
        try{
          let clientPara =  tempObj.submenu_list.filter(x => x.menu_identifier == "client_parameters")[0] 
          if(clientPara){
              let collateralChecker = clientPara.submenu_list.filter(x => x.menu_identifier === "collateral_advance_rate")[0].permissions.filter(x => x.action === 'index')[0]
              if(collateralChecker && collateralChecker.enabled === true){
                this.collateralCondition = true;
              } 
          }
        }
        catch(err) {
          console.log(err)
        }
      }
      }
    }
   // this._helper.setRolesAndPermissionArray(this.permissionData);

   // console.log(":::this.permissionData-----",this.permissionData);
    if (this.permissionData.length > 0) {
      this.backupPermissionData = JSON.parse(JSON.stringify(this.permissionData));
    }


    //this._message.showLoader(false);

    for (let tempIndexI = 0; tempIndexI < this.permissionData.length; tempIndexI++) {
      let tempSubMenuArr: any[] = this.permissionData[tempIndexI].submenu_list;
      for (let tempIndexJ = 0; tempIndexJ < tempSubMenuArr.length; tempIndexJ++) {
        if (tempSubMenuArr[tempIndexJ].submenu_count > 0) {
          this.selectAllCheckboxValidation(this.permissionData[tempIndexI].submenu_list[tempIndexJ]); // CYNCS-6082 
          //this.permissionData[tempIndexI].submenu_list[tempIndexJ]["menuChkBox"] = false;
          let tmpSbSubMenuArr: any[] = this.permissionData[tempIndexI].submenu_list[tempIndexJ].submenu_list;
          for (let tmpIndexK = 0; tmpIndexK < tmpSbSubMenuArr.length; tmpIndexK++) {
            if (tmpSbSubMenuArr[tmpIndexK].submenu_count > 0) {
              this.selectAllCheckboxValidation(this.permissionData[tempIndexI].submenu_list[tempIndexJ].submenu_list[tmpIndexK]); // CYNCS-6082 
              //this.permissionData[tempIndexI].submenu_list[tempIndexJ].submenu_list[tmpIndexK]["menuChkBox"] = false;
            }
          }
        }

      }
    }

   // console.log("permissionData::",  this.permissionData);
    
  }

  getMenusAndPermissionsListEdit() {
    if (this.selectedRole.id > 0) {
      this._service.getCall('/roles/' + this.selectedRole.id + '/role_permissions/all_menu_permissions').then(i => {
        this.responseData = this._service.bindData(i);
        this._message.showLoader(true);
        this.getMenusAndPermissionsListWithResponse();
        this.isMenuLoaded = true;
        this._message.showLoader(false);
      });
    }
  }

  getMenusAndPermissionsList() {
    if (this.selectedRole.id > 0) {
      let urlRoles = `/roles/${this.selectedRole.id}/role_permissions/all_menu_permissions`;
      this._service.getCall(urlRoles).then(i => {
        this.responseData = this._service.bindData(i);
        this._helper.setRolesAndPermissionArray(this.responseData[0]);
        this._helper.setRolesAndPermissionId(this.selectedRole.id);
        this.getMenusAndPermissionsListWithResponse();
      });

    }

  }

  ngOnInit() {
    this._service.setHeight();
    
  }


  resetFields() {
    this.buttonTextValue = "Save";
    this.isDisable = false;
    this.isDisableCreateButton = false;
    this.isEditBtnDisabled = false;
    this.isDeleteBtnDisabled = false;
    this.isDisableActions = true;
    this.allPermissionsArray = [];
    document.getElementById("role_create").style.display = 'none';
    this.addCustomRole.reset();
    this.isRoleNameValid = true;
    this.isParentRoleValid = true;
    this.isRoleTypeValid = true;
    this.isRoleDescValid = true;
  }


  saveData() {    
    
    if (this.addCustomRole.valid && this.isParentRoleValid && this.isRoleTypeValid) {
      const customRoleModel = {
        "role": {
          "name": this.addCustomRole.controls.roleName.value,
          "description": this.addCustomRole.controls.roleDescription.value,
          "role_type": this.addCustomRole.controls.roleType.value,
          "parent_role_id": this.addCustomRole.controls.parentRole.value
        }
      };
      const setPermissionsModel = {
        "role_permissions":
          {
            "role_permissions_attributes": this.allPermissionsArray
          }
      };
      if (this.buttonTextValue == "Update") {
        this.tempSelectedRole = JSON.parse(JSON.stringify(this.selectedRole));
        this.requestModel = { url: 'roles/' + this.selectedRole.id, model: customRoleModel };
        let successMsg = "Role and its Permissions has been Updated successfully.";
        this._service.patchCallRor(this.requestModel).then(i => {
          /*console.log("::After updating Role Details-----",i);*/
          if (i != undefined) {
            /*console.log("::After updating Role Details2-----allPermissionsArray ",this.allPermissionsArray);*/
            if (this.allPermissionsArray.length > 0) {
              let permissionsRequestModel = { url: 'roles/' + this.selectedRole.id + '/role_permissions', model: setPermissionsModel };

              this._service.patchCallRor(permissionsRequestModel).then(i => {
                this.updateLocalStorage();
                /*console.log("::After updating Permissions-----",i);*/
                if (i != undefined) {
                  this.resetFields();
                  //this.getAllTheRolesList();
                  this.navigateToHome(successMsg);
                }

              });
            } else {
              this.resetFields();
              //this.getAllTheRolesList();
              this.navigateToHome(successMsg);
            }
          }


        });

      } else {
        this.requestModel = { url: 'roles', model: customRoleModel };
        let successMsg = "Role and its Permissions has been created successfully.";

        this._service.postCallpatch(this.requestModel).then(i => {
          this.updateLocalStorage();
          if (i != undefined) {
            let tempPath = i;
            this.createdRoleId = tempPath.split("/").pop();
            if (this.allPermissionsArray.length > 0) {
              let permissionsRequestModel = { url: 'roles/' + this.createdRoleId + '/role_permissions', model: setPermissionsModel };
              this._service.patchCallRor(permissionsRequestModel).then(i => {

                if (i != undefined) {
                  this.resetFields();
                  this.getAllTheRolesList();
                  this.navigateToHome(successMsg);
                }


              });
            } else {
              this.resetFields();
              this.getAllTheRolesList();
              this.navigateToHome(successMsg);
            }
          }


        });
      }

    } else {
      // console.log(":::Invalid");
      this.checkIsRoleNameValid();
      //this.checkIsSelectValid();
      this.checkIsParentRoleValid();
      this.checkIsRoleTypeValid();
      this.checkIsRoleDescriptionValid();

    }
  }

  updateLocalStorage(){
    let userRole = localStorage.getItem('cyncUserRoleId');
    this._service.getCall('roles/'+userRole+'/role_permissions/all_menu_permissions').then(res =>{
      let responseData:any[] = this._service.bindData(res);
      this.checkPermComp.updatePermissionsLocalStorage(responseData);
    });
  }

  navigateToHome(msg: any) {
    this._message.addSingle(msg, "success");
  }

  checkIsParentRoleValid(){
    let pr = this.addCustomRole.controls['parentRole'].value;
    // console.log("::pr----",pr);
    if (pr == 'null' || pr == null || pr == undefined || pr == '') {
      this.isParentRoleValid = false;
      // console.log(">>>>this.isParentRoleValid----",this.isParentRoleValid);
    } else {
      this.isParentRoleValid = true;
      // console.log("::this.isParentRoleValid----",this.isParentRoleValid);
    }
    
  }

  checkIsRoleTypeValid(){
    let rt = this.addCustomRole.controls['roleType'].value;
    // console.log("::rt----",rt);
    if (rt == 'null' || rt == null || rt == undefined || rt == '') {
      this.isRoleTypeValid = false;
    } else {
      this.isRoleTypeValid = true;
    }
  }

  onChangeOfRoleType(){
    this.checkIsRoleTypeValid();
    let rt = this.addCustomRole.controls['roleType'].value;
    // console.log("::rt----",rt);
    if (rt != 'null' && rt != null && rt != undefined && rt != '') {
      // console.log("::this.isEditBtnDisabled----",this.isEditBtnDisabled);
      if(!this.isEditBtnDisabled && this.buttonTextValue == 'Update'){
        //If in edit mode, call all_menu_permissions api
        //by sending query param as selected Role Type
        // console.log(":::call all_menu_permissions with role type");
        this.getMenuPermissionsOnChangeOfRoleTypeForEditing();
       
      }else{
        //If in create mode, call default permissions api
        // console.log(":::call default permissions api");
        this.getMenuPermissionsBasedOnSelectedRoleType();
      }
     
    }
    
  }

  getMenuPermissionsOnChangeOfRoleTypeForEditing(){
    if(this.selectedRole.id > 0){
      this._service.getCall('/roles/' + this.selectedRole.id + '/role_permissions/all_menu_permissions?role_type='+this.addCustomRole.controls['roleType'].value).then(i => {
        this.responseData = this._service.bindData(i);
        this.populateMenuPermissionsData();
      });
    }
  }

  getMenuPermissionsBasedOnSelectedRoleType(){
  // this._service.getCall('/roles/' + this.getSelectedRoleTypeId() + '/role_permissions/all_menu_permissions').then(i => {
    this._service.getCall('role_permissions/default_permissions?role_type='+this.addCustomRole.controls['roleType'].value).then(i => {
      this.responseData = this._service.bindData(i);
      this.populateMenuPermissionsData();
    });
  }

  populateMenuPermissionsData(){
    this._message.showLoader(true);
      this.getMenusAndPermissionsListWithResponse();
      this.isMenuLoaded = true;
      this._message.showLoader(false);
  }

  checkIsRoleNameValid() {
    let rn = this.addCustomRole.controls['roleName'].value;
    if (rn == null || rn == undefined || rn == '') {
      this.isRoleNameValid = false;
    } else {
      this.isRoleNameValid = true;
    }

  }

  checkIsRoleDescriptionValid() {
    let rd = this.addCustomRole.controls['roleDescription'].value;
    if (rd == null || rd == undefined || rd == '') {
      this.isRoleDescValid = false;
    } else {
      this.isRoleDescValid = true;
    }

  }

  checkCR() {
    this.addCustomRole.controls['parentRole'].setValue(null);
    this.addCustomRole.controls['roleType'].setValue(null);
    /*this.addCustomRole.controls['parentRole'].setValue(this.rolesList[0].id);
    this.addCustomRole.controls['roleType'].setValue(this.roleTypeList[0].role_type);*/
    this.isDisable = true;
    this.isEditBtnDisabled = true;
    this.isDeleteBtnDisabled = true;
    // this._service.getCall('/roles/'+this.getAdminRoleId()+'/role_permissions/all_menu_permissions').then(i => {
      this._service.getCall('role_permissions/default_permissions?role_type='+this.getAdminRoleType()).then(i => {
      this.responseData = this._service.bindData(i);
      this.permissionData = [];
      for (let i = 0; i < this.responseData.length; i++) {
        let tempArr = this.responseData[i];
        for (let j = 0; j < tempArr.length; j++) {
          let tempObj = tempArr[j];
          this.permissionData.push(tempObj);
        }
      }
      if (this.permissionData.length > 0) {
        this.backupPermissionData = JSON.parse(JSON.stringify(this.permissionData));
      }

    })
    this.isDisableActions = false;
    /*Changing the drop down value from Admin Role to other role*/
    // if(this.selectedRole.name == 'Administrator')
    this.selectedRole = 'dummy';//this.rolesList[1];
  }

  getAdminRoleType():string{
    let adminRoleType = '';
    this.rolesList.forEach((data) =>{
      if(data.name == CyncConstants.ADMIN_ROLE_TYPE){
        adminRoleType = data.role_type;
        // console.log("::adminRoleType---",adminRoleType);
      }
    });
    return adminRoleType;
  }

  editCustomRole() {
    /*console.log('edit custom method enterde');*/
    this.isMenuLoaded = false;
    this.getMenusAndPermissionsListEdit();
    this.isDisable = true;
    this.isDisableCreateButton = true;
    this.buttonTextValue = "Update";
    this._service.getCall('roles/' + this.selectedRole.id).then(i => {
      this.customRoleData = this._service.bindData(i);
      console.log("::this.customRoleData--",this.customRoleData);
      /*console.log('show loader true2');*/
      this._message.showLoader(true);
      /*this.addCustomRole.controls['roleName'].disable();*/
      this.addCustomRole.controls['roleName'].setValue(this.customRoleData.name);
      this.addCustomRole.controls['roleDescription'].setValue(this.customRoleData.description);
      this.addCustomRole.controls['roleType'].setValue(this.customRoleData.role_type);
      this.addCustomRole.controls['parentRole'].setValue(this.customRoleData.parent_role_id);
      /*console.log('show loader false2');*/
      if (this.isMenuLoaded)
        this._message.showLoader(false);
    });


    document.getElementById("role_create").style.display = 'block';
    this.isDisableActions = false;

  }

  checkEditCR() {
    if (!this.hasCreatePermission) {
      this.isDisableCreateButton = true;
    }
    return this.isDisableCreateButton;
  }


  deleteCustomRole() {
    //console.log("::BEFORE ----this.rolesList----",this.rolesList);
    this._grid.deleteRoleAndPermission(this.selectedRole.id, this.selectedRole.name, "roles/");
    document.getElementById('modal_action_yes').addEventListener('click', () => {
      this.tempSelectedRole = undefined;
      setTimeout(() => {
        this.getAllTheRolesList();
      }, 500);
    });
  }

  checkCRSelection() {
    if (!this.hasDeletePermission) {
      return true;
    } else {
      if (this.selectedRole != undefined && (!this.selectedRole.system_defined) && (this.buttonTextValue != "Update") && (!this.isDeleteBtnDisabled))
        return false;
      return true;
    }

  }

permissionMenuUncheckDebtor(data:any){
   if(data.sb_sub_menu_name==="Debtors" && data.submenu_list[0].sb_sb_sub_menu_name==="Account Debtor")
  {
  
     data.submenu_list[0].submenu_list.forEach(element => {
     element.permissions.forEach(ele => {
           if(ele.enabled===false){
           data.menuChkBox=false;
           }
          
         });
      });
  } 
}

  getSelectedPermissions(event, iInd, j, k, qInd, ind, tempActionObj, permissionsArray: any[], menuName) {
    if(event ==true) {
      this.disableSummary=true;
      this.checkPermsionAllDebtor(this.permissionData,iInd,j);
    }else {
      this.disableSummary=false;
      this.permissionMenuUncheckDebtor(this.permissionData[iInd].submenu_list[j]);
    }
    
    let permActionIdString = tempActionObj.action_id;
    let menuIdString = tempActionObj.role_permission_id;
    let indexVal: number = -1;
    let tempPermObj: any = {};
    let isDefaultEnabled: any;
    if (k == -1 && qInd == -1) {
      isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[j].permissions[ind].enabled;
    }
    if (k >= 0 && qInd == -1) {
      isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[j].submenu_list[k].permissions[ind].enabled;
    }
    if (k >= 0 && qInd >= 0) {
      isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[j].submenu_list[k].submenu_list[qInd].permissions[ind].enabled;
    }

    if (this.allPermissionsArray.length > 0) {
      for (let i = 0; i < this.allPermissionsArray.length; i++) {
        let obj = this.allPermissionsArray[i];
        if (obj.permission_id == permActionIdString) {
          indexVal = i;
          break;
        } else if (obj.id == menuIdString && obj.permission_id == null) {
          indexVal = i;
          break;
        }
      }
    }
    
    //console.log(this.allPermissionsArray);
    if (!event) {
      if (k >= 0 && qInd >= 0) {
        this.permissionData[iInd].submenu_list[j].submenu_list[k].menuChkBox = false;
      } else {
        this.permissionData[iInd].submenu_list[j].menuChkBox = false;
      }

      if (indexVal >= 0) {
        if (isDefaultEnabled == false) {
          this.allPermissionsArray.splice(indexVal, 1);
        } else if (isDefaultEnabled == true) {
          tempPermObj = {
            "permission_id": null,
            "id": menuIdString
          };
          this.allPermissionsArray[indexVal] = tempPermObj;

        }
        /*console.log(">>>>If checkbox disabled & indexVal>=0 , this.allPermissionsArray-----",this.allPermissionsArray);*/

      } else {
        /*console.log("::::isDefaultEnabled---------",isDefaultEnabled);*/
        if (isDefaultEnabled == true) {
          tempPermObj = {
            "permission_id": null,
            "id": menuIdString
          };
          this.allPermissionsArray.push(tempPermObj);

          this.updatePermBasedOnSummary(tempActionObj, permissionsArray, menuName);

        }
        /*console.log(">>>>>If checkbox disabled & indexVal == -1, this.allPermissionsArray-----",this.allPermissionsArray);*/
      }
    } else {
      if (k >= 0 && qInd >= 0) {
        this.selectAllCheckboxValidation(this.permissionData[iInd].submenu_list[j].submenu_list[k]); // CYNCS-6082
      } else {
        this.selectAllCheckboxValidation(this.permissionData[iInd].submenu_list[j]); // CYNCS-6082
      }
      if (indexVal == -1 && (isDefaultEnabled == false)) {
        tempPermObj = {
          "permission_id": permActionIdString,
          "id": menuIdString
        };
        this.allPermissionsArray.push(tempPermObj);
        if (tempActionObj.action == 'update') {
          this.updateViewPermissionBasedOnEditPermission(permissionsArray);
        }
        /*console.log(":::If checkbox enabled & indexVal == -1, this.allPermissionsArray-----",this.allPermissionsArray);*/
      } else if (indexVal >= 0 && (isDefaultEnabled == true)) {
        this.allPermissionsArray.splice(indexVal, 1);
        /*console.log(":::If checkbox enabled & indexVal >=0, this.allPermissionsArray-----",this.allPermissionsArray);*/
      }

    }
      // condition checking for collateral advance rate and collateral group  
    if(menuName === "Collateral Advance Rate" && tempActionObj.action === "index" && event === false){
      // this.permissionData[1].submenu_list[3].submenu_list[3].permissions[0].enabled = false; 
      this.disableuniq('Collateral Group');
      this.collateralCondition = false;
      let actionarray;
      let subMenulist;
      let clickEvent = false;

      if (k == -1 && qInd == -1) {
        actionarray = this.permissionData[iInd].submenu_list[j+1].permissions[0];
        subMenulist = this.permissionData[iInd].submenu_list[j+1].permissions;
        this.permissionData[iInd].submenu_list[j+1].permissions[0].enabled = false; 

        this.getSelectedPermissions(clickEvent, iInd, j+1, 3, -1, 0, actionarray, subMenulist, 'Collateral Group');

      }
      if (k >= 0 && qInd == -1) {
        actionarray = this.permissionData[iInd].submenu_list[j].submenu_list[k+1].permissions[0];
        subMenulist = this.permissionData[iInd].submenu_list[j].submenu_list[k+1].permissions;
        this.permissionData[iInd].submenu_list[j].submenu_list[k+1].permissions[0].enabled = false; 

        this.getSelectedPermissions(clickEvent, iInd, j, k+1, -1, 0, actionarray, subMenulist, 'Collateral Group');

      }
      if (k >= 0 && qInd >= 0) {
        actionarray = this.permissionData[iInd].submenu_list[j].submenu_list[k].submenu_list[qInd+1].permissions[0];
        subMenulist = this.permissionData[iInd].submenu_list[j].submenu_list[k].submenu_list[qInd+1].permissions;
        this.permissionData[iInd].submenu_list[j].submenu_list[k].submenu_list[qInd+1].permissions[0].enabled = false; 

        this.getSelectedPermissions(clickEvent, iInd, j, k, qInd+1, 0, actionarray, subMenulist, 'Collateral Group');

      }

    }
    else if(menuName === "Collateral Advance Rate" && tempActionObj.action === "index" && event === true){
      this.disableuniq('Collateral Group');
      this.collateralCondition = true;
    }
    console.log("Selected Rows::", this.allPermissionsArray);  
    
  }
  

  /**
  * CYNCS-6082 
  * Select all checkbox selection validation
  * @param data 
  */
  selectAllCheckboxValidation(data: any){
  this.disableSummary = false; 
	let subMenuArray = data.submenu_list;
	if (subMenuArray.length > 0) {
		let finalPermissionArray = [];
		for (let i = 0; i < subMenuArray.length; i++) {
			finalPermissionArray.push(...subMenuArray[i].permissions);
		}
		if (finalPermissionArray.length > 0) {
			const enabledArrays = finalPermissionArray.map(function (obj) {
				return obj.enabled;
			});
			const isAllEqual = enabledArrays.every(Boolean)
			if (isAllEqual) {
				data.menuChkBox = true;
			} else {
				data.menuChkBox = false;
			}
		} else {
			data.menuChkBox = false;
		}
	}
}

  updateViewPermissionBasedOnEditPermission(permissionsArray: any[]) {
    /*console.log(":::permissionsArray-------",permissionsArray);*/
    for (let tmpInd = 0; tmpInd < permissionsArray.length; tmpInd++) {
      if (permissionsArray[tmpInd].action == 'show') {
        let tempObj = {
          "permission_id": permissionsArray[tmpInd].action_id,
          "id": permissionsArray[tmpInd].role_permission_id
        };
        this.allPermissionsArray.push(tempObj);
      }
    }
    /*console.log("===After Updating View Permission------",this.allPermissionsArray);*/
  }

  updatePermBasedOnSummary(tempActionObj, permissionsArray, menuName) {
    /*If summary permission is false make other permissions(create/update/delete) also false*/
    /*console.log("::permissionsArray---",permissionsArray);*/
    if (tempActionObj.action == 'index') {
      this.changePermValue('index', permissionsArray);
    }
    if (tempActionObj.action == 'edit' && (menuName == 'Basic Details' || menuName == 'Bank Details' || menuName == 'Basic Client Detail')) {
      this.changePermValue('edit', permissionsArray);
    }
    if (tempActionObj.action == 'auto_process_loan_activity_settings' && (menuName == 'Auto Process Collateral Loan Settings')) {
      this.changePermValue('auto_process_loan_activity_settings', permissionsArray);
    }
    if (tempActionObj.action == 'funding_style' && (menuName == 'Funding Style')) {
      this.changePermValue('funding_style', permissionsArray);
    }
    if (tempActionObj.action == 'analysis_by_untriggered' && (menuName == "BBC's to be Processed")) {
      this.changePermValue('analysis_by_untriggered', permissionsArray);
    }
    if (tempActionObj.action == 'credit_memo_history' && (menuName == "Credit Memo History")) {
      this.changePermValue('credit_memo_history', permissionsArray);
    }
    if (tempActionObj.action == 'onetime_manual_process' && (menuName == "Process OneTime & Manual Charges")) {
      this.changePermValue('onetime_manual_process', permissionsArray);
    }
    if(tempActionObj.action == 'analysis_by_unapproved' && (menuName == "BBC's to be Approved")) {
      this.changePermValue('analysis_by_unapproved', permissionsArray);
    }
  }

  changePermValue(actionType, permissionsArray) {
    for (let tmpInd = 0; tmpInd < permissionsArray.length; tmpInd++) {
      if (permissionsArray[tmpInd].action != actionType) {
        let tempObj = {
          "permission_id": null,
          "id": permissionsArray[tmpInd].role_permission_id
        };
        this.allPermissionsArray.push(tempObj);
      }
    }
    /*console.log("::this.allPermissionsArray-----",this.allPermissionsArray);*/
  }

  selectOnlyPermission(permissions) {
    let tempPermObj: any = {};
    if (permissions.enabled) {
      tempPermObj = {
        "permission_id": permissions.action_id,
        "id": permissions.role_permission_id
      };
    } else {
      tempPermObj = {
        "permission_id": null,
        "id": permissions.role_permission_id
      };
    }
    this.allPermissionsArray.push(tempPermObj);
  }


 selectAllEvent(event, iInd, jInd, hasSubLevel, subLevelIndex, submenuCount) {
    if(event==true){
    this.disableSummary = false;
    setTimeout(() => { this.checkPermsionAllDebtor(this.permissionData,iInd,jInd);},500); 
    }else{
      this.disableSummary = true ;
      this.uncheckDebtor(this.permissionData,iInd,jInd);
    }
    for (let k = 0; k < submenuCount; k++) {
      let tempSbSubMenuObj: any;
      if (hasSubLevel == false && (subLevelIndex == -1)) {
          tempSbSubMenuObj = this.permissionData[iInd].submenu_list[jInd].submenu_list[k];
      }
      if (hasSubLevel == true && (subLevelIndex >= 0)) {
        tempSbSubMenuObj = this.permissionData[iInd].submenu_list[jInd].submenu_list[subLevelIndex].submenu_list[k]; 
      }

      let tempPermArray = tempSbSubMenuObj.permissions;

      if(event==true){
        tempSbSubMenuObj.menuChkBox=true;
        this.submenuSelection(tempSbSubMenuObj);
      }else{
        tempSbSubMenuObj.menuChkBox=false;
        this.submenuSelection(tempSbSubMenuObj);
      }
      for (let j = 0; j < tempPermArray.length; j++) {
        let tempActionObj = tempPermArray[j];
        let permActionIdString = tempActionObj.action_id;
        let menuIdString = tempActionObj.role_permission_id;
        let tempPermObj: any = {};
        let indexVal: number = -1;
        let isDefaultEnabled: any;

        if (hasSubLevel == false && (subLevelIndex == -1)) {
          isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[jInd].submenu_list[k].permissions[j].enabled;
        }
        if (hasSubLevel == true && (subLevelIndex >= 0)) {
          isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[jInd].submenu_list[subLevelIndex].submenu_list[k].permissions[j].enabled;
        }

        if (this.allPermissionsArray.length > 0) {
          for (let i = 0; i < this.allPermissionsArray.length; i++) {
            let obj = this.allPermissionsArray[i];
            if (obj.permission_id == permActionIdString) {
              indexVal = i;
              break;
            } else if (obj.id == menuIdString && obj.permission_id == null) {
              indexVal = i;
              break;
            }
          }
        }

        if (event) {
          tempActionObj.enabled = true;
          if (indexVal == -1 && (isDefaultEnabled == false)) {
            tempPermObj = {
              "permission_id": permActionIdString,
              "id": menuIdString
            };
            this.allPermissionsArray.push(tempPermObj);
          } else if (indexVal >= 0 && (isDefaultEnabled == true)) {
            this.allPermissionsArray.splice(indexVal, 1);
          }

        } else {
          
          tempActionObj.enabled = false;
          if (indexVal >= 0) {
            if (isDefaultEnabled == false) {
              this.allPermissionsArray.splice(indexVal, 1);
            } else if (isDefaultEnabled == true) {
              tempPermObj = {
                "permission_id": null,
                "id": menuIdString
              };
              this.allPermissionsArray[indexVal] = tempPermObj;
            }

          } else {
            if (isDefaultEnabled == true) {
              tempPermObj = {
                "permission_id": null,
                "id": menuIdString
              };
              this.allPermissionsArray.push(tempPermObj);
            }
          }
        }

      } /* J For loop ends*/
    }/* K For loop ends*/

  }
// uncheck Debtor
uncheckDebtor(data: any,index1: number, index2 : number){
    if (data[index1].submenu_list[index2].sb_sub_menu_name==="Debtors"){
         data[index1].submenu_list[index2].menuChkBox = false;
     }
}

// This Fuction ony Checked Factoring AllDebtor Permission checked -> FACT-881 fixed 
checkPermsionAllDebtor(data: any,index1: number, index2 : number){
  if (data[index1].submenu_list[index2].sb_sub_menu_name==="Debtors"){
     let tempCheckList=[];
     let allcheckedDebtor: boolean;
     let eachPermisionChecked:boolean;
     data[index1].submenu_list[index2].submenu_list.forEach(elm => {
         if(elm.submenu_count==0){
           eachPermisionChecked = elm.permissions.every((pelm)=> pelm.enabled===true);
           tempCheckList.push({enabled:eachPermisionChecked});
         }
         if(elm.submenu_count > 0){
            elm.submenu_list.forEach(ssbelm => {
            let allACdebtorPermissionChecked = ssbelm.permissions.every((ssbpelm)=> ssbpelm.enabled===true);
            tempCheckList.push({enabled:allACdebtorPermissionChecked});
            });
         }
      }); 
      allcheckedDebtor = tempCheckList.every( (val) => val.enabled===true);
      if(allcheckedDebtor){
      data[index1].submenu_list[index2].menuChkBox = true;
      } else{
      data[index1].submenu_list[index2].menuChkBox = false;
      }
  }
}

/**
 * Submenu Selection
 * @param dataPartial 
 */
  submenuSelection(dataPartial: any){
    let tempData: any = {};
    if(dataPartial.sb_sb_sub_menu_name=="Account Debtor" && dataPartial.menuChkBox==true)
    {
      dataPartial.submenu_list.forEach((elm) => {
        elm.permissions.forEach(subelm => {
          subelm.enabled=true;
          tempData = {
            "permission_id": subelm.action_id,
            "id":subelm.role_permission_id,
          };
          this.allPermissionsArray.push(tempData);
        });
      });
    }else if(dataPartial.sb_sb_sub_menu_name=="Account Debtor" && dataPartial.menuChkBox==false ){
      dataPartial.submenu_list.forEach((elm) => {
        elm.permissions.forEach(subelm => {
          subelm.enabled=false;
            tempData = {
              "permission_id": null,
              "id": subelm.role_permission_id
            };
           this.allPermissionsArray.push(tempData);
        });
      }); 
    } else {
      // nothing doing;
    }

  }

  summaryEvent(event, iInd, jInd, hasSubLevel, subLevelIndex, submenuCount,sb) {
    if(event==true){
    this.disableSummary = true ;
    }else{
      this.disableSummary = false ;
    }

   for (let k = 0; k < submenuCount; k++) {
     let tempSbSubMenuObj: any;
     if (hasSubLevel == false && (subLevelIndex == -1)) {
       tempSbSubMenuObj = this.permissionData[iInd].submenu_list[jInd].submenu_list[k];
     }
     if (hasSubLevel == true && (subLevelIndex >= 0)) {
       tempSbSubMenuObj = this.permissionData[iInd].submenu_list[jInd].submenu_list[subLevelIndex].submenu_list[k];
     }

     let tempPermArray = tempSbSubMenuObj.permissions;
     for (let j = 0; j < tempPermArray.length; j++) {
       let tempActionObj = tempPermArray[j];
       let permActionIdString = tempActionObj.action_id;
       let menuIdString = tempActionObj.role_permission_id;
       let tempPermObj: any = {};
       let indexVal: number = -1;
       let isDefaultEnabled: any;
       if (hasSubLevel == false && (subLevelIndex == -1)) {
         isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[jInd].submenu_list[k].permissions[j];
       }
       if (hasSubLevel == true && (subLevelIndex >= 0)) {
         isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[jInd].submenu_list[subLevelIndex].submenu_list[k].permissions[j];
       }

       if (this.allPermissionsArray.length > 0) {
         for (let i = 0; i < this.allPermissionsArray.length; i++) {
           let obj = this.allPermissionsArray[i];
           if (obj.permission_id == permActionIdString) {
             indexVal = i;
             break;
           } else if (obj.id == menuIdString && obj.permission_id == null) {
             indexVal = i;
             break;
           }
         }
       }

       if (event) {
         tempActionObj.enabled = false;
         if (indexVal == -1 && (isDefaultEnabled == false)) {
           tempPermObj = {
             "permission_id": permActionIdString,
             "id": menuIdString
           };

           this.allPermissionsArray.push(tempPermObj);
         } else if (indexVal >= 0 && (isDefaultEnabled == false)) {
           this.allPermissionsArray.splice(indexVal, 1);
         }

       } else {
         
         tempActionObj.enabled = false;
         if (indexVal >= 0) {
           if (isDefaultEnabled == false) {
             this.allPermissionsArray.splice(indexVal, 1);
           } else if (isDefaultEnabled == true) {
             tempPermObj = {
               "permission_id": null,
               "id": menuIdString
             };
             this.allPermissionsArray[indexVal] = tempPermObj;
           }

         } else {
           if (isDefaultEnabled == true) {
             tempPermObj = {
               "permission_id": null,
               "id": menuIdString
             };
             this.allPermissionsArray.push(tempPermObj);
           }
         }

       }

     } /* J For loop ends*/
   }/* K For loop ends*/

 }
 
  enableEvent(event, iInd, jInd, hasSubLevel, subLevelIndex, submenuCount) {
    for (let k = 0; k < submenuCount; k++) {
      let tempSbSubMenuObj: any;
      if (hasSubLevel == false && (subLevelIndex == -1)) {
        tempSbSubMenuObj = this.permissionData[iInd].submenu_list[jInd].submenu_list[k];
      }
      if (hasSubLevel == true && (subLevelIndex >= 0)) {
        tempSbSubMenuObj = this.permissionData[iInd].submenu_list[jInd].submenu_list[subLevelIndex].submenu_list[k];
      }

      let tempPermArray = tempSbSubMenuObj.permissions;
      for (let j = 0; j < tempPermArray.length; j++) {
        let tempActionObj = tempPermArray[j];
        let permActionIdString = tempActionObj.action_id;
        let menuIdString = tempActionObj.role_permission_id;
        let tempPermObj: any = {};
        let indexVal: number = -1;
        let isDefaultEnabled: any;
        if (hasSubLevel == false && (subLevelIndex == -1)) {
          isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[jInd].submenu_list[k].permissions[j].enabled;
        }
        if (hasSubLevel == true && (subLevelIndex >= 0)) {
          isDefaultEnabled = this.backupPermissionData[iInd].submenu_list[jInd].submenu_list[subLevelIndex].submenu_list[k].permissions[j].enabled;
        }

        if (this.allPermissionsArray.length > 0) {
          for (let i = 0; i < this.allPermissionsArray.length; i++) {
            let obj = this.allPermissionsArray[i];
            if (obj.permission_id == permActionIdString) {
              indexVal = i;
              break;
            } else if (obj.id == menuIdString && obj.permission_id == null) {
              indexVal = i;
              break;
            }
          }
        }

        if (event) {
          tempActionObj.enabled = true;
          if (indexVal == -1 && (isDefaultEnabled == false)) {
            tempPermObj = {
              "permission_id": permActionIdString,
              "id": menuIdString
            };

            this.allPermissionsArray.push(tempPermObj);
          } else if (indexVal >= 0 && (isDefaultEnabled == true)) {
            this.allPermissionsArray.splice(indexVal, 1);
          }

        } else {
          
          tempActionObj.enabled = false;
          if (indexVal >= 0) {
            if (isDefaultEnabled == false) {
              this.allPermissionsArray.splice(indexVal, 1);
            } else if (isDefaultEnabled == true) {
              tempPermObj = {
                "permission_id": null,
                "id": menuIdString
              };
              this.allPermissionsArray[indexVal] = tempPermObj;
            }

          } else {
            if (isDefaultEnabled == true) {
              tempPermObj = {
                "permission_id": null,
                "id": menuIdString
              };
              this.allPermissionsArray.push(tempPermObj);
            }
          }

        }

      } /* J For loop ends*/
    }/* K For loop ends*/

  }

  checkRoleCreation() {
    if (!this.hasUpdatePermission) {
      this.isEditBtnDisabled = true;
    }
    if (this.isEditBtnDisabled) {
      return true;
    }
    else {
      return false;
    }

  }

  /***
  checkIfSummaryEnabled method is for checking whether summary permission
  is enabled based on this enable or disable other(create,edit,destroy,view) permissions.
  */

  tempSummaryObj: any;
  tempMenuName: string = "";
  tempSummaryAction: boolean;

  checkEquals(param1: string, param2: string) {
    if (param1.toUpperCase() == param2.toUpperCase())
      return true;
    else
      return false;
  }


  checkIsSummary(action: string, menuName): boolean {
    return ((action == 'index') ||
      (action == 'edit' && (menuName == 'Basic Details' || menuName == 'Bank Details' || menuName == 'Basic Client Detail')) ||
      (action == 'index' && (menuName == 'Account Debtor' || menuName == 'Detailed Debtor Aging' || menuName == 'Account Parameters' || menuName == 'Comments' || menuName == 'Debtor Performance')) ||
      (action == 'auto_process_loan_activity_settings' && (menuName == 'Auto Process Collateral Loan Settings')) ||
      (action == 'funding_style' && (menuName == 'Funding Style')) ||
      (action == 'analysis_by_untriggered' && (menuName == "BBC's to be Processed")) ||
      (action == 'credit_memo_history' && (menuName == "Credit Memo History")) ||
      (action == 'onetime_manual_process' && (menuName == "Process OneTime & Manual Charges")) || 
      (action == 'analysis_by_unapproved' && (menuName == "BBC's to be Approved")) );
  }

  uncheckAll(obj: any, permList: any[]) {
    if (!obj.enabled) {
      permList.map(key => {
        key.enabled = false;
       // key.role_permission_id = null;
      });
    }
  }

  checkIfSummaryEnabled(permList: any[], menuName: string) {

    if (this.isDisableActions) {
      return true;
    }
    let tempPermObj = permList.find(x => x.action == 'index');

    if (tempPermObj != null || tempPermObj != undefined) {
      this.uncheckAll(tempPermObj, permList );
      return !tempPermObj.enabled;
    } else {
      if (menuName == 'Basic Details' || menuName == 'Bank Details' || menuName == 'Basic Client Detail') {
        let obj = permList.find(x => x.action == 'edit');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }
      

      if (menuName == 'Auto Process Collateral Loan Settings') {
        let obj = permList.find(x => x.action == 'auto_process_loan_activity_settings');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }

      if (menuName == 'Funding Style') {
        let obj = permList.find(x => x.action == 'funding_style');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }

      if (menuName == "BBC's to be Processed") {
        let obj = permList.find(x => x.action == 'analysis_by_untriggered');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }

      if (menuName == 'Credit Memo History') {
        let obj = permList.find(x => x.action == 'credit_memo_history');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }

      if (menuName == 'Process OneTime & Manual Charges') {
        let obj = permList.find(x => x.action == 'onetime_manual_process');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }
       
      if (menuName == "BBC's to be Approved") {
        let obj = permList.find(x => x.action == 'analysis_by_unapproved');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      } 
      if (menuName == 'Account Debtor') {
        let obj = permList.find(x => x.action == 'index');
        this.uncheckAll(obj, permList);
        return !obj.enabled;
      }

    }

  }


  checkEditPermission(permissions: any[], menu_name: string) {
    let editObj = permissions.find(x => x.action == 'update');
    if (editObj != null && editObj != undefined) {
      if (editObj.enabled) {
        this.enableViewPermBasedOnEdit(permissions);
      }
      return editObj.enabled;
    }

  }

  enableViewPermBasedOnEdit(permissions: any[]) {
    permissions.map(key => {
      if (key.action == 'show') {
        key.enabled = true;
      }
    })
  }

  disableCancelButton() {
    if (this.isDisable)
      return false;
    return true;
  }

  disableSaveButton() {
    if (this.isDisable)
      return false;
    return true;
  }

  openExportPopup(): void {
    const dialogRef = this.dialog.open(ExportPopupComponent, {
       width: '95%',
       panelClass: 'export-modalbox'
    });
  }

  public getPermissionArray(): any{
    return this.responseData;
  }

  /**
  * Role name input field validation
  */
  roleNameFieldValidation(){
    if(this.selectedRole && (this.selectedRole['system_defined'] === true)){
      return true;
    }else{
      return false;
    }
  }

  // function to disable collateral group according to collateral advance rate
  disableuniq(name){
  
    if(name === "Collateral Group" && this.collateralCondition === false){
      return true;
    }
    else{
      return false;
    }
  }

}
