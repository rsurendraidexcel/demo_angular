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
 *
 */
@Injectable()
export class CheckClientSelection implements CanActivate {
  selectedClient: string;

  constructor(private router: Router, private _helper: Helper, private _commonApis: CommonAPIs, private _clientSelectionService: ClientSelectionService) { }

  //https://github.com/angular/angular/issues/9613
  canActivate(): Observable<boolean> {
    return this._commonApis.getCurrentUserState2().map(authState => {
      if (!authState) {
        this._helper.openAlertPoup("Information", CyncConstants.CLIENT_SELECTION_MESSAGE);
      }
      return !!authState;
    }).take(1)
  }

  /**
   * this method is to check if user has selected any client or not
   * based on that will take user to any route
   */
  // canActivate1(): Observable<boolean> {
  //     console.log("inside client selection service " + this._helper.isClientSelected());
  //     this._commonApis.getCurrentUserState().map(res => {
  //         console.log('check-2');
  //         let temp = localStorage.getItem('selectedClient');
  //         if ((res !== undefined && res.borrower_id !== undefined && res.borrower_id !== null) || temp != null) {
  //             CyncConstants.setSelectedClient(this.selectedClient);
  //             console.log('return true from client selection');
  //             return Observable.of(true);
  //         } else {
  //             this._helper.openAlertPoup("Information", CyncConstants.CLIENT_SELECTION_MESSAGE);
  //             console.log('return false from client selection');
  //             return Observable.of(false);
  //         }
  //     }).take(1);

  // if (!this._helper.isClientSelected()) {
  //     console.log('check-1');
  //     this._commonApis.getCurrentUserState().subscribe(res => {
  //         console.log('check-2');
  //         let temp = localStorage.getItem('selectedClient');
  //         if ((res !== undefined && res.borrower_id !== undefined && res.borrower_id !== null) || temp != null) {
  //             CyncConstants.setSelectedClient(this.selectedClient);
  //             console.log('return true from client selection');
  //             return Observable.of(true);
  //         } else {
  //             this._helper.openAlertPoup("Information", CyncConstants.CLIENT_SELECTION_MESSAGE);
  //             console.log('return false from client selection');
  //             return Observable.of(false);
  //         }
  //     });
  // } else {
  //     console.log('return true2 client selection');
  //     return Observable.of(true);
  // }
  //}
}