import { Injectable } from "@angular/core"
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { AdvanceSearchPopupComponent } from '@app/shared/components/advance-search-popup/advance-search-popup.component'
import { PopupsComponent } from '@cyncCommon/component/popups/popups.component';
import { Observable } from 'rxjs/Observable';

/**
 * This is to open popups on entire application
 */
@Injectable()
export class OpenPoupService {

    constructor(private dialogRef: MatDialog) {
    }

    /**
    * this method will open advance search popup
    */
    openAdvanceSearchPoup(requestParam: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = requestParam;
        const dialogRef = this.dialogRef.open(AdvanceSearchPopupComponent, dialogConfig);
        return dialogRef.afterClosed();
    }

    /**
     * this method will open popup when ABL file upload is successfull.
     * @param popupParams 
     */
    openFileUploadSuccessPopup(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isFileUploadPopup = true;
        return dialogRef.afterClosed();
    }

    /**
     * this method will open the cofirm popup and return what user has clicked
     * either Apeend or Override
     * @param popupParams
     */
    openPopupWithAppendOverrideButton(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isPopupWithAppendAndOverride = true;
        return dialogRef.afterClosed();
    }
}