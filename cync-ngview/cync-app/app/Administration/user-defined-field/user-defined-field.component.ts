import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of, interval } from 'rxjs';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { RouterConstants } from '@cyncCommon/utils/router-constants';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Helper } from '@cyncCommon/utils/helper';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';

@Component({
  selector: 'app-user-defined-field',
  templateUrl: './user-defined-field.component.html',
  styleUrls: ['./user-defined-field.component.scss']
})
export class UserDefinedFieldComponent implements OnInit {

  isUdfDefinitionPermitted = false;
  isUdfMappingPermitted = false;
  isUdfTransferPermitted = false;
  isUdfDefAddPermitted = false;
  isUdfDefEditPermitted = false;
  isUdfMapAddPermitted = false;
  isUdfMapEditPermitted = false;

  allPermissionsLoaded = false;

  public static UDF_SUMMARY_ACTION = 'index';
  public static UDF_ADD_ACTION = 'create';
  public static UDF_UPDATE_ACTION = 'update';
  public static UDF_DEFINITION = 'udf_definition';
  public static UDF_MAPPING = 'udf_mapping';
  public static UDF_TRANSFER = 'udf_transfer';

  //selectedRadioBtn = UserDefinedFieldComponent.UDF_DEFINITION;
  selectedRadioBtn = ''

  constructor(private _router: Router,
    private _commonApis: CommonAPIs,
    private _helper: Helper) {
     }


  ngOnInit() {
    this.routeToUdfPage();
  }

  // dummyMethodForRouting(){
  //   this.routeToUdfPage();
  // }

  routeToUdfPage() {
    let roleType = localStorage.getItem('cyncUserRole');
    if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
      this.populateUDFDefinitionPermissions();
    } else {
      this.isUdfDefinitionPermitted = true;
      this.isUdfMappingPermitted = true;
      this.isUdfTransferPermitted = true;
      this.isUdfDefAddPermitted = true;
      this.isUdfDefEditPermitted = true;
      this.isUdfMapAddPermitted = true;
      this.isUdfMapEditPermitted = true;
      this.allPermissionsLoaded = true;
      this.navigateToUdfPage();
    }
  }

  /**
   * This method enables/disables the
   */
  populateUDFDefinitionPermissions() {
    this.getPermissons().subscribe(result => {
      this.isUdfDefinitionPermitted = this.getPermissionFromArray(result[0],
        UserDefinedFieldComponent.UDF_SUMMARY_ACTION);
      this.isUdfDefAddPermitted = this.getPermissionFromArray(result[0],
        UserDefinedFieldComponent.UDF_ADD_ACTION);
      this.isUdfDefEditPermitted = this.getPermissionFromArray(result[0],
        UserDefinedFieldComponent.UDF_UPDATE_ACTION);

      this.isUdfMappingPermitted = this.getPermissionFromArray(result[1],
        UserDefinedFieldComponent.UDF_SUMMARY_ACTION);
      this.isUdfMapAddPermitted = this.getPermissionFromArray(result[1],
        UserDefinedFieldComponent.UDF_ADD_ACTION);
      this.isUdfMapEditPermitted = this.getPermissionFromArray(result[1],
        UserDefinedFieldComponent.UDF_UPDATE_ACTION);

      this.isUdfTransferPermitted = this.getPermissionFromArray(result[2],
        UserDefinedFieldComponent.UDF_SUMMARY_ACTION);
      this.allPermissionsLoaded = true;
      this.navigateToUdfPage();
    });
  }

  navigateToUdfPage() {
    if(this._router.url.startsWith(RouterConstants.UDF_MAPPING_ROUTER)){
      if((this._router.url === RouterConstants.UDF_MAPPING_ROUTER_ADD && !this.isUdfMapAddPermitted)
        || (this._router.url === RouterConstants.UDF_MAPPING_ROUTER && !this.isUdfMappingPermitted)
        || (!this.isUdfMapEditPermitted)){
          this.navigateToHome();
      }else{
        this.selectedRadioBtn = UserDefinedFieldComponent.UDF_MAPPING;
      }
    }else if (this.isUdfTransferPermitted && this._router.url === RouterConstants.UDF_CLIENT_TRANSFER_ROUTER) {
      this.selectedRadioBtn = UserDefinedFieldComponent.UDF_TRANSFER;
    }else if(this._router.url.startsWith(RouterConstants.UDF_DEFINITION_ROUTER)){
      if((this._router.url === RouterConstants.UDF_DEFINITION_ROUTER_ADD && !this.isUdfDefAddPermitted)
        || (this._router.url === RouterConstants.UDF_DEFINITION_ROUTER && !this.isUdfDefinitionPermitted)
        || (!this.isUdfDefEditPermitted)){
          this.navigateToHome();
      }else{
        this.selectedRadioBtn = UserDefinedFieldComponent.UDF_DEFINITION;
      }
    }else if (this.isUdfDefinitionPermitted) {
      this.navigateToUdfDefinition();
      this.selectedRadioBtn = UserDefinedFieldComponent.UDF_DEFINITION;
    }else if(this.isUdfMappingPermitted){
      this.navigateToUdfMapping();
      this.selectedRadioBtn = UserDefinedFieldComponent.UDF_MAPPING;
    }else if(this.isUdfTransferPermitted){
      this.navigateToUdfTransfer();
      this.selectedRadioBtn = UserDefinedFieldComponent.UDF_TRANSFER;
    }

  }

  /**
   * Method to navigate to home on reload of page
   */
  navigateToHome(){
    this._helper.openAlertPoup("Information", ClientValidationMessages.USER_NOT_ALLOWED);
    this._router.navigateByUrl('/');
  }

  /**
   * Method to navigate to Udf Definition
   */
  navigateToUdfDefinition() {
    this._router.navigateByUrl(RouterConstants.UDF_DEFINITION_ROUTER);
  }

  /**
   * Method to navigate to UDF Mapping
   */
  navigateToUdfMapping() {
    this._router.navigateByUrl(RouterConstants.UDF_MAPPING_ROUTER);
  }

  /**
   * Method to navigat eto UDF Transfer
   */
  navigateToUdfTransfer() {
    this._router.navigateByUrl(RouterConstants.UDF_CLIENT_TRANSFER_ROUTER);
  }

  /**
   * Method to get permission from the permission array using ction key
   * @param permissionsArray
   */
  getPermissionFromArray(permissionsArray: any[], action: string): boolean {
    let permissionObj: UserPermission = this._helper.getPermissionObject(permissionsArray, action);
    let permission: boolean = false;
    if (permissionObj != undefined) {
      permission = permissionObj[CyncConstants.ENABLED_KEY];
    }
    return permission;
  }

  /**
   * This method gets Permissions for all the UDF Pages
   */
  getPermissons() {
     return forkJoin([this.getUdfDefinitionPermission(), this.getUdfMappingPermission(), this.getUdfTransferPermission()]);
  }

  /**
   * Method to get the Udf Definition Permission
   */
  getUdfDefinitionPermission(): Observable<UserPermission[]> {
    let userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);/*Logged In User*/
    return this._commonApis.getUserPermission(CyncConstants.UDF_DEFINITION_MENU_NAME, userRoleId);
  }

  /**
   * Method to get the Udf Mapping Permission
   */
  getUdfMappingPermission(): Observable<UserPermission[]> {
    let userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);/*Logged In User*/
    return this._commonApis.getUserPermission(CyncConstants.UDF_MAPPING_MENU_NAME, userRoleId);
  }

  /**
   * Method to get the Udf Definition Permission
   */
  getUdfTransferPermission(): Observable<UserPermission[]> {
    let userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);/*Logged In User*/
    // To Do cahnge the menu name to UDF tRANSFER
    return this._commonApis.getUserPermission(CyncConstants.UDF_TRANSFER_MENU_NAME, userRoleId);
  }

}
