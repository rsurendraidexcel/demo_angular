import { Injectable } from "@angular/core";
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { PopupsComponent } from '@cyncCommon//component/popups/popups.component';


@Injectable()
export class GridHelper {
    allMenuPermission: Map<string, string> = new Map<string, string>();
    menuMap: Map<string, string> = new Map<string, string>();
    constructor(private _helper: Helper, private _service: CustomHttpService,private _apiMapper: APIMapper,private _message: MessageServices) {

    }

    /**
     * Method for column filter
     * @param event
     */
    onKey(event: any, module : any, gridModel:any) {
        if (event.target.value == '') {
            module.isCloseBox = false;
            module.isSearchBox = true;
        }
        else {
            module.isCloseBox = true;
            module.isSearchBox = false;
        }
        if (event.target.value == undefined) {
          event.target.value = '';
            module.isCloseBox = false;
            module.isSearchBox = true;
        }
    
        if (gridModel.searchViaAPI) {
            module.searchTerm = event.target.value;
            this._service.getCall<any>(this._apiMapper.searchAPIs[gridModel.type] + module.searchTerm).then(result => {
            module.gridData = result[gridModel.responseKey];
          });
          this._message.showLoader(false);
        }
    
    }

    /**
     * Method for clear global search
     * @param module 
     */
    clearSearchBox(module:any) {
        module.dataTableComponent.reset();
        module.searchTerm = '';
        module.isCloseBox = false;
        module.recordCount = -1;
        module.isSearchBox = true;
    }

    /**
     * Method for checking roles and permissions for grid
     * @param roleId
     */
    checkUserPermissions(roleId: string, module:any, gridModel : any) {
        // below is not required becase permission should be checked for all users. even admin also
        if (roleId !== CyncConstants.ADMIN_ROLE_ID) {
            module.isAddPermitted = this._helper.checkPermissionForMenu(gridModel.menuName, 'create'); // this also can be constant
            module.isDeletePermitted = this._helper.checkPermissionForMenu(gridModel.menuName, 'destroy');
            module.isEditPermitted = this._helper.checkPermissionForMenu(gridModel.menuName, 'update');
        } else {
            module.isAddPermitted = true;
            module.isDeletePermitted = true;
            module.isEditPermitted = true;
        }
    
        this.getData(module, gridModel);
    }

    getUserPermission(module:any, gridModel:any) {
        let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
        let userRoleType = localStorage.getItem('cyncUserRole');
        /**
             * below will be changed once we have menu specific api ready. then no need to store permissions
             * locally into a array
             */
            this._service.getCall('roles/' + userRoleId + '/role_permissions/all_menu_permissions').then(res => {
                const allMenuPermissions: any[] = this._service.bindData(res);
                for (let r = 0; r < allMenuPermissions.length; r++) {
                    const eachPermission = allMenuPermissions[r];
                    for (let j = 0; j < eachPermission.length; j++) {
                        const permission = eachPermission[j];
                        this.storePermissionInArray(permission);
                    }
                }
                this._helper.setMenuPermissions(this.menuMap);
                this.checkUserPermissions(userRoleId, module, gridModel);
            });
    
    }

    storePermissionInArray(rolesAndPermissionObj: any) {
        if (rolesAndPermissionObj.submenu_count > 0) {
          for (let k = 0; k < rolesAndPermissionObj.submenu_list.length; k++) {
            this.storePermissionInArray(rolesAndPermissionObj.submenu_list[k]);
          }
        } else {
          if (rolesAndPermissionObj.sb_sb_sb_sub_menu_name != undefined) {
            this.menuMap.set(rolesAndPermissionObj.sb_sb_sb_sub_menu_name, JSON.stringify(rolesAndPermissionObj.permissions));
          } else {
            this.menuMap.set(rolesAndPermissionObj.sb_sb_sub_menu_name, JSON.stringify(rolesAndPermissionObj.permissions));
          }
        }
    }

    goToAdd(module:any) {    
        console.log("goToAdd");
        module._router.navigateByUrl(module._router.url + '/add');  
    }

    goToEdit(module:any) {
        console.log("goToEdit");
        if (module.isEditPermitted && module.selectedRows !== undefined && module.selectedRows.length == 1) {
           console.log("sending user to edit page" + module.selectedRows[0].id);
           module._router.navigateByUrl(module._router.url + "/" + module.selectedRows[0].id);
        }
    }

    delete(module:any) {
        let idArray = [];
        for (let ids of module.selectedRows) {
          idArray.push(ids.name);
        }
        console.log("selected rows " + idArray);
        let dialogRef = module.dialog.open(PopupsComponent);
        dialogRef.componentInstance.title = "Confirm delete";
        dialogRef.componentInstance.message = 'do you really want to delete this selected users';
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // call deleted api by passing selected row.and recall getData method.
            console.log("user has clicked on yes button");
          } else {
            console.log("user has clicked on cancel button");
          }
        });
    }

    getData(module:any, gridModel:any) {
        this._service.getCall<any>(gridModel.apiDef.getApi).then(result => {
          if(result.recordTotal != undefined){
            module.recordTotal = result.recordTotal;
            module.showTotalrecords = result.recordTotal;
          }
          
          module.gridData = result[gridModel.responseKey];
          module.isDataLoading = true;
          this._message.showLoader(false);
        });
    }

    unSelectChkBox(module:any) {
        console.log("unSelectChkBox");
        this.updateGridIcons(module);
    }

    updateGridIcons(module:any) {
        if (module.isDeletePermitted) {
          module.toggleDeleteIcon = module.selectedRows != undefined && module.selectedRows.length > 0;
        }
    
        if (module.isEditPermitted) {
          module.toggleEditIcon = module.selectedRows != undefined && module.selectedRows.length == 1;
        }
    }

    selectAllChkBox(module:any) {
        console.log("selectAllChkBox");
        if (module.isDeletePermitted) {
            module.toggleDeleteIcon = module.selectedRows != undefined && module.selectedRows.length > 0;
        }
    }

    goToView(selectedRow: any, module:any) {
        console.log("goToView");
        let event: any = selectedRow.originalEvent;
        if (selectedRow.type == 'checkbox') {
          this.updateGridIcons(module);
        } else if (selectedRow.type == 'row') {
          module.selectedRows = '';
          let rowId = selectedRow.data.id;
          console.log("sending user to edit page " + module._router.url + "/" + rowId);      
          module._router.navigateByUrl(module._router.url + "/" + rowId);
        }
    }

    printFilteredData(event:any, module:any) {
        if (event.filteredValue != undefined) {
            module.recordCount = event.filteredValue.length;
            if (module.recordCount == module.gridData.length) {
                module.recordCount = -1;
            }
        }
    }

}