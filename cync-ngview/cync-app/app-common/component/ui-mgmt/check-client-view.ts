import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Observable } from "rxjs/Rx";
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

/**
* Check multiple user login for same client
*/
@Injectable()
export class CheckClientView implements CanActivate {
	selectedClient: string;
	constructor(private router: Router, private _helper: Helper, private _commonApis: CommonAPIs, private _clientSelectionService: ClientSelectionService) { }
	canActivate(): Observable<boolean> {
		return this._commonApis.getSameClientLoginInfo().map(result => {
			let isMultiUserLoggedIn = result.multi_user_alert;
			if (isMultiUserLoggedIn) {
				if (confirm("Another user is viewing the same page. Do you want to continue?")) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}).take(1)
	}
}