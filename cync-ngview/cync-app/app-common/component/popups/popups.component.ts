import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FormBuilder} from '@angular/forms'

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.scss']
})

export class PopupsComponent implements OnInit, OnDestroy {
  title: string;
  message: any;
  isConfirmPopup: boolean;
  isAlertMessage: boolean;
  isFileUploadPopup: boolean;
  isPopupWithAppendAndOverride: boolean;
  isCashFlowPopup:boolean;
  isInformationPopUp:boolean;
  isCommentHistoryPopup:boolean;
  assetPath: string = CyncConstants.getAssetsPath();
  getCommentHistory: string;
  isReleaseBroker:boolean;
  isSaveFeeSetupPopup:boolean;
  
  constructor(public dialogRef: MatDialogRef<PopupsComponent>, private _fb: FormBuilder) { }

  ngOnInit() {
    if(this.isCommentHistoryPopup){
      this.getCommentHistory=this.message;
      console.log(" this.getCommentHistory", this.getCommentHistory,this.message);
    }
    if(this.isInformationPopUp){
      console.log(" this.message",this.message);
    }
  }
  transform(value){
    return value.replace(/_/g, " ");
  }
  private closePopup() {
    this.dialogRef.close();
  }

  @HostListener("unloaded")
  ngOnDestroy() {
    
  }
}
