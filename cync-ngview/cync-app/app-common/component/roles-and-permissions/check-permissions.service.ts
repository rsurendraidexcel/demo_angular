import { Injectable } from '@angular/core';
import { RolesAndPermissionService } from './roles-and-permissions.service';


@Injectable()
export class CheckPermissionsService {

	constructor(private _rolesNPermissionService: RolesAndPermissionService) { }


/**
 * 
 * @param permissionArr 
 * @param actionType 
 */
	checkPermissions(permissionArr: any[], actionType: any) {
		for (let i = 0; i < permissionArr.length; i++) {
			if (permissionArr[i].action == actionType) {
				return permissionArr[i].enabled;
			}
		}
	}

	/**
	 * 
	 * @param response 
	 */
	updatePermissionsLocalStorage(response: any) {
		this._rolesNPermissionService.savePermissionsInLocalStorage(response);
	}
}
